import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log in to MoodleX',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="page-wrapper">
      {children}
    </div>
  );
}
