'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { Loader2, AlertCircle, FileText } from 'lucide-react';

interface PageModuleData {
  id: string;
  name: string;
  description: string | null;
  moduleType: string;
  pageModule: {
    id: string;
    content: string;
    display: string;
  } | null;
  section: {
    course: {
      id: string;
      shortname: string;
      fullname: string;
    };
  };
}

export default function PageModulePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const pageId = params.pageId as string;

  const [pageModule, setPageModule] = useState<PageModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
    { key: 'reports', label: 'Reports', href: `/course/${courseId}/reports` },
    { key: 'more', label: 'More', href: `/course/${courseId}/edit` },
  ];

  useEffect(() => {
    async function fetchPageModule() {
      try {
        const res = await fetch(`/api/courses/${courseId}/mod/page/${pageId}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Page not found' : 'Failed to load page');
        }
        const data = await res.json();
        setPageModule(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    }
    fetchPageModule();
  }, [courseId, pageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-sm text-[var(--text-muted)]">
        <Loader2 size={18} className="animate-spin" />
        Loading page...
      </div>
    );
  }

  if (error || !pageModule) {
    return (
      <>
        <PageHeader
          title="Page"
          breadcrumbs={[
            { label: 'My courses', href: '/my/courses' },
            { label: 'Course', href: `/course/${courseId}` },
            { label: 'Page' },
          ]}
        />
        <SecondaryNavigation tabs={courseTabs} />
        <div id="page-content" className="p-4">
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={18} />
            {error || 'Page not found'}
          </div>
        </div>
      </>
    );
  }

  const courseShortname = pageModule.section?.course?.shortname || 'Course';

  return (
    <>
      <PageHeader
        title={pageModule.name}
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: courseShortname, href: `/course/${courseId}` },
          { label: pageModule.name },
        ]}
      />
      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Module description */}
          {pageModule.description && (
            <div className="text-sm text-[var(--text-muted)] mb-4 pb-4 border-b border-[var(--border-color)]">
              <div dangerouslySetInnerHTML={{ __html: pageModule.description }} />
            </div>
          )}

          {/* Page content */}
          {pageModule.pageModule?.content ? (
            <div
              className="prose prose-sm max-w-none text-[var(--text-primary)]"
              dangerouslySetInnerHTML={{ __html: pageModule.pageModule.content }}
            />
          ) : (
            <div className="flex items-center gap-3 text-[var(--text-muted)] py-8">
              <FileText size={24} />
              <span className="text-sm">This page has no content.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
