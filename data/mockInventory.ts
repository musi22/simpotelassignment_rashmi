/**
 * Deterministic seeded inventory configuration for The Grand Azure Resort & Spa.
 * Each room type has standard inventory allotments. Certain specific dates are intentionally
 * booked out to enable reproducible testing of no-availability and partial-availability scenarios.
 */

export interface DailyInventoryOverride {
  date: string; // YYYY-MM-DD
  roomId: string;
  availableCount: number;
}

export interface InventoryConfig {
  defaultRoomInventory: Record<string, number>;
  blackouts: DailyInventoryOverride[];
  simulatedFailureDates: string[];
}

export const MOCK_INVENTORY_CONFIG: InventoryConfig = {
  // Baseline units per room type
  defaultRoomInventory: {
    room_deluxe_king: 4,
    room_deluxe_queen: 4,
    room_exec_suite: 2,
    room_penthouse: 1,
  },
  // Deterministic seed overrides for test scenarios
  blackouts: [
    // Scenario: King room is completely sold out on 2026-10-15 & 2026-10-16
    { date: '2026-10-15', roomId: 'room_deluxe_king', availableCount: 0 },
    { date: '2026-10-16', roomId: 'room_deluxe_king', availableCount: 0 },

    // Scenario: Entire resort sold out for exclusive corporate retreat on 2026-11-20
    { date: '2026-11-20', roomId: 'room_deluxe_king', availableCount: 0 },
    { date: '2026-11-20', roomId: 'room_deluxe_queen', availableCount: 0 },
    { date: '2026-11-20', roomId: 'room_exec_suite', availableCount: 0 },
    { date: '2026-11-20', roomId: 'room_penthouse', availableCount: 0 },

    // Scenario: Penthouse suite booked on 2026-12-24 and 2026-12-25
    { date: '2026-12-24', roomId: 'room_penthouse', availableCount: 0 },
    { date: '2026-12-25', roomId: 'room_penthouse', availableCount: 0 },
  ],
  // Special test trigger date to simulate external availability system 503 failure
  simulatedFailureDates: ['2026-12-31'],
};
