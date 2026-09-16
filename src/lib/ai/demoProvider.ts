import {
  AIProcessedResult,
  AIProvider,
} from './providerAdapter';
import {
  AvailabilityRequestDetails,
  ConversationTurn,
} from '../types';
import {
  getHotelInfo,
  getFactById,
  getAllRooms,
} from '../knowledgeBase';
import { checkAvailability } from '../availabilityService';

export class DemoProvider implements AIProvider {
  public name = 'Deterministic Demo Provider';
  public isDemo = true;

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
    const raw = message.trim();
    const lower = raw.toLowerCase();
    const hotel = getHotelInfo();

    // 1. Prompt Injection & Jailbreak Guard
    if (
      /ignore\s+(all\s+)?(previous|prior)\s+instructions/i.test(lower) ||
      /system\s+prompt/i.test(lower) ||
      /you\s+are\s+now\s+in\s+dan\s+mode/i.test(lower) ||
      /bypass\s+restrictions/i.test(lower) ||
      /reveal\s+internal\s+rules/i.test(lower)
    ) {
      return {
        responseType: 'fallback',
        message: `Namaste! I am the virtual concierge for ${hotel.name}. I am dedicated exclusively to assisting guests with hotel information, property amenities, and room availability. How may I assist with your stay today?`,
      };
    }

    // Detect Hindi intent based on language toggle, Devanagari script, or keywords
    const isHindi =
      language === 'hi' ||
      /[\u0900-\u097F]/.test(raw) ||
      /\b(kya|hai|hain|kitne|baje|kaun|shamil|nashta|samay|mehmaan|kamra|chahiye|milega|hoga|karein|swagat|namaste|batao|bataiye|kripya|suvidha)\b/i.test(
        lower
      );

    // 2. Check for Availability Intent or Date Submissions
    const isAvailabilityQuery =
      /availab|room\s+for|book|stay|rate|night|vacan|dates|uplabdh|milega|booking|उपलब्ध|उपलब्धता|बुकिंग/i.test(lower) ||
      /\d{4}-\d{2}-\d{2}/.test(lower) ||
      pendingAvailability !== undefined;

    // Extract dates (YYYY-MM-DD)
    const dateMatches = raw.match(/\b\d{4}-\d{2}-\d{2}\b/g) || [];
    let checkIn = pendingAvailability?.checkIn;
    let checkOut = pendingAvailability?.checkOut;

    if (dateMatches.length >= 2) {
      checkIn = dateMatches[0];
      checkOut = dateMatches[1];
    } else if (dateMatches.length === 1) {
      const singleDate = dateMatches[0];
      const isCheckOutContext =
        /check\s*out|depart|leaving|until|through|nikalne|jaane/i.test(lower);
      const isCheckInContext =
        /check\s*in|arrive|arriving|from|starting|aane/i.test(lower);

      if (isCheckOutContext || (pendingAvailability?.checkIn && !pendingAvailability?.checkOut)) {
        checkOut = singleDate;
      } else if (isCheckInContext || !pendingAvailability?.checkIn) {
        checkIn = singleDate;
      } else {
        checkOut = singleDate;
      }
    }

    // Extract adults count (English, numbers, Hindi words)
    let adults = pendingAvailability?.adults;
    const adultsMatch =
      raw.match(/\b(\d+)\s*(adult|guest|people|person|pax|log|mehmaan|vyakti)\b/i) ||
      raw.match(/\bfor\s+(\d+)\b/i) ||
      raw.match(/\b(\d+)\s*of\s+us\b/i);

    if (adultsMatch) {
      const parsed = parseInt(adultsMatch[1], 10);
      if (!isNaN(parsed) && parsed > 0) {
        adults = parsed;
      }
    } else if (/\b(one|ek)\s+(adult|guest|person|log|vyakti)\b/i.test(lower)) {
      adults = 1;
    } else if (/\b(two|do)\s+(adults|guests|people|log|vyakti)\b/i.test(lower)) {
      adults = 2;
    } else if (/\b(three|teen)\s+(adults|guests|people|log|vyakti)\b/i.test(lower)) {
      adults = 3;
    } else if (/\b(four|chaar)\s+(adults|guests|people|log|vyakti)\b/i.test(lower)) {
      adults = 4;
    }

    // Only route to availability workflow if there is clear availability intent
    const hasExplicitAvailKeywords =
      /availab|vacan|check\s+rooms|room\s+rate|reserve\s+a\s+room|book\s+a\s+room|rates\s+for|uplabdh|kamra\s+chahiye/i.test(
        lower
      ) || (dateMatches.length >= 1 && (adults !== undefined || /stay|night|raat/i.test(lower)));

    // Exclude general room suitability or amenity questions from triggering full availability workflow
    const isRoomSuitabilityQuestion =
      /suitable\s+for|which\s+room|fit\s+3|fit\s+three|capacity|kaun\s+sa\s+room|3\s+logo/i.test(lower) &&
      !dateMatches.length;

    if (hasExplicitAvailKeywords && !isRoomSuitabilityQuestion) {
      const currentDetails: AvailabilityRequestDetails = {
        checkIn,
        checkOut,
        adults,
      };

      const missing: ('checkIn' | 'checkOut' | 'adults')[] = [];
      if (!checkIn) missing.push('checkIn');
      if (!checkOut) missing.push('checkOut');
      if (!adults) missing.push('adults');

      if (missing.length > 0) {
        const missingLabels = missing
          .map((f) => (f === 'checkIn' ? 'check-in date' : f === 'checkOut' ? 'check-out date' : 'number of adult guests'))
          .join(', ');

        const msg = isHindi
          ? `Namaste! Room availability check karne ke liye, kripya apna ${missingLabels} pradan karein.`
          : `I'd be delighted to check room availability for you. To provide exact options, could you please provide your ${missingLabels}?`;

        return {
          responseType: 'needs_details',
          message: msg,
          missingAvailabilityFields: missing,
          extractedAvailability: currentDetails,
        };
      }

      // We have all 3 parameters! Run deterministic availability engine
      const availResult = checkAvailability(checkIn!, checkOut!, adults!);

      if (!availResult.success) {
        return {
          responseType: 'fallback',
          message: availResult.errorMessage,
          extractedAvailability: currentDetails,
        };
      }

      const availMsg = isHindi
        ? `Namaste! ${availResult.notes} Neeche diye gaye rooms uplabdh hain:`
        : availResult.notes;

      return {
        responseType: 'availability',
        message: availMsg,
        extractedAvailability: currentDetails,
        rooms: availResult.rooms,
      };
    }

    // 3. Conversation Follow-Up Context Resolution
    const lastAssistantTurn = [...conversationHistory]
      .reverse()
      .find((t) => t.role === 'assistant');

    if (lastAssistantTurn) {
      // Follow-up on pool
      if (
        lastAssistantTurn.supportingFactIds?.includes('fact_pool') &&
        (/heated|hours|open|close|temperature|chlorine|towels|samay|khula/i.test(lower) ||
          /is\s+it\s+(warm|cold|outdoor|indoor)/i.test(lower))
      ) {
        const poolFact = getFactById('fact_pool')!;
        return {
          responseType: 'answer',
          message: isHindi
            ? `Ji haan! Hamara swimming pool heated hai. ${poolFact.canonicalText} ${poolFact.details}`
            : `Yes! ${poolFact.canonicalText} ${poolFact.details}`,
          supportingFactIds: ['fact_pool'],
        };
      }

      // Follow-up on breakfast
      if (
        lastAssistantTurn.supportingFactIds?.includes('fact_breakfast_rules') &&
        (/cost|price|how\s+much|hours|serve|menu|time|kitna|paisa|kharcha/i.test(lower))
      ) {
        const bFact = getFactById('fact_breakfast_rules')!;
        return {
          responseType: 'answer',
          message: `${bFact.canonicalText} ${bFact.details}`,
          supportingFactIds: ['fact_breakfast_rules'],
        };
      }

      // Follow-up on room suitability
      if (
        lastAssistantTurn.supportingFactIds?.includes('fact_room_suitability') &&
        (/four|4|balcony|ocean\s+view|patio|chaar/i.test(lower))
      ) {
        return {
          responseType: 'answer',
          message: `For 4 adults, both our Deluxe Double Queen (2 Queen beds, private patio) and the Azure Penthouse Suite (2 King master bedrooms, oceanfront terrace) accommodate up to 4 guests comfortably.`,
          supportingFactIds: ['fact_room_suitability'],
        };
      }
    }

    // 4. Ambiguous Questions requiring clarification
    if (
      lower === 'tell me about your policies' ||
      lower === 'what are your rules?' ||
      lower === 'policies' ||
      /hotel\s+ke\s+rules|niyam/i.test(lower)
    ) {
      return {
        responseType: 'needs_details',
        message: isHindi
          ? 'Hamare paas cancellation, check-in/out, pets, aur quiet hours se jude niyam hain. Aap kis policy ke baare mein jaanna chahenge?'
          : 'We have specific guidelines for cancellation, check-in/check-out times, pets, parking, and quiet hours. Which policy would you like me to explain?',
      };
    }

    if (lower === 'can i book?' || lower === 'i want to make a reservation' || /room\s+book\s+karna\s+hai/i.test(lower)) {
      return {
        responseType: 'needs_details',
        message: isHindi
          ? 'Swagat hai! Main availability check karne mein aapki madad kar sakta hoon. Kripya check-in date, check-out date aur adult guests ki sankhya batayein.'
          : 'I would be happy to check availability for your stay. Please share your intended check-in date, check-out date, and the number of adult guests.',
        missingAvailabilityFields: ['checkIn', 'checkOut', 'adults'],
      };
    }

    // 5. Direct Question Matching (Hotel Facts)

    // Check-in / check-out
    if (/check-in|check\s+in|checkout|check\s+out|arrival\s+time|departure\s+time|aane\s+ka\s+time|samay|चेक-इन|चेकइन|चेकआउट|चेक-आउट|समय|आगमन|प्रस्थान/i.test(lower)) {
      const fact = getFactById('fact_checkin_checkout')!;
      const msg = isHindi
        ? `Namaste! Standard check-in time dopahar 3:00 PM PST hai aur check-out subah 11:00 AM PST hai. ${fact.details}`
        : `${fact.canonicalText} ${fact.details}`;
      return {
        responseType: 'answer',
        message: msg,
        supportingFactIds: [fact.id],
      };
    }

    // Swimming pool / jacuzzi
    if (/pool|swim|jacuzzi|hot\s+tub|tairna|स्विमिंग|पूल|जकूज़ी|तैरने/i.test(lower)) {
      const fact = getFactById('fact_pool')!;
      const msg = isHindi
        ? `Ji haan, The Grand Azure mein heated outdoor oceanfront infinity pool aur jacuzzi uplabdh hai jo subah 7:00 AM se raat 9:00 PM tak khula rehta hai. ${fact.details}`
        : `${fact.canonicalText} ${fact.details}`;
      return {
        responseType: 'answer',
        message: msg,
        supportingFactIds: [fact.id],
      };
    }

    // Room suitability for three guests / adults
    if (/three|3\s*(adults|guests|people|log|mehmaan)|suitab|which\s+room|teen\s+log|3\s*मेहमान|3\s*लोग|तीन|कमरा\s*सही|कौन\s*सा\s*कमरा/i.test(lower)) {
      const fact = getFactById('fact_room_suitability')!;
      const msg = isHindi
        ? `3 mehmaano ke liye sabse suitable options hain: Deluxe Double Queen (2 Queen beds, from ₹22,000/night) aur Executive Oceanfront Suite (1 King bed + luxury pull-out sofa, from ₹32,000/night). Deluxe King room mein maximum 2 adults allow hain.`
        : `${fact.details} Specifically, the Deluxe Double Queen (from ₹22,000/night) features 2 Queen beds, and the Executive Oceanfront Suite (from ₹32,000/night) includes 1 King bed plus a luxury Queen pull-out sleeper sofa. The Deluxe King room accommodates a maximum of 2 adults.`;
      return {
        responseType: 'answer',
        message: msg,
        supportingFactIds: [fact.id],
      };
    }

    // Breakfast inclusion
    if (/breakfast|dining|brasserie|buffet|morning\s+meal|nashta|khana|नाश्ता|ब्रेकफास्ट|खाना|भोजन/i.test(lower)) {
      const fact = getFactById('fact_breakfast_rules')!;
      const msg = isHindi
        ? `Breakfast inclusion room type par depend karta hai: Executive Suites aur Azure Penthouse Suite mein complimentary artisanal buffet breakfast included hai. Deluxe King aur Queen rooms mein breakfast by default included nahi hai, par aap ise ₹1,500 per adult per day mein add kar sakte hain.`
        : `${fact.canonicalText} ${fact.details}`;
      return {
        responseType: 'answer',
        message: msg,
        supportingFactIds: [fact.id],
      };
    }

    // Cancellation policy
    if (/cancel|cancellation|refund|modify\s+reservation|radd|कैंसिलेशन|रद्द|वापसी/i.test(lower)) {
      const fact = getFactById('fact_cancellation_standard')!;
      const msg = isHindi
        ? `Cancellation Policy: Standard bookings ko check-in date ke 48 hours pehle tak bina kisi fee ke cancel kiya ja sakta hai. 48 hours ke andar cancel karne par 1 night room charge lagta hai.`
        : `${fact.canonicalText} ${fact.details}`;
      return {
        responseType: 'answer',
        message: msg,
        supportingFactIds: [fact.id],
      };
    }

    // Parking / EV
    if (/park|valet|ev\s+charg|electric\s+car|gaadi/i.test(lower)) {
      const fact = getFactById('fact_parking')!;
      return {
        responseType: 'answer',
        message: `${fact.canonicalText} ${fact.details}`,
        supportingFactIds: [fact.id],
      };
    }

    // Pets
    if (/pet|dog|cat|animal|kutta|billi/i.test(lower)) {
      const fact = getFactById('fact_pets')!;
      return {
        responseType: 'answer',
        message: `${fact.canonicalText} ${fact.details}`,
        supportingFactIds: [fact.id],
      };
    }

    // Wi-Fi
    if (/wifi|wi-fi|internet|broadband/i.test(lower)) {
      const fact = getFactById('fact_wifi')!;
      return {
        responseType: 'answer',
        message: `${fact.canonicalText} ${fact.details}`,
        supportingFactIds: [fact.id],
      };
    }

    // Fitness / Spa
    if (/gym|fitness|spa|massage|sauna|peloton/i.test(lower)) {
      const fact = getFactById('fact_fitness_spa')!;
      return {
        responseType: 'answer',
        message: `${fact.canonicalText} ${fact.details}`,
        supportingFactIds: [fact.id],
      };
    }

    // Luggage storage
    if (/luggage|bag|store\s+bags|hold\s+luggage|saman/i.test(lower)) {
      const fact = getFactById('fact_luggage_storage')!;
      return {
        responseType: 'answer',
        message: `${fact.canonicalText} ${fact.details}`,
        supportingFactIds: [fact.id],
      };
    }

    // Airport shuttle
    if (/shuttle|airport|transfer|mry/i.test(lower)) {
      const fact = getFactById('fact_airport_shuttle')!;
      return {
        responseType: 'answer',
        message: `${fact.canonicalText} ${fact.details}`,
        supportingFactIds: [fact.id],
      };
    }

    // Unsupported assumptions & unknown queries
    if (/helicopter|helipad|casino|tiger|ferret|smoking\s+in\s+room|free\s+valet|shir/i.test(lower)) {
      return {
        responseType: 'fallback',
        message: `I'm sorry, but ${hotel.name} does not offer that service or facility. For special requests or custom arrangements, please reach out directly to our Concierge desk at ${hotel.contact.phone} or via email at ${hotel.contact.email}.`,
      };
    }

    // Default polite fallback acknowledging missing knowledge
    return {
      responseType: 'fallback',
      message: isHindi
        ? `Namaste! Hotel ke verified records mein is baare mein jankari uplabdh nahi hai. Hamari 24/7 Concierge team se seedhe sampark karein: ${hotel.contact.phone} ya ${hotel.contact.email}.`
        : `I do not have verified information in the hotel records regarding that request. For accurate assistance, our Concierge team is on duty 24/7 at ${hotel.contact.phone} or ${hotel.contact.email}. How else may I assist with your stay?`,
    };
  }
}
