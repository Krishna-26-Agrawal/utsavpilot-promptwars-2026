import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UTSAVPILOT — Plan the celebration. We’ll handle the complexity.',
  description:
    'GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.',
  keywords: [
    'event planner',
    'wedding planner',
    'birthday planner',
    'celebration',
    'AI event planner',
    'Gemini AI',
    'Indian events',
    'INR budget planner'
  ],
  authors: [{ name: 'UtsavPilot Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
