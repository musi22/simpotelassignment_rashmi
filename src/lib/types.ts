export type ResponseType = 'answer' | 'needs_details' | 'availability' | 'fallback';

export interface HotelLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface HotelContact {
  phone: string;
  email: string;
  frontDeskHours: string;
}

export interface HotelInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  location: HotelLocation;
  timezone: string;
  contact: HotelContact;
}

export interface HotelFact {
  id: string;
  category: 'schedule' | 'amenities' | 'dining' | 'policies' | 'rooms' | 'services' | 'transport';
  title: string;
  canonicalText: string;
  details: string;
}

export interface HotelRoom {
  id: string;
  name: string;
  description: string;
  image?: string;
  maxOccupancy: number; // in adults
  bedding: string;
  sizeSqFt: number;
  baseNightlyRate: number;
  currency: string;
  breakfastIncluded: boolean;
  cancellationTier: string;
  amenities: string[];
}

export interface HotelKnowledgeBase {
  hotel: HotelInfo;
  facts: HotelFact[];
  rooms: HotelRoom[];
}

export interface AvailabilityRequestDetails {
  checkIn?: string; // YYYY-MM-DD
  checkOut?: string; // YYYY-MM-DD
  adults?: number;
}

export type AvailabilityField = 'checkIn' | 'checkOut' | 'adults';

export interface RoomAvailabilityResult {
  roomId: string;
  name: string;
  bedding: string;
  image?: string;
  maxOccupancy: number;
  breakfastIncluded: boolean;
  baseNightlyRate: number;
  currency: string;
  nights: number;
  totalBeforeTax: number;
  estimatedTax: number;
  estimatedTotal: number;
  amenities: string[];
  disclaimer: string;
}

export interface AvailabilityServiceSuccess {
  success: true;
  checkIn: string;
  checkOut: string;
  adults: number;
  nights: number;
  rooms: RoomAvailabilityResult[];
  notes: string;
}

export interface AvailabilityServiceFailure {
  success: false;
  errorCode: 'INVALID_DATES' | 'PAST_DATE' | 'INVALID_GUESTS' | 'STAY_TOO_LONG' | 'SERVICE_UNAVAILABLE';
  errorMessage: string;
}

export type AvailabilityServiceResult = AvailabilityServiceSuccess | AvailabilityServiceFailure;

export interface ApiError {
  code: string;
  message: string;
  retryable: boolean;
}

export interface ChatRequestPayload {
  message: string;
  conversationId?: string;
  availabilityDetails?: AvailabilityRequestDetails;
}

export interface ChatResponsePayload {
  conversationId: string;
  responseType: ResponseType;
  message: string;
  supportingFactIds?: string[];
  missingAvailabilityFields?: AvailabilityField[];
  availabilityDetails?: AvailabilityRequestDetails;
  rooms?: RoomAvailabilityResult[];
  error?: ApiError;
}

export interface ConversationTurn {
  id: string;
  role: 'guest' | 'assistant';
  content: string;
  timestamp: string;
  responseType?: ResponseType;
  supportingFactIds?: string[];
  availabilityDetails?: AvailabilityRequestDetails;
  rooms?: RoomAvailabilityResult[];
}

export interface ConversationSession {
  id: string;
  createdAt: number;
  updatedAt: number;
  turns: ConversationTurn[];
  pendingAvailability?: AvailabilityRequestDetails;
}
