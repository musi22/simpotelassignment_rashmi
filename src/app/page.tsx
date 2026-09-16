'use client';

import React, { useState } from 'react';
import { HotelWebsite } from '@/components/HotelWebsite';
import { AssistantWidget } from '@/components/AssistantWidget';
import hotelData from '@data/hotelKnowledge.json';

export default function HomePage() {
  const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(true);
  const [widgetInitialPrompt, setWidgetInitialPrompt] = useState<string | undefined>(undefined);

  const hotel = hotelData.hotel;

  const handleOpenAssistantWithPrompt = (prompt?: string) => {
    setWidgetInitialPrompt(prompt);
    setIsWidgetOpen(true);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Luxury Resort Website */}
      <HotelWebsite onOpenAssistant={handleOpenAssistantWithPrompt} />

      {/* Meena — Virtual Guest Concierge Widget */}
      <AssistantWidget
        hotelName={hotel.name}
        isOpen={isWidgetOpen}
        onToggle={() => setIsWidgetOpen((prev) => !prev)}
        initialPrompt={widgetInitialPrompt}
      />
    </main>
  );
}

