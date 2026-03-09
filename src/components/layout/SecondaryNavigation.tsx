'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavTab {
  key: string;
  label: string;
  href: string;
}

interface SecondaryNavigationProps {
  tabs: NavTab[];
}

export default function SecondaryNavigation({ tabs }: SecondaryNavigationProps) {
  const pathname = usePathname();

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="secondary-navigation">
      <ul className="nav">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
