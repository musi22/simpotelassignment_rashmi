'use client';

import React from 'react';
import { FileText, X, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import hotelData from '@data/hotelKnowledge.json';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic?: (query: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-gold)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(10, 25, 47, 0.95)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="var(--accent-gold)" />
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Official Resort Compendium & Guest Directory
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Authoritative property guidelines, room capacities, and guest policies
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close document modal"
            style={{
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Document Content Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            fontSize: '0.88rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}
        >
          {/* Document Cover Badge */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: 'var(--accent-gold-light)', fontSize: '0.95rem' }}>
                📄 {hotelData.hotel.name} — Guest Compendium & Policies
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Edition: 2026.3 • Monterey, CA • Local Timezone: {hotelData.hotel.timezone}
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-emerald-soft)',
                color: 'var(--accent-emerald)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={14} />
              Verified Property Standards
            </div>
          </div>

          {/* Section 1: Property Overview */}
          <div style={{ marginBottom: '22px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                color: 'var(--accent-gold)',
                borderBottom: '1px solid var(--border-card)',
                paddingBottom: '6px',
                marginBottom: '10px',
              }}
            >
              1. Property Overview & Contacts
            </h3>
            <p style={{ marginBottom: '8px' }}>{hotelData.hotel.description}</p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.84rem' }}>
              <li><strong>Address:</strong> {hotelData.hotel.location.address}, {hotelData.hotel.location.city}, {hotelData.hotel.location.state} {hotelData.hotel.location.zip}</li>
              <li><strong>Front Desk / Concierge:</strong> {hotelData.hotel.contact.phone} (24/7)</li>
              <li><strong>Guest Support Email:</strong> {hotelData.hotel.contact.email}</li>
            </ul>
          </div>

          {/* Section 2: Room Inventory & Capacities */}
          <div style={{ marginBottom: '22px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                color: 'var(--accent-gold)',
                borderBottom: '1px solid var(--border-card)',
                paddingBottom: '6px',
                marginBottom: '10px',
              }}
            >
              2. Room Categories & Capacity Specifications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              {hotelData.rooms.map((room) => (
                <div
                  key={room.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-card)',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                    {room.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-gold)', marginTop: '2px' }}>
                    Max Capacity: {room.maxOccupancy} Adults • {room.bedding}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Rate: ${room.baseNightlyRate}/night • Breakfast: {room.breakfastIncluded ? 'Included' : 'Optional ($28)'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Grounded Knowledge Chunks */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                color: 'var(--accent-gold)',
                borderBottom: '1px solid var(--border-card)',
                paddingBottom: '6px',
                marginBottom: '10px',
              }}
            >
              3. Verified Property Policies & Amenity Standards
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {hotelData.facts.map((fact) => (
                <div
                  key={fact.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderLeft: '3px solid var(--accent-gold)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      {fact.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontFamily: 'monospace',
                        color: 'var(--accent-gold-light)',
                        background: 'rgba(212, 175, 55, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      #{fact.id}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {fact.canonicalText}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {fact.details}
                  </div>

                  {onSelectTopic && (
                    <button
                      onClick={() => {
                        onSelectTopic(fact.title);
                        onClose();
                      }}
                      style={{
                        marginTop: '8px',
                        fontSize: '0.74rem',
                        color: 'var(--accent-gold)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        textDecoration: 'underline',
                      }}
                    >
                      Ask AI assistant about this topic &rarr;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(10, 25, 47, 0.95)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>All assistant responses are grounded against these canonical sections.</span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-gold)',
              color: '#070e1c',
              fontWeight: 600,
              fontSize: '0.8rem',
            }}
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
