import Link from 'next/link';
import type { AdminSubcategory } from '@/lib/admin-structure';

interface AdminCategoryGridProps {
  categories: AdminSubcategory[];
}

export default function AdminCategoryGrid({ categories }: AdminCategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.title}
          className="border border-[var(--border-color)] rounded-lg overflow-hidden"
        >
          <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
            <h3 className="text-sm font-semibold m-0">{category.title}</h3>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {category.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors no-underline"
              >
                <div className="text-sm font-medium text-[var(--text-link)]">
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    {item.description}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
