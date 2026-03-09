import type { Metadata } from 'next';
import SessionProvider from '@/components/providers/SessionProvider';
import '@/styles/moodle-theme.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'MoodleX',
  description: 'MoodleX Learning Management System - Built with Next.js',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
