'use client';

import { useParams } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { Download, FileText, File, FileImage, FileSpreadsheet, Film, Archive } from 'lucide-react';

const mimeIcons: Record<string, React.ReactNode> = {
  'application/pdf': <FileText size={48} className="text-red-500" />,
  'image/jpeg': <FileImage size={48} className="text-blue-500" />,
  'image/png': <FileImage size={48} className="text-blue-500" />,
  'application/vnd.ms-excel': <FileSpreadsheet size={48} className="text-green-600" />,
  'video/mp4': <Film size={48} className="text-purple-500" />,
  'application/zip': <Archive size={48} className="text-amber-500" />,
  'default': <File size={48} className="text-[var(--text-muted)]" />,
};

const demoResource = {
  id: 'm7',
  name: 'Variables Lecture Notes',
  description: 'Comprehensive lecture notes covering variables, data types, constants, and type conversion in modern programming languages.',
  filename: 'Week2_Variables_LectureNotes.pdf',
  filesize: 2457600, // 2.4MB
  mimetype: 'application/pdf',
  uploadedBy: 'Sarah Johnson',
  uploadedAt: '2026-03-05T08:30:00',
  downloads: 67,
};

export default function ResourcePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const resource = demoResource;

  const icon = mimeIcons[resource.mimetype] || mimeIcons['default'];

  return (
    <>
      <PageHeader
        title={resource.name}
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: resource.name },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-3xl">
          {/* Description */}
          {resource.description && (
            <p className="text-sm text-[var(--text-primary)] mb-6">
              {resource.description}
            </p>
          )}

          {/* File card */}
          <div className="border border-[var(--border-color)] rounded-lg p-6">
            <div className="flex items-start gap-4">
              {/* File icon */}
              <div className="flex-shrink-0">{icon}</div>

              {/* File details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                  {resource.filename}
                </h3>
                <div className="space-y-1 text-sm text-[var(--text-muted)]">
                  <p>Size: {formatFileSize(resource.filesize)}</p>
                  <p>Type: {resource.mimetype}</p>
                  <p>Uploaded by: {resource.uploadedBy}</p>
                  <p>Date: {new Date(resource.uploadedAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}</p>
                </div>

                <button className="btn btn-primary mt-4 flex items-center gap-2">
                  <Download size={16} />
                  Download ({formatFileSize(resource.filesize)})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
