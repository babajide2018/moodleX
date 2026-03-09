'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface FooterProps {
  siteName?: string;
}

export default function Footer({ siteName = 'MoodleX' }: FooterProps) {
  const { data: session } = useSession();

  const displayName = session?.user
    ? `${session.user.firstname || session.user.name?.split(' ')[0] || 'User'} ${session.user.lastname || session.user.name?.split(' ').slice(1).join(' ') || ''}`.trim()
    : null;

  return (
    <footer className="footer-moodle">
      <div className="footer-popover-container">
        <div className="footer-links">
          <Link href="/help">MoodleX Docs for this page</Link>
          <Link href="/admin/settings">Data retention summary</Link>
          <Link href="/user/contactsitesupport">Get the mobile app</Link>
        </div>
        <div className="mb-2">
          <span className="text-[var(--text-muted)] text-xs">
            Powered by {siteName}
          </span>
        </div>
        {displayName && (
          <div className="text-xs text-[var(--text-muted)]">
            You are logged in as{' '}
            <Link href="/user/edit" className="text-[var(--text-link)]">
              {displayName}
            </Link>
          </div>
        )}
        <div className="text-xs text-[var(--text-muted)] mt-1">
          <button className="text-[var(--text-link)] bg-transparent border-none cursor-pointer text-xs p-0">
            Reset user tour on this page
          </button>
        </div>
      </div>
    </footer>
  );
}
