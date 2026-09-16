import { format, parseISO, differenceInCalendarDays, addDays, isBefore, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { getHotelInfo, getAllRooms } from './knowledgeBase';
import { MOCK_INVENTORY_CONFIG } from '@data/mockInventory';
import { AvailabilityServiceResult, RoomAvailabilityResult } from './types';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TAX_RATE = 0.14; // 14% occupancy tax & resort fee

export function getHotelCurrentDate(): Date {
  const hotel = getHotelInfo();
  const now = new Date();
  const zoned = toZonedTime(now, hotel.timezone);
  return startOfDay(zoned);
}

/**
 * Validates and checks room availability deterministically against seeded inventory.
 * 
 * Requirements:
 * - Strict YYYY-MM-DD calendar dates.
 * - Interprets dates using hotel timezone (America/Los_Angeles).
 * - Rejects past check-in dates and check-out dates not strictly after check-in.
 * - Positive integer adult count.
 * - Filters by room occupancy limits.
 * - Evaluates every night in the stay (check-out is an exclusive boundary).
 * - Reproducible seeded inventory.
 * - Calculates deterministic prices with clear disclosures.
 */
export function checkAvailability(
  checkIn: string,
  checkOut: string,
  adults: number
): AvailabilityServiceResult {
  // Check simulated failure scenario
  if (MOCK_INVENTORY_CONFIG.simulatedFailureDates.includes(checkIn)) {
    return {
      success: false,
      errorCode: 'SERVICE_UNAVAILABLE',
      errorMessage:
        'The hotel central reservation system is temporarily unreachable for maintenance. Please try again shortly or contact the Concierge desk at +1 (831) 555-0199.',
    };
  }

  // 1. Format validation
  if (!DATE_REGEX.test(checkIn) || !DATE_REGEX.test(checkOut)) {
    return {
      success: false,
      errorCode: 'INVALID_DATES',
      errorMessage: 'Check-in and check-out dates must be formatted as YYYY-MM-DD.',
    };
  }

  const checkInDate = parseISO(checkIn);
  const checkOutDate = parseISO(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return {
      success: false,
      errorCode: 'INVALID_DATES',
      errorMessage: 'One or both dates are invalid calendar dates.',
    };
  }

  // 2. Adult count validation
  if (!Number.isInteger(adults) || adults <= 0) {
    return {
      success: false,
      errorCode: 'INVALID_GUESTS',
      errorMessage: 'Guest count must be a positive whole number of adult guests (minimum 1).',
    };
  }

  if (adults > 8) {
    return {
      success: false,
      errorCode: 'INVALID_GUESTS',
      errorMessage: 'For group reservations exceeding 8 adults, please contact our Group Sales team directly.',
    };
  }

  // 3. Date boundary validation in hotel timezone
  const hotelToday = getHotelCurrentDate();
  const [inY, inM, inD] = checkIn.split('-').map(Number);
  const [outY, outM, outD] = checkOut.split('-').map(Number);

  // Construct dates directly in hotel local frame
  const zonedCheckIn = new Date(inY, inM - 1, inD);
  const zonedCheckOut = new Date(outY, outM - 1, outD);

  if (isBefore(zonedCheckIn, hotelToday)) {
    return {
      success: false,
      errorCode: 'PAST_DATE',
      errorMessage: `Check-in date (${checkIn}) cannot be in the past. Current hotel date is ${format(hotelToday, 'yyyy-MM-dd')}.`,
    };
  }

  const nights = differenceInCalendarDays(zonedCheckOut, zonedCheckIn);
  if (nights <= 0) {
    return {
      success: false,
      errorCode: 'INVALID_DATES',
      errorMessage: `Check-out date (${checkOut}) must be at least 1 night after check-in date (${checkIn}).`,
    };
  }

  if (nights > 30) {
    return {
      success: false,
      errorCode: 'STAY_TOO_LONG',
      errorMessage: 'Online availability is limited to stays up to 30 nights. For extended stays, please contact the Concierge.',
    };
  }

  // 4. Generate all night dates in stay (checkOut is exclusive)
  const stayNights: string[] = [];
  for (let i = 0; i < nights; i++) {
    const nightDate = addDays(zonedCheckIn, i);
    stayNights.push(format(nightDate, 'yyyy-MM-dd'));
  }

  // 5. Evaluate available rooms
  const allRooms = getAllRooms();
  const availableRooms: RoomAvailabilityResult[] = [];

  for (const room of allRooms) {
    // Capacity filter
    if (adults > room.maxOccupancy) {
      continue;
    }

    // Check inventory for every single night
    let hasInventoryEveryNight = true;
    for (const night of stayNights) {
      // Check blackout overrides
      const override = MOCK_INVENTORY_CONFIG.blackouts.find(
        (b) => b.date === night && b.roomId === room.id
      );

      const availableCount =
        override !== undefined
          ? override.availableCount
          : MOCK_INVENTORY_CONFIG.defaultRoomInventory[room.id] ?? 2;

      if (availableCount <= 0) {
        hasInventoryEveryNight = false;
        break;
      }
    }

    if (hasInventoryEveryNight) {
      const totalBeforeTax = room.baseNightlyRate * nights;
      const estimatedTax = Math.round(totalBeforeTax * TAX_RATE);
      const estimatedTotal = totalBeforeTax + estimatedTax;

      availableRooms.push({
        roomId: room.id,
        name: room.name,
        image: room.image,
        bedding: room.bedding,
        maxOccupancy: room.maxOccupancy,
        breakfastIncluded: room.breakfastIncluded,
        baseNightlyRate: room.baseNightlyRate,
        currency: room.currency,
        nights,
        totalBeforeTax,
        estimatedTax,
        estimatedTotal,
        amenities: room.amenities,
        disclaimer: 'Illustrative mock availability & prices. No real reservation is confirmed.',
      });
    }
  }

  return {
    success: true,
    checkIn,
    checkOut,
    adults,
    nights,
    rooms: availableRooms,
    notes:
      availableRooms.length > 0
        ? `Found ${availableRooms.length} room option(s) suitable for ${adults} adult(s) across ${nights} night(s).`
        : `No matching rooms available for ${adults} adult(s) from ${checkIn} to ${checkOut}. Please consider alternate dates or fewer guests per room.`,
  };
}
