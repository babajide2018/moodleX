'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { Loader2, AlertCircle, Tag } from 'lucide-react';

interface LabelModuleData {
  id: string;
  name: string;
  description: string | null;
  moduleType: string;
  labelModule: {
    id: string;
    content: string;
  } | null;
  section: {
    course: {
      id: string;
      shortname: string;
      fullname: string;
    };
  };
}

export default function LabelModulePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const labelId = params.labelId as string;

  const [labelModule, setLabelModule] = useState<LabelModuleData | null>(null);
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
    async function fetchLabelModule() {
      try {
        const res = await fetch(`/api/courses/${courseId}/mod/label/${labelId}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Label not found' : 'Failed to load label');
        }
        const data = await res.json();
        setLabelModule(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load label');
      } finally {
        setLoading(false);
      }
    }
    fetchLabelModule();
  }, [courseId, labelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-sm text-[var(--text-muted)]">
        <Loader2 size={18} className="animate-spin" />
        Loading label...
      </div>
    );
  }

  if (error || !labelModule) {
    return (
      <>
        <PageHeader
          title="Label"
          breadcrumbs={[
            { label: 'My courses', href: '/my/courses' },
            { label: 'Course', href: `/course/${courseId}` },
            { label: 'Label' },
          ]}
        />
        <SecondaryNavigation tabs={courseTabs} />
        <div id="page-content" className="p-4">
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={18} />
            {error || 'Label not found'}
          </div>
        </div>
      </>
    );
  }

  const courseShortname = labelModule.section?.course?.shortname || 'Course';

  return (
    <>
      <PageHeader
        title={labelModule.name}
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: courseShortname, href: `/course/${courseId}` },
          { label: labelModule.name },
        ]}
      />
      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Label content */}
          {labelModule.labelModule?.content ? (
            <div
              className="prose prose-sm max-w-none text-[var(--text-primary)]"
              dangerouslySetInnerHTML={{ __html: labelModule.labelModule.content }}
            />
          ) : (
            <div className="flex items-center gap-3 text-[var(--text-muted)] py-8">
              <Tag size={24} />
              <span className="text-sm">This label has no content.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
