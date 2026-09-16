'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, User, Bookmark, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { ConversationTurn, AvailabilityField } from '@/lib/types';
import { RoomCard } from './RoomCard';
import { AvailabilityForm } from './AvailabilityForm';
import { voiceService } from '@/lib/voiceService';

interface MessageItemProps {
  turn: ConversationTurn;
  onAvailabilitySubmit?: (details: { checkIn: string; checkOut: string; adults: number }) => void;
  isLatestAssistantTurn?: boolean;
  isLoading?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  turn,
  onAvailabilitySubmit,
  isLatestAssistantTurn = false,
  isLoading = false,
}) => {
  const isGuest = turn.role === 'guest';
  const [showFactDetails, setShowFactDetails] = useState<boolean>(false);
  const [isSpeakingThis, setIsSpeakingThis] = useState<boolean>(false);

  const toggleSpeak = () => {
    if (isSpeakingThis) {
      voiceService.stop();
      setIsSpeakingThis(false);
    } else {
      setIsSpeakingThis(true);
      const isHindi = /namaste|aapka|shamil|kripya|baje|uplabdh/i.test(turn.content);
      voiceService.speak(turn.content, isHindi ? 'hi' : 'en', () => {
        setIsSpeakingThis(false);
      });
    }
  };

  // Format timestamp nicely
  const timeFormatted = (() => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(new Date(turn.timestamp));
    } catch {
      return '';
    }
  })();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isGuest ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: '12px',
        margin: '18px 0',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isGuest
            ? 'linear-gradient(135deg, #c86d51 0%, #b45d43 100%)'
            : 'linear-gradient(135deg, #fff0ea 0%, #fae2d8 100%)',
          border: '1px solid var(--accent-gold)',
          boxShadow: 'var(--shadow-sm)',
          fontSize: '1.1rem',
        }}
        aria-hidden="true"
      >
        {isGuest ? (
          <User size={18} color="#ffffff" />
        ) : (
          <span>🌸</span>
        )}
      </div>

      {/* Message Bubble & Content Container */}
      <div
        style={{
          maxWidth: isGuest ? '78%' : '90%',
          minWidth: '220px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isGuest ? 'flex-end' : 'space-between',
            gap: '8px',
            marginBottom: '4px',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: isGuest ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
              {isGuest ? 'You' : '🌸 Meena (Concierge)'}
            </span>
            {timeFormatted && <span>{timeFormatted}</span>}
          </div>

          {!isGuest && (
            <button
              onClick={toggleSpeak}
              title={isSpeakingThis ? 'Stop voice readout' : 'Listen to Meena (Voice Concierge)'}
              aria-label={isSpeakingThis ? 'Stop voice readout' : 'Listen to Meena'}
              style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: isSpeakingThis ? 'rgba(5, 150, 105, 0.15)' : '#ffffff',
                border: isSpeakingThis ? '1px solid #059669' : '1px solid var(--border-card)',
                color: isSpeakingThis ? '#059669' : 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {isSpeakingThis ? <VolumeX size={12} /> : <Volume2 size={12} />}
              <span>{isSpeakingThis ? 'Stop Voice' : 'Listen'}</span>
            </button>
          )}
        </div>

        {/* Message bubble */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            background: isGuest
              ? 'linear-gradient(135deg, #c86d51 0%, #b45d43 100%)'
              : '#ffffff',
            border: isGuest ? 'none' : '1px solid var(--border-card)',
            color: isGuest ? '#ffffff' : 'var(--text-primary)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            wordBreak: 'break-word',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>{turn.content}</div>

          {/* Fact citations badge if available */}
          {turn.supportingFactIds && turn.supportingFactIds.length > 0 && (
            <div
              style={{
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-gold)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Bookmark size={11} />
                Verified Hotel Sources:
              </span>
              {turn.supportingFactIds.map((factId) => (
                <span
                  key={factId}
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-gold-soft)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-gold-light)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={10} color="var(--accent-gold)" />
                  {factId.replace('fact_', '').replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Inline availability form if this turn needs details */}
        {turn.responseType === 'needs_details' &&
          isLatestAssistantTurn &&
          onAvailabilitySubmit && (
            <AvailabilityForm
              initialDetails={turn.availabilityDetails}
              missingFields={
                ['checkIn', 'checkOut', 'adults'] as AvailabilityField[]
              }
              onSubmit={onAvailabilitySubmit}
              disabled={isLoading}
            />
          )}

        {/* Room availability results grid if returned */}
        {turn.rooms && turn.rooms.length > 0 && (
          <div style={{ marginTop: '14px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px',
              }}
            >
              {turn.rooms.map((room) => (
                <RoomCard key={room.roomId} room={room} />
              ))}
            </div>
          </div>
        )}

        {/* Explicit empty state if availability was searched but 0 rooms returned */}
        {turn.responseType === 'availability' && (!turn.rooms || turn.rooms.length === 0) && (
          <div
            style={{
              marginTop: '12px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
            }}
          >
            <strong>No rooms available:</strong> All accommodations are reserved or capacity limits
            are exceeded for these specific dates. Please select alternative dates or adjust party
            size.
          </div>
        )}
      </div>
    </div>
  );
};
