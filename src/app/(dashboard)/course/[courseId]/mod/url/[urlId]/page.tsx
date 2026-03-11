'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { Loader2, AlertCircle, ExternalLink, Globe } from 'lucide-react';

interface UrlModuleData {
  id: string;
  name: string;
  description: string | null;
  moduleType: string;
  urlModule: {
    id: string;
    externalUrl: string;
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

export default function UrlModulePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const urlId = params.urlId as string;

  const [urlModule, setUrlModule] = useState<UrlModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
    { key: 'reports', label: 'Reports', href: `/course/${courseId}/reports` },
    { key: 'more', label: 'More', href: `/course/${courseId}/edit` },
  ];

  useEffect(() => {
    async function fetchUrlModule() {
      try {
        const res = await fetch(`/api/courses/${courseId}/mod/url/${urlId}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'URL resource not found' : 'Failed to load URL resource');
        }
        const data = await res.json();
        setUrlModule(data);
        // Auto-show embed if display mode is set to embed
        if (data.urlModule?.display === 'embed') {
          setShowEmbed(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load URL resource');
      } finally {
        setLoading(false);
      }
    }
    fetchUrlModule();
  }, [courseId, urlId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-sm text-[var(--text-muted)]">
        <Loader2 size={18} className="animate-spin" />
        Loading URL resource...
      </div>
    );
  }

  if (error || !urlModule) {
    return (
      <>
        <PageHeader
          title="URL"
          breadcrumbs={[
            { label: 'My courses', href: '/my/courses' },
            { label: 'Course', href: `/course/${courseId}` },
            { label: 'URL' },
          ]}
        />
        <SecondaryNavigation tabs={courseTabs} />
        <div id="page-content" className="p-4">
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={18} />
            {error || 'URL resource not found'}
          </div>
        </div>
      </>
    );
  }

  const courseShortname = urlModule.section?.course?.shortname || 'Course';
  const externalUrl = urlModule.urlModule?.externalUrl || '#';

  return (
    <>
      <PageHeader
        title={urlModule.name}
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: courseShortname, href: `/course/${courseId}` },
          { label: urlModule.name },
        ]}
      />
      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Module description */}
          {urlModule.description && (
            <p className="text-sm text-[var(--text-muted)] mb-6">
              {urlModule.description}
            </p>
          )}

          {/* URL card */}
          <div className="border border-[var(--border-color)] rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Globe size={48} className="text-[var(--primary)]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                  {urlModule.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-4 break-all">
                  {externalUrl}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Open in new window
                  </a>

                  <button
                    onClick={() => setShowEmbed(!showEmbed)}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    {showEmbed ? 'Hide preview' : 'Show preview'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded iframe */}
          {showEmbed && (
            <div className="mt-4 border border-[var(--border-color)] rounded-lg overflow-hidden">
              <iframe
                src={externalUrl}
                className="w-full border-0"
                style={{ height: '600px' }}
                title={urlModule.name}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
