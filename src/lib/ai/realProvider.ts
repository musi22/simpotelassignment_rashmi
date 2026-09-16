import { AIProcessedResult, AIProvider } from './providerAdapter';
import { AvailabilityRequestDetails, ConversationTurn } from '../types';
import { getHotelInfo, getAllFacts, getAllRooms } from '../knowledgeBase';
import { checkAvailability } from '../availabilityService';

/**
 * Real LLM Provider Adapter.
 * Integrates with standard OpenAI-compatible API or Google Gemini API.
 * Uses structured system instructions, separation of facts, and explicit tool schema.
 */
export class RealLLMProvider implements AIProvider {
  public name = 'Live LLM Provider';
  public isDemo = false;

  private apiKey: string;
  private baseURL: string;
  private model: string;

  constructor() {
    // Check for OpenAI or Gemini key
    this.apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || '';
    this.baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!this.apiKey) {
      throw new Error('RealLLMProvider initialized without an API key.');
    }
  }

  public async processGuestMessage({
    message,
    conversationHistory,
    pendingAvailability,
    language,
  }: {
    message: string;
    conversationHistory: ConversationTurn[];
    pendingAvailability?: AvailabilityRequestDetails;
    language?: 'en' | 'hi';
  }): Promise<AIProcessedResult> {
    const hotel = getHotelInfo();
    const facts = getAllFacts();
    const rooms = getAllRooms();

    // Construct strict grounding prompt
    let systemPrompt = `You are the virtual guest assistant for ${hotel.name}.
Location: ${hotel.location.address}, ${hotel.location.city}, ${hotel.location.state}. Timezone: ${hotel.timezone}.
Contact: ${hotel.contact.phone}, ${hotel.contact.email}.
${language === 'hi' ? 'The guest prefers Hindi. Respond in polite, natural conversational Hindi.' : ''}

CRITICAL RULES:
1. Answer ONLY using the facts and room records provided below. DO NOT invent amenities, policies, pricing, or room features.
2. If the user asks something not covered in the facts (e.g. helipad, casino, exotic pets, non-existent policies), politely state that the hotel does not offer this or the information is not on file, and offer the concierge phone/email (${hotel.contact.phone}).
3. For room suitability questions, cite the exact capacity: Deluxe King max 2 adults; Deluxe Double Queen max 4 adults; Executive Suite max 3 adults; Penthouse max 4 adults.
4. For breakfast questions, explain that Executive Suites & Penthouse include breakfast; Deluxe King & Queen do not (available for $28/adult/day).
5. If the guest wants to check room availability, you must extract: checkIn (YYYY-MM-DD), checkOut (YYYY-MM-DD), and adults (number).
6. If any availability fields are missing, return responseType "needs_details" and specify which fields are missing.
7. Return a strictly formatted JSON object with this shape:
{
  "responseType": "answer" | "needs_details" | "availability" | "fallback",
  "message": "Guest facing response message",
  "supportingFactIds": ["fact_..."],
  "extractedAvailability": { "checkIn": "YYYY-MM-DD", "checkOut": "YYYY-MM-DD", "adults": 2 },
  "missingAvailabilityFields": ["checkIn", "checkOut", "adults"]
}

HOTEL FACTS DATABASE:
${JSON.stringify(facts, null, 2)}

ROOM TYPES DATABASE:
${JSON.stringify(rooms, null, 2)}
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6).map((turn) => ({
        role: turn.role === 'assistant' ? 'assistant' : 'user',
        content: turn.content,
      })),
      {
        role: 'user',
        content: pendingAvailability
          ? `[Context: Pending availability details: ${JSON.stringify(pendingAvailability)}]\n\n${message}`
          : message,
      },
    ];

    const res = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`LLM provider returned status ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('LLM provider returned empty response content.');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      throw new Error('Failed to parse structured JSON from LLM output.');
    }

    // Merge extracted availability with pending availability
    const checkIn = parsed.extractedAvailability?.checkIn || pendingAvailability?.checkIn;
    const checkOut = parsed.extractedAvailability?.checkOut || pendingAvailability?.checkOut;
    const adults = parsed.extractedAvailability?.adults || pendingAvailability?.adults;

    // If availability was requested and we now have all fields, run deterministic tool
    if (parsed.responseType === 'availability' || (checkIn && checkOut && adults)) {
      const missing: ('checkIn' | 'checkOut' | 'adults')[] = [];
      if (!checkIn) missing.push('checkIn');
      if (!checkOut) missing.push('checkOut');
      if (!adults) missing.push('adults');

      if (missing.length > 0) {
        return {
          responseType: 'needs_details',
          message: parsed.message || 'Please provide your check-in date, check-out date, and number of adult guests.',
          missingAvailabilityFields: missing,
          extractedAvailability: { checkIn, checkOut, adults },
        };
      }

      // Execute deterministic availability engine
      const toolResult = checkAvailability(checkIn, checkOut, adults);
      if (!toolResult.success) {
        return {
          responseType: 'fallback',
          message: toolResult.errorMessage,
          extractedAvailability: { checkIn, checkOut, adults },
        };
      }

      return {
        responseType: 'availability',
        message: toolResult.notes,
        extractedAvailability: { checkIn, checkOut, adults },
        rooms: toolResult.rooms,
      };
    }

    return {
      responseType: parsed.responseType || 'answer',
      message: parsed.message || 'I am happy to assist you with your stay at The Grand Azure Resort & Spa.',
      supportingFactIds: Array.isArray(parsed.supportingFactIds) ? parsed.supportingFactIds : undefined,
      missingAvailabilityFields: parsed.missingAvailabilityFields,
      extractedAvailability: parsed.extractedAvailability,
    };
  }
}
