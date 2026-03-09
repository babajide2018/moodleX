'use client';

import Breadcrumb, { BreadcrumbItem } from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageHeader({ title, breadcrumbs, actions, children }: PageHeaderProps) {
  return (
    <header className="page-header-moodle">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

      <div className="flex items-start justify-between gap-4">
        <h1>{title}</h1>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>

      {children}
    </header>
  );
}
