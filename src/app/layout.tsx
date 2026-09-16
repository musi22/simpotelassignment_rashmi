import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Grand Azure Resort & Spa | Virtual Guest Concierge',
  description:
    'Experience five-star hospitality at The Grand Azure Resort & Spa. Ask questions about our oceanfront amenities, check-in times, breakfast options, cancellation terms, or check live room availability.',
  keywords: [
    'hotel guest assistant',
    'Grand Azure Resort',
    'Monterey Bay luxury hotel',
    'hotel concierge',
    'room availability',
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
