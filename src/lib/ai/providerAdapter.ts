import {
  AvailabilityRequestDetails,
  ConversationTurn,
  ResponseType,
  RoomAvailabilityResult,
} from '../types';

export interface AIProcessedResult {
  responseType: ResponseType;
  message: string;
  supportingFactIds?: string[];
  missingAvailabilityFields?: ('checkIn' | 'checkOut' | 'adults')[];
  extractedAvailability?: AvailabilityRequestDetails;
  rooms?: RoomAvailabilityResult[];
}

export interface AIProvider {
  name: string;
  isDemo: boolean;
  processGuestMessage(params: {
    message: string;
    conversationHistory: ConversationTurn[];
    pendingAvailability?: AvailabilityRequestDetails;
    language?: 'en' | 'hi';
  }): Promise<AIProcessedResult>;
}
