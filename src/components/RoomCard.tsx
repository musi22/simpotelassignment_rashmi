'use client';

import React from 'react';
import { Users, Bed, Coffee, Check, Info } from 'lucide-react';
import { RoomAvailabilityResult } from '@/lib/types';

interface RoomCardProps {
  room: RoomAvailabilityResult;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '12px',
        transition: 'all 0.25s ease',
        boxShadow: '0 2px 10px rgba(180, 93, 67, 0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-gold)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(180, 93, 67, 0.16)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-card)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(180, 93, 67, 0.08)';
      }}
    >
      <div>
        {/* Room Photo Preview */}
        {room.image && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '135px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              marginBottom: '12px',
              border: '1px solid var(--border-card)',
              background: '#faede8',
            }}
          >
            <img
              src={room.image}
              alt={room.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </div>
        )}

        {/* Header row with room name & max occupancy */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: '6px',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.08rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {room.name}
          </h3>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(200, 109, 81, 0.1)',
              fontSize: '0.74rem',
              color: 'var(--accent-gold)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            <Users size={12} color="var(--accent-gold)" />
            Max {room.maxOccupancy} Adults
          </span>
        </div>

        {/* Bedding details */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '10px',
          }}
        >
          <Bed size={13} />
          <span>{room.bedding}</span>
        </div>

        {/* Breakfast badge */}
        <div style={{ marginBottom: '10px' }}>
          {room.breakfastIncluded ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 9px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-emerald-soft)',
                color: 'var(--accent-emerald)',
                fontSize: '0.74rem',
                fontWeight: 600,
                border: '1px solid rgba(5, 150, 105, 0.25)',
              }}
            >
              <Coffee size={12} />
              Artisanal Breakfast Included
            </span>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 9px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(200, 109, 81, 0.06)',
                color: 'var(--text-muted)',
                fontSize: '0.74rem',
                border: '1px solid var(--border-card)',
              }}
            >
              Breakfast optional ($28/adult/day)
            </span>
          )}
        </div>

        {/* Amenity tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5px',
            marginBottom: '12px',
          }}
        >
          {room.amenities.slice(0, 4).map((amenity, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                background: '#fff5f2',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-card)',
              }}
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing breakdown & disclaimer */}
      <div
        style={{
          borderTop: '1px solid var(--border-card)',
          paddingTop: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ${room.baseNightlyRate} / night × {room.nights} night{room.nights > 1 ? 's' : ''}
          </span>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--accent-gold)',
                fontFamily: 'var(--font-serif)',
              }}
            >
              ${room.estimatedTotal}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
              {room.currency}
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span>Subtotal: ${room.totalBeforeTax}</span>
          <span>Est. Taxes & Fees (14%): ${room.estimatedTax}</span>
        </div>

        {/* Mock disclosure */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            background: '#fff2ec',
            padding: '5px 9px',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--accent-gold)',
          }}
        >
          <Info size={13} color="var(--accent-gold)" />
          <span>{room.disclaimer}</span>
        </div>
      </div>
    </div>
  );
};
