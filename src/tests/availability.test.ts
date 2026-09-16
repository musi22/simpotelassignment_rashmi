import { describe, it, expect } from 'vitest';
import { checkAvailability } from '../lib/availabilityService';
import { DemoProvider } from '../lib/ai/demoProvider';

describe('Deterministic Availability Engine', () => {
  const provider = new DemoProvider();

  // Pick future dates safe for test evaluation
  const futureCheckIn = '2026-10-01';
  const futureCheckOut = '2026-10-04'; // 3 nights

  it('8. checks availability with valid dates and returns matching room cards', () => {
    const result = checkAvailability(futureCheckIn, futureCheckOut, 2);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.nights).toBe(3);
      expect(result.adults).toBe(2);
      expect(result.rooms.length).toBeGreaterThan(0);

      // Verify deterministic pricing for Deluxe King (₹18,000 * 3 nights = ₹54,000)
      const kingRoom = result.rooms.find((r) => r.roomId === 'room_deluxe_king');
      expect(kingRoom).toBeDefined();
      expect(kingRoom?.currency).toBe('INR');
      expect(kingRoom?.totalBeforeTax).toBe(54000);
      expect(kingRoom?.estimatedTax).toBe(Math.round(54000 * 0.18));
      expect(kingRoom?.estimatedTotal).toBe(54000 + Math.round(54000 * 0.18));
    }
  });

  it('filters out rooms where adult count exceeds room maxOccupancy', () => {
    // 3 adults requested: Deluxe King (max 2) must NOT be returned!
    const result = checkAvailability(futureCheckIn, futureCheckOut, 3);

    expect(result.success).toBe(true);
    if (result.success) {
      const king = result.rooms.find((r) => r.roomId === 'room_deluxe_king');
      expect(king).toBeUndefined(); // Filtered out!

      const queen = result.rooms.find((r) => r.roomId === 'room_deluxe_queen');
      expect(queen).toBeDefined(); // Max 4 adults
      const suite = result.rooms.find((r) => r.roomId === 'room_exec_suite');
      expect(suite).toBeDefined(); // Max 3 adults
    }
  });

  it('9. requests missing availability details when prompt only has partial information', async () => {
    // Only check-in provided, missing checkOut and adults
    const res = await provider.processGuestMessage({
      message: 'Do you have rooms available on 2026-10-15?',
      conversationHistory: [],
    });

    expect(res.responseType).toBe('needs_details');
    expect(res.missingAvailabilityFields).toContain('checkOut');
    expect(res.missingAvailabilityFields).toContain('adults');
    expect(res.extractedAvailability?.checkIn).toBe('2026-10-15');

    // Follow-up supplying check-out and adults
    const followUpRes = await provider.processGuestMessage({
      message: 'Checking out on 2026-10-17 for 2 adults',
      conversationHistory: [],
      pendingAvailability: res.extractedAvailability,
    });

    // Now has all details and processes availability
    expect(followUpRes.responseType).toBe('availability');
    expect(followUpRes.extractedAvailability?.checkIn).toBe('2026-10-15');
    expect(followUpRes.extractedAvailability?.checkOut).toBe('2026-10-17');
    expect(followUpRes.extractedAvailability?.adults).toBe(2);
  });

  it('10a. rejects past check-in dates', () => {
    const pastCheckIn = '2020-01-10';
    const pastCheckOut = '2020-01-12';
    const result = checkAvailability(pastCheckIn, pastCheckOut, 2);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe('PAST_DATE');
      expect(result.errorMessage).toContain('cannot be in the past');
    }
  });

  it('10b. rejects reversed dates where check-out is before check-in', () => {
    const checkIn = '2026-10-10';
    const checkOut = '2026-10-05';
    const result = checkAvailability(checkIn, checkOut, 2);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe('INVALID_DATES');
      expect(result.errorMessage).toContain('must be at least 1 night after check-in');
    }
  });

  it('10c. rejects same-day check-in and check-out (0 nights)', () => {
    const sameDay = '2026-10-10';
    const result = checkAvailability(sameDay, sameDay, 2);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe('INVALID_DATES');
    }
  });

  it('10d. rejects invalid adult guest counts (0 or negative)', () => {
    const resultZero = checkAvailability('2026-10-10', '2026-10-12', 0);
    expect(resultZero.success).toBe(false);
    if (!resultZero.success) {
      expect(resultZero.errorCode).toBe('INVALID_GUESTS');
    }

    const resultNegative = checkAvailability('2026-10-10', '2026-10-12', -2);
    expect(resultNegative.success).toBe(false);
  });

  it('11. returns empty room list when inventory is sold out for one or more nights', () => {
    // 2026-11-20 is seeded as fully booked for the entire resort
    const result = checkAvailability('2026-11-19', '2026-11-21', 2);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.rooms.length).toBe(0);
      expect(result.notes).toContain('No matching rooms available');
    }
  });

  it('12. handles simulated availability service failure scenario gracefully', () => {
    // 2026-12-31 is configured as simulated failure trigger
    const result = checkAvailability('2026-12-31', '2027-01-02', 2);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe('SERVICE_UNAVAILABLE');
      expect(result.errorMessage).toContain('central reservation system is temporarily unreachable');
    }
  });
});
