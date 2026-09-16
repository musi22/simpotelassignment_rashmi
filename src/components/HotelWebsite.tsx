'use client';

import React from 'react';
import {
  Sparkles,
  Calendar,
  Users,
  Award,
  Waves,
  Utensils,
  Coffee,
  ChevronRight,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Globe,
} from 'lucide-react';
import hotelData from '@data/hotelKnowledge.json';

interface HotelWebsiteProps {
  onOpenAssistant: (initialPrompt?: string) => void;
}

export const HotelWebsite: React.FC<HotelWebsiteProps> = ({ onOpenAssistant }) => {
  const hotel = hotelData.hotel;
  const rooms = hotelData.rooms;

  return (
    <div style={{ color: 'var(--text-primary)', overflowX: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Luxury Top Navigation */}
      <nav
        style={{
          borderBottom: '1px solid var(--border-card)',
          background: 'rgba(255, 249, 246, 0.94)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '16px 28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #fff0ea 0%, #fae2d8 100%)',
                border: '1px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(200, 109, 81, 0.2)',
              }}
            >
              <Sparkles size={20} color="var(--accent-gold)" />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: 'var(--text-primary)',
                }}
              >
                THE GRAND AZURE
              </span>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Resort & Spa • Monterey Bay
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '26px',
              fontSize: '0.88rem',
              fontWeight: 500,
            }}
          >
            <a href="#rooms" style={{ color: 'var(--text-secondary)' }}>
              Suites & Rooms
            </a>
            <a href="#amenities" style={{ color: 'var(--text-secondary)' }}>
              Amenities
            </a>
            <a href="#dining" style={{ color: 'var(--text-secondary)' }}>
              Dining
            </a>
            <a href="#contact" style={{ color: 'var(--text-secondary)' }}>
              Contact
            </a>

            {/* Chat with Meena Button */}
            <button
              onClick={() => onOpenAssistant()}
              id="nav-btn-chat-concierge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #c86d51 0%, #b45d43 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.86rem',
                boxShadow: '0 4px 14px rgba(200, 109, 81, 0.35)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(200, 109, 81, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(200, 109, 81, 0.35)';
              }}
            >
              <span style={{ fontSize: '1rem' }}>🌸</span>
              <span>Chat with Meena</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Warm Peach & Oceanfront Photography */}
      <section
        style={{
          position: 'relative',
          padding: '110px 24px 90px',
          textAlign: 'center',
          background:
            'linear-gradient(180deg, rgba(255, 249, 246, 0.72) 0%, rgba(255, 244, 239, 0.90) 75%, #fff9f6 100%), url("/images/hotel_hero.jpg") center center / cover no-repeat',
          borderBottom: '1px solid var(--border-card)',
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          {/* 5-Star Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 18px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--accent-gold)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '22px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Award size={15} color="var(--accent-gold)" />
            Forbes 5-Star Coastal Sanctuary • Monterey, California
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.1rem)',
              fontWeight: 700,
              lineHeight: 1.16,
              marginBottom: '22px',
              color: 'var(--text-primary)',
            }}
          >
            Where Pacific Splendor Meets <br />
            <span className="gold-gradient-text">Unrivaled Hospitality</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '720px',
              margin: '0 auto 38px',
            }}
          >
            Indulge in panoramic ocean vistas, heated infinity pools, and world-class culinary
            excellence. Supported 24/7 by <strong>Meena</strong>, your dedicated personal guest concierge.
          </p>

          {/* Quick Booking / Stay Information Bar */}
          <div
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              padding: '18px 24px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'left', padding: '0 8px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                Check-In Time
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>3:00 PM PST</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Early check-in upon arrival</div>
            </div>

            <div style={{ textAlign: 'left', padding: '0 8px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                Check-Out Time
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>11:00 AM PST</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Express mobile checkout</div>
            </div>

            <div style={{ textAlign: 'left', padding: '0 8px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                Cancellation
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>Free up to 48 hrs</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Flexible reservation</div>
            </div>

            <button
              onClick={() => onOpenAssistant('Check room availability')}
              id="hero-btn-check-availability"
              style={{
                padding: '13px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #c86d51 0%, #b45d43 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(200, 109, 81, 0.35)',
              }}
            >
              <Calendar size={16} />
              <span>Check Live Rooms</span>
            </button>
          </div>

          {/* Real Hotel Photography Highlights Gallery Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              maxWidth: '960px',
              margin: '38px auto 0',
            }}
          >
            {[
              { title: 'The Coastal Sanctuary', img: '/images/hotel_hero.jpg', caption: 'Monterey Oceanfront' },
              { title: 'Luxury Guest Bedrooms', img: '/images/deluxe_king.jpg', caption: 'Italian Linens & Balconies' },
              { title: 'Heated Infinity Pool', img: '/images/amenity_pool.jpg', caption: 'Saline Oceanfront Deck' },
              { title: 'Azure Brasserie Dining', img: '/images/amenity_dining.jpg', caption: 'Fresh Farm-to-Table' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '125px',
                  border: '1px solid var(--border-card)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  background: '#f8ece8',
                }}
                onClick={() => onOpenAssistant(`Tell me more about ${item.title}`)}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 'auto 0 0 0',
                    padding: '8px 12px',
                    background: 'linear-gradient(0deg, rgba(35, 24, 21, 0.88) 0%, rgba(35, 24, 21, 0.4) 70%, transparent 100%)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>{item.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#ffd5cb' }}>{item.caption}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural & Multilingual Hospitality Banner */}
      <section
        style={{
          padding: '30px 24px',
          background: 'linear-gradient(90deg, #fff2ec 0%, #faede8 100%)',
          borderBottom: '1px solid var(--border-card)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '2rem' }}>🙏</span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.98rem' }}>
                Atithi Devo Bhava • Indian & Global Hospitality Welcome
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Meena understands inquiries in English, हिन्दी (Hindi), and Hinglish with hands-free voice assistance.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenAssistant('Check-in ka time kya hai?')}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                color: 'var(--accent-gold)',
                fontSize: '0.82rem',
                fontWeight: 600,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              &quot;Check-in ka time kya hai?&quot;
            </button>
            <button
              onClick={() => onOpenAssistant('3 logo ke liye kaun sa room sahi rahega?')}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                color: 'var(--accent-gold)',
                fontSize: '0.82rem',
                fontWeight: 600,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              &quot;3 logo ke liye kaun sa room?&quot;
            </button>
          </div>
        </div>
      </section>

      {/* Accommodations Showcase */}
      <section id="rooms" style={{ padding: '85px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span
            style={{
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--accent-gold)',
              fontWeight: 700,
            }}
          >
            Refined Living
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              fontWeight: 700,
              marginTop: '6px',
              color: 'var(--text-primary)',
            }}
          >
            Our Luxury Rooms & Suites
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '620px', margin: '8px auto 0' }}>
            Thoughtfully appointed with bespoke furnishings, Italian linens, rainfall showers, and coastal balconies.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
          }}
        >
          {rooms.map((room) => (
            <div
              key={room.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                background: '#ffffff',
                border: '1px solid var(--border-card)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div>
                {/* Real Hotel Room Photography */}
                {(room as any).image && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '220px',
                      overflow: 'hidden',
                      background: '#faede8',
                    }}
                  >
                    <img
                      src={(room as any).image}
                      alt={room.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(255, 255, 255, 0.94)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        padding: '5px 12px',
                        fontSize: '0.8rem',
                        color: 'var(--accent-gold)',
                        fontWeight: 700,
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      ${room.baseNightlyRate} / night
                    </div>
                  </div>
                )}

                <div style={{ padding: '24px 24px 16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '8px',
                      marginBottom: '10px',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.22rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}
                    >
                      {room.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--accent-gold)',
                        background: 'var(--accent-gold-soft)',
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-sm)',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                      }}
                    >
                      Max {room.maxOccupancy} Adults
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.58,
                      marginBottom: '14px',
                    }}
                  >
                    {room.description}
                  </p>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    <strong>Bedding:</strong> {room.bedding} ({room.sizeSqFt} sq ft)
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    {room.breakfastIncluded ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.76rem',
                          color: 'var(--accent-emerald)',
                          background: 'var(--accent-emerald-soft)',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 600,
                        }}
                      >
                        <Coffee size={13} /> Artisanal Breakfast Included
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Breakfast optional ($28/adult/day)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-card)',
                  padding: '14px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(253, 240, 235, 0.4)',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: 'var(--accent-gold)',
                      fontFamily: 'var(--font-serif)',
                    }}
                  >
                    ₹{room.baseNightlyRate.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                    / night
                  </span>
                </div>

                <button
                  onClick={() => onOpenAssistant(`Is the ${room.name} available for my dates?`)}
                  style={{
                    fontSize: '0.84rem',
                    color: '#ffffff',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #c86d51 0%, #b45d43 100%)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <span>Inquire with Meena</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resort Amenities & Dining */}
      <section
        id="amenities"
        style={{
          padding: '85px 24px',
          background: 'linear-gradient(180deg, #fdf0eb 0%, #faede8 100%)',
          borderTop: '1px solid var(--border-card)',
          borderBottom: '1px solid var(--border-card)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span
              style={{
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'var(--accent-gold)',
                fontWeight: 700,
              }}
            >
              Exceptional Escapes
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.5rem',
                fontWeight: 700,
                marginTop: '6px',
                color: 'var(--text-primary)',
              }}
            >
              World-Class Amenities & Dining
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '620px', margin: '8px auto 0' }}>
              Experience curated coastal wellness, heated oceanfront waters, and award-winning California gastronomy.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '26px',
            }}
          >
            {/* Amenity 1: Pool */}
            <div
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid var(--border-card)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/amenity_pool.jpg"
                  alt="Oceanfront Infinity Pool"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </div>
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Waves size={22} color="var(--accent-gold)" />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
                    Oceanfront Infinity Pool
                  </h3>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  Heated saline pool and outdoor jacuzzi overlooking the Monterey coastline. Open daily 7:00 AM – 9:00 PM.
                </p>
              </div>
            </div>

            {/* Amenity 2: Dining */}
            <div
              id="dining"
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid var(--border-card)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/amenity_dining.jpg"
                  alt="Azure Brasserie Dining"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </div>
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Utensils size={22} color="var(--accent-gold)" />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
                    Azure Brasserie Dining
                  </h3>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  Locally sourced farm-to-table breakfast and fine coastal dining featuring fresh Monterey seafood.
                </p>
              </div>
            </div>

            {/* Amenity 3: Spa */}
            <div
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid var(--border-card)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/amenity_spa.jpg"
                  alt="Serenity Coastal Spa"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </div>
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={22} color="var(--accent-gold)" />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
                    Serenity Coastal Spa
                  </h3>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  Bespoke wellness rituals, eucalyptus steam rooms, and hot stone massage therapies (9 AM – 8 PM).
                </p>
              </div>
            </div>

            {/* Amenity 4: Valet */}
            <div
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid var(--border-card)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/images/amenity_valet.jpg"
                  alt="Valet & EV Charging"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </div>
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ShieldCheck size={22} color="var(--accent-gold)" />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
                    Valet & EV Supercharging
                  </h3>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  24/7 dedicated valet parking with complimentary Tesla & universal Level 2 EV charging stations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section id="contact" style={{ padding: '75px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-card)',
            padding: '40px',
            boxShadow: 'var(--shadow-md)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>
              Coastal Sanctuary
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', marginTop: '6px', marginBottom: '14px', fontWeight: 700 }}>
              Visit The Grand Azure
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Nestled along the rugged cliffs of Monterey Bay with private coastline access, our sanctuary is just 10 minutes from Monterey Regional Airport (MRY).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="var(--accent-gold)" />
                <span>{hotel.location.address}, {hotel.location.city}, {hotel.location.state} {hotel.location.zip}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--accent-gold)" />
                <span>Concierge Desk: {hotel.contact.phone} (24/7)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="var(--accent-gold)" />
                <span>Guest Services: {hotel.contact.email}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #fff2ec 0%, #faede8 100%)',
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '2.5rem' }}>🌸</span>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: '10px 0 6px', fontWeight: 700 }}>
              Have Questions Before Booking?
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Meena is available 24/7 to check live rates, explain room suitability, or arrange spa treatments.
            </p>
            <button
              onClick={() => onOpenAssistant()}
              style={{
                padding: '10px 22px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #c86d51 0%, #b45d43 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                boxShadow: '0 4px 14px rgba(200, 109, 81, 0.3)',
              }}
            >
              Ask Meena Now
            </button>
          </div>
        </div>
      </section>

      {/* Luxury Footer with Social Links & Credits */}
      <footer
        style={{
          padding: '50px 24px 40px',
          background: '#ffffff',
          borderTop: '1px solid var(--border-card)',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '36px',
            paddingBottom: '36px',
            borderBottom: '1px solid var(--border-card)',
          }}
        >
          {/* Column 1: Resort Info */}
          <div style={{ maxWidth: '360px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '8px' }}>
              {hotel.name}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
              An exclusive 5-star coastal retreat offering panoramic Pacific views, fine dining, world-class wellness, and personalized concierge care.
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {hotel.location.address}, {hotel.location.city}, {hotel.location.state}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', fontSize: '0.92rem' }}>
              Explore Resort
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <a href="#rooms" style={{ color: 'var(--text-secondary)' }}>Luxury Accommodations</a>
              <a href="#amenities" style={{ color: 'var(--text-secondary)' }}>Infinity Pool & Jacuzzi</a>
              <a href="#dining" style={{ color: 'var(--text-secondary)' }}>Azure Brasserie Dining</a>
              <a href="#contact" style={{ color: 'var(--text-secondary)' }}>Location & Map</a>
            </div>
          </div>

          {/* Column 3: Social Links */}
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', fontSize: '0.92rem' }}>
              Connect & Follow
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                }}
              >
                <Instagram size={17} color="var(--accent-gold)" />
                <span>Instagram (@GrandAzureResort)</span>
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                }}
              >
                <Facebook size={17} color="var(--accent-gold)" />
                <span>Facebook (The Grand Azure)</span>
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                }}
              >
                <Globe size={17} color="var(--accent-gold)" />
                <span>TripAdvisor Top Pick 2026</span>
              </a>
            </div>
          </div>

          {/* Column 4: Personal Concierge */}
          <div style={{ maxWidth: '280px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', fontSize: '0.92rem' }}>
              Meena — Digital Concierge
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '10px' }}>
              Available 24/7 to answer questions, verify dates, and check live suite availability.
            </div>
            <button
              onClick={() => onOpenAssistant()}
              style={{
                color: 'var(--accent-gold)',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Launch Concierge</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Sub-footer / Author Attribution */}
        <div
          style={{
            maxWidth: '1240px',
            margin: '24px auto 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} The Grand Azure Resort & Spa. All rights reserved.
          </div>
          <div style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>
            Designed & Developed by Rashmi • Monterey Bay, California
          </div>
        </div>
      </footer>
    </div>
  );
};
