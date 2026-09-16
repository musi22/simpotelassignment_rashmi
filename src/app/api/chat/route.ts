import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { conversationStore } from '@/lib/conversationStore';
import { getAIProvider } from '@/lib/ai';
import { validateFactReferences } from '@/lib/knowledgeBase';
import { logger } from '@/lib/logger';
import { ChatResponsePayload } from '@/lib/types';

// Strict input validation schema
const ChatPayloadSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, { message: 'Message cannot be empty.' })
    .max(1000, { message: 'Message cannot exceed 1000 characters.' }),
  conversationId: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_-]{1,64}$/, {
      message: 'Conversation ID must be 1-64 alphanumeric characters, underscores, or hyphens.',
    })
    .optional(),
  availabilityDetails: z
    .object({
      checkIn: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Check-in must be YYYY-MM-DD' })
        .optional(),
      checkOut: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Check-out must be YYYY-MM-DD' })
        .optional(),
      adults: z.number().int().min(1).max(8).optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let conversationId = '';

  try {
    const rawBody = await req.json();
    const parseResult = ChatPayloadSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Invalid request payload';
      logger.warn('Validation error on chat request', {
        error: firstError,
      });

      const errorResponse: ChatResponsePayload = {
        conversationId: rawBody?.conversationId || `conv_${Date.now()}`,
        responseType: 'fallback',
        message: firstError,
        error: {
          code: 'INVALID_INPUT',
          message: firstError,
          retryable: false,
        },
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { message, availabilityDetails } = parseResult.data;
    conversationId = parseResult.data.conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const session = conversationStore.getOrCreateSession(conversationId);

    // Merge incoming availability details into session state
    if (availabilityDetails) {
      conversationStore.updatePendingAvailability(conversationId, availabilityDetails);
    }

    // Record guest message
    conversationStore.addTurn(conversationId, {
      role: 'guest',
      content: message,
      availabilityDetails,
    });

    // Obtain provider and process message
    const provider = getAIProvider();
    logger.info('Processing guest message', {
      conversationId,
      provider: provider.name,
      isDemo: provider.isDemo,
      messageLength: message.length,
    });

    const aiResult = await provider.processGuestMessage({
      message,
      conversationHistory: session.turns,
      pendingAvailability: session.pendingAvailability,
    });

    // Update pending availability if AI extracted new fields
    if (aiResult.extractedAvailability) {
      conversationStore.updatePendingAvailability(conversationId, aiResult.extractedAvailability);
    }

    // Server-side validation of referenced facts
    let validatedFactIds: string[] | undefined = aiResult.supportingFactIds;
    if (validatedFactIds && validatedFactIds.length > 0) {
      const factCheck = validateFactReferences(validatedFactIds);
      if (!factCheck.valid) {
        logger.warn('AI referenced unknown fact IDs', {
          invalidIds: factCheck.invalidIds,
          conversationId,
        });
        validatedFactIds = validatedFactIds.filter((id) => !factCheck.invalidIds.includes(id));
      }
    }

    // Record assistant turn
    conversationStore.addTurn(conversationId, {
      role: 'assistant',
      content: aiResult.message,
      responseType: aiResult.responseType,
      supportingFactIds: validatedFactIds,
      availabilityDetails: session.pendingAvailability,
      rooms: aiResult.rooms,
    });

    const durationMs = Date.now() - startTime;
    logger.info('Chat response completed successfully', {
      conversationId,
      responseType: aiResult.responseType,
      roomsCount: aiResult.rooms?.length ?? 0,
      durationMs,
    });

    const responsePayload: ChatResponsePayload = {
      conversationId,
      responseType: aiResult.responseType,
      message: aiResult.message,
      supportingFactIds: validatedFactIds,
      missingAvailabilityFields: aiResult.missingAvailabilityFields,
      availabilityDetails: session.pendingAvailability,
      rooms: aiResult.rooms,
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    logger.error('Unhandled failure in chat endpoint', {
      conversationId,
      durationMs,
      error: error?.message || 'Unknown error',
    });

    const errorResponse: ChatResponsePayload = {
      conversationId: conversationId || `conv_error_${Date.now()}`,
      responseType: 'fallback',
      message:
        'We encountered a temporary issue processing your request. Please try again or contact our Concierge desk at +1 (831) 555-0199.',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error?.message || 'Internal server error occurred.',
        retryable: true,
      },
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
