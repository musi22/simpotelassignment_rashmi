'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { AvailabilityField, AvailabilityRequestDetails } from '@/lib/types';

interface AvailabilityFormProps {
  initialDetails?: AvailabilityRequestDetails;
  missingFields?: AvailabilityField[];
  onSubmit: (details: { checkIn: string; checkOut: string; adults: number }) => void;
  disabled?: boolean;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  initialDetails,
  missingFields = [],
  onSubmit,
  disabled = false,
}) => {
  const [checkIn, setCheckIn] = useState<string>(initialDetails?.checkIn || '');
  const [checkOut, setCheckOut] = useState<string>(initialDetails?.checkOut || '');
  const [adults, setAdults] = useState<number>(initialDetails?.adults || 2);
  const [localError, setLocalError] = useState<string | null>(null);

  // Today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialDetails?.checkIn) setCheckIn(initialDetails.checkIn);
    if (initialDetails?.checkOut) setCheckOut(initialDetails.checkOut);
    if (initialDetails?.adults) setAdults(initialDetails.adults);
  }, [initialDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!checkIn) {
      setLocalError('Please select a check-in date.');
      return;
    }
    if (!checkOut) {
      setLocalError('Please select a check-out date.');
      return;
    }
    if (checkOut <= checkIn) {
      setLocalError('Check-out date must be after check-in date.');
      return;
    }
    if (!adults || adults < 1) {
      setLocalError('Please select at least 1 adult guest.');
      return;
    }

    onSubmit({ checkIn, checkOut, adults });
  };

  const isFieldMissing = (field: AvailabilityField) => missingFields.includes(field);

  return (
    <div
      style={{
        marginTop: '12px',
        padding: '16px',
        background: '#ffffff',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 18px rgba(180, 93, 67, 0.12)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          color: 'var(--accent-gold)',
          fontSize: '0.9rem',
          fontWeight: 700,
        }}
      >
        <Calendar size={16} color="var(--accent-gold)" />
        <span>Specify Stay Details to Check Live Availability</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          {/* Check-In */}
          <div>
            <label
              htmlFor="form-checkin"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: isFieldMissing('checkIn') ? 'var(--accent-gold-light)' : 'var(--text-muted)',
                marginBottom: '4px',
                fontWeight: isFieldMissing('checkIn') ? 600 : 500,
              }}
            >
              Check-In Date {isFieldMissing('checkIn') && '●'}
            </label>
            <input
              id="form-checkin"
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              disabled={disabled}
              required
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: isFieldMissing('checkIn')
                  ? '1px solid var(--accent-gold)'
                  : '1px solid var(--border-card)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          {/* Check-Out */}
          <div>
            <label
              htmlFor="form-checkout"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: isFieldMissing('checkOut') ? 'var(--accent-gold-light)' : 'var(--text-muted)',
                marginBottom: '4px',
                fontWeight: isFieldMissing('checkOut') ? 600 : 500,
              }}
            >
              Check-Out Date {isFieldMissing('checkOut') && '●'}
            </label>
            <input
              id="form-checkout"
              type="date"
              min={checkIn || todayStr}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              disabled={disabled}
              required
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: isFieldMissing('checkOut')
                  ? '1px solid var(--accent-gold)'
                  : '1px solid var(--border-card)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          {/* Adult Guests */}
          <div>
            <label
              htmlFor="form-adults"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: isFieldMissing('adults') ? 'var(--accent-gold-light)' : 'var(--text-muted)',
                marginBottom: '4px',
                fontWeight: isFieldMissing('adults') ? 600 : 500,
              }}
            >
              Adult Guests (18+) {isFieldMissing('adults') && '●'}
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="form-adults"
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                disabled={disabled}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: isFieldMissing('adults')
                    ? '1px solid var(--accent-gold)'
                    : '1px solid var(--border-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Adult' : 'Adults'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Local Error feedback */}
        {localError && (
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--accent-ruby)',
              marginBottom: '10px',
            }}
          >
            {localError}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            * Adult count is used for room capacity rules
          </span>

          <button
            type="submit"
            id="btn-submit-availability-form"
            disabled={disabled}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #c86d51 0%, #b45d43 100%)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(200, 109, 81, 0.35)',
            }}
          >
            <span>Search Rooms with Meena</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </form>
    </div>
  );
};
