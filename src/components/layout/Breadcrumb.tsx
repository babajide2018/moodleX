'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb-moodle">
        <li>
          <Link href="/" className="flex items-center">
            <Home size={14} />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className={index === items.length - 1 ? 'active' : ''}>
            {item.href && index < items.length - 1 ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
