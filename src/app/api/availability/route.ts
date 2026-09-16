import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkAvailability } from '@/lib/availabilityService';
import { logger } from '@/lib/logger';

const AvailabilityQuerySchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-in must be YYYY-MM-DD'),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-out must be YYYY-MM-DD'),
  adults: z.coerce.number().int().min(1).max(8),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQuery = {
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    adults: searchParams.get('adults') || '',
  };

  const parsed = AvailabilityQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        errorCode: 'INVALID_QUERY_PARAMETERS',
        errorMessage: parsed.error.errors[0]?.message || 'Invalid parameters',
      },
      { status: 400 }
    );
  }

  const { checkIn, checkOut, adults } = parsed.data;
  const result = checkAvailability(checkIn, checkOut, adults);

  if (!result.success) {
    logger.warn('Availability check failed', { checkIn, checkOut, adults, error: result.errorMessage });
    return NextResponse.json(result, { status: result.errorCode === 'SERVICE_UNAVAILABLE' ? 503 : 400 });
  }

  return NextResponse.json(result, { status: 200 });
}
