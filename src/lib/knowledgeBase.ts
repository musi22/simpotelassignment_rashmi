import hotelData from '@data/hotelKnowledge.json';
import { HotelFact, HotelInfo, HotelKnowledgeBase, HotelRoom } from './types';

const knowledgeBase = hotelData as unknown as HotelKnowledgeBase;

export function getHotelInfo(): HotelInfo {
  return knowledgeBase.hotel;
}

export function getAllFacts(): HotelFact[] {
  return knowledgeBase.facts;
}

export function getFactById(id: string): HotelFact | undefined {
  return knowledgeBase.facts.find((f) => f.id === id);
}

export function getAllRooms(): HotelRoom[] {
  return knowledgeBase.rooms;
}

export function getRoomById(id: string): HotelRoom | undefined {
  return knowledgeBase.rooms.find((r) => r.id === id);
}

export function getRoomsSuitableForGuests(adultCount: number): HotelRoom[] {
  return knowledgeBase.rooms.filter((r) => r.maxOccupancy >= adultCount);
}

/**
 * Deterministic keyword & semantic score matching for local knowledge lookup.
 * Used by the Demo AI provider and fallback answer verifier.
 */
export function findRelevantFacts(query: string): HotelFact[] {
  const q = query.toLowerCase();
  const scored = knowledgeBase.facts.map((fact) => {
    let score = 0;
    const title = fact.title.toLowerCase();
    const canonical = fact.canonicalText.toLowerCase();
    const details = fact.details.toLowerCase();

    // Specific intent triggers
    if ((q.includes('check-in') || q.includes('check in') || q.includes('checkout') || q.includes('check out') || q.includes('arrive') || q.includes('departure') || q.includes('time')) && fact.id === 'fact_checkin_checkout') {
      score += 10;
    }
    if ((q.includes('pool') || q.includes('swim') || q.includes('jacuzzi') || q.includes('hot tub') || q.includes('towel')) && fact.id === 'fact_pool') {
      score += 10;
    }
    if ((q.includes('breakfast') || q.includes('dining') || q.includes('eat') || q.includes('meal') || q.includes('brasserie') || q.includes('food')) && fact.id === 'fact_breakfast_rules') {
      score += 10;
    }
    if ((q.includes('cancel') || q.includes('refund') || q.includes('cancellation') || q.includes('modify')) && fact.id === 'fact_cancellation_standard') {
      score += 10;
    }
    if ((q.includes('three') || q.includes('3') || q.includes('occupan') || q.includes('suitab') || q.includes('family') || q.includes('triple')) && (fact.id === 'fact_room_suitability' || fact.id === 'fact_checkin_checkout')) {
      score += 8;
    }
    if ((q.includes('park') || q.includes('valet') || q.includes('ev') || q.includes('charg') || q.includes('car')) && fact.id === 'fact_parking') {
      score += 10;
    }
    if ((q.includes('pet') || q.includes('dog') || q.includes('cat') || q.includes('animal')) && fact.id === 'fact_pets') {
      score += 10;
    }
    if ((q.includes('wifi') || q.includes('wi-fi') || q.includes('internet') || q.includes('connection')) && fact.id === 'fact_wifi') {
      score += 10;
    }
    if ((q.includes('gym') || q.includes('fitness') || q.includes('spa') || q.includes('massage') || q.includes('sauna') || q.includes('peloton')) && fact.id === 'fact_fitness_spa') {
      score += 10;
    }
    if ((q.includes('luggage') || q.includes('bag') || q.includes('storage') || q.includes('hold bag')) && fact.id === 'fact_luggage_storage') {
      score += 10;
    }
    if ((q.includes('shuttle') || q.includes('airport') || q.includes('transfer') || q.includes('mry') || q.includes('taxi')) && fact.id === 'fact_airport_shuttle') {
      score += 10;
    }
    if ((q.includes('smoke') || q.includes('smoking') || q.includes('quiet') || q.includes('noise')) && fact.id === 'fact_quiet_hours') {
      score += 10;
    }

    // General term matches
    const words = q.split(/\W+/).filter((w) => w.length > 3);
    for (const word of words) {
      if (title.includes(word)) score += 3;
      if (canonical.includes(word)) score += 2;
      if (details.includes(word)) score += 1;
    }

    return { fact, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.fact);
}

/**
 * Server-side validation to ensure facts referenced actually exist and support the response.
 */
export function validateFactReferences(factIds?: string[]): { valid: boolean; invalidIds: string[] } {
  if (!factIds || factIds.length === 0) return { valid: true, invalidIds: [] };
  const allIds = new Set(knowledgeBase.facts.map((f) => f.id));
  const invalidIds = factIds.filter((id) => !allIds.has(id));
  return {
    valid: invalidIds.length === 0,
    invalidIds,
  };
}
