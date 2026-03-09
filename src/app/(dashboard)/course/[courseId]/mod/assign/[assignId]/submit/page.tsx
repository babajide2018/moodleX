'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  Upload,
  FileText,
  X,
  File,
  FileImage,
  AlertTriangle,
  CheckCircle2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Undo2,
  Redo2,
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

const demoAssignment = {
  id: 'm5',
  name: 'Your First Program',
  submissionTypes: ['onlinetext', 'file'] as string[],
  maxFileSubmissions: 3,
  maxFileSize: 5242880, // 5MB
  maxFileSizeLabel: '5MB',
  wordLimit: 0, // 0 = no limit
  duedate: '2026-03-15T23:59:00',
  cutoffdate: '2026-03-18T23:59:00',
  attemptsAllowed: 'Unlimited',
  attemptnumber: 1,
};

// Existing draft data (if editing)
const existingSubmission = {
  text: '',
  files: [] as UploadedFile[],
};

export default function SubmitAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const assignId = params.assignId as string;

  const [submissionText, setSubmissionText] = useState(existingSubmission.text);
  const [files, setFiles] = useState<UploadedFile[]>(existingSubmission.files);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitAction, setSubmitAction] = useState<'draft' | 'submit'>('draft');
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assignment = demoAssignment;
  const isOverdue = new Date(assignment.duedate) < new Date();
  const isPastCutoff = assignment.cutoffdate
    ? new Date(assignment.cutoffdate) < new Date()
    : false;

  const canSubmit = !isPastCutoff;
  const isLate = isOverdue && !isPastCutoff;

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newErrors: string[] = [];
    const currentCount = files.length;
    const remaining = assignment.maxFileSubmissions - currentCount;

    if (remaining <= 0) {
      newErrors.push(`Maximum of ${assignment.maxFileSubmissions} files allowed.`);
      setErrors(newErrors);
      return;
    }

    const filesToAdd = Array.from(selectedFiles).slice(0, remaining);

    filesToAdd.forEach((file) => {
      if (file.size > assignment.maxFileSize) {
        newErrors.push(`"${file.name}" exceeds the maximum file size of ${assignment.maxFileSizeLabel}.`);
        return;
      }

      const uploaded: UploadedFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 100,
        status: 'complete',
      };
      setFiles((prev) => [...prev, uploaded]);
    });

    if (selectedFiles.length > remaining) {
      newErrors.push(`Only ${remaining} more file(s) can be added. Extra files were ignored.`);
    }

    if (newErrors.length > 0) setErrors(newErrors);
    else setErrors([]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setErrors([]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSaveDraft = () => {
    setSubmitAction('draft');
    // In real app, save via API
    router.push(`/course/${courseId}/mod/assign/${assignId}`);
  };

  const handleSubmit = () => {
    setSubmitAction('submit');
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setShowConfirm(false);
    // In real app, submit via API
    router.push(`/course/${courseId}/mod/assign/${assignId}`);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage size={16} className="text-blue-500" />;
    if (type.includes('pdf')) return <FileText size={16} className="text-red-500" />;
    return <File size={16} className="text-[var(--text-muted)]" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <>
      <PageHeader
        title={assignment.name}
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: assignment.name, href: `/course/${courseId}/mod/assign/${assignId}` },
          { label: 'Edit submission' },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-3xl">
          {/* Late submission warning */}
          {isLate && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <strong>This assignment is overdue.</strong> You can still submit until the cut-off date (
                {new Date(assignment.cutoffdate!).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}), but your submission will be marked as late.
              </div>
            </div>
          )}

          {isPastCutoff && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <strong>The cut-off date has passed.</strong> No more submissions are accepted for this assignment.
              </div>
            </div>
          )}

          {/* Error messages */}
          {errors.length > 0 && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.map((err, i) => (
                <div key={i} className="flex items-center gap-2">
                  <AlertTriangle size={14} />
                  {err}
                </div>
              ))}
            </div>
          )}

          {/* Submission info */}
          <div className="bg-[var(--bg-light)] border border-[var(--border-color)] rounded-lg px-4 py-3 mb-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">
                Attempt {assignment.attemptnumber} ({assignment.attemptsAllowed} allowed)
              </span>
              {!isOverdue && (
                <span className="text-[var(--text-muted)]">
                  Due: {new Date(assignment.duedate).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Online text submission */}
          {assignment.submissionTypes.includes('onlinetext') && (
            <div className="border border-[var(--border-color)] rounded-lg mb-4">
              <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-semibold m-0">Online text</h3>
              </div>

              {/* Simple toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)]">
                <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Bold">
                  <Bold size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Italic">
                  <Italic size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Underline">
                  <Underline size={14} />
                </button>
                <div className="w-px h-5 bg-[var(--border-color)] mx-1" />
                <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Unordered list">
                  <List size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Ordered list">
                  <ListOrdered size={14} />
                </button>
                <div className="w-px h-5 bg-[var(--border-color)] mx-1" />
                <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Insert link">
                  <LinkIcon size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Insert image">
                  <Image size={14} />
                </button>
                <div className="w-px h-5 bg-[var(--border-color)] mx-1" />
                <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Undo">
                  <Undo2 size={14} />
                </button>
                <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Redo">
                  <Redo2 size={14} />
                </button>
              </div>

              {/* Text area */}
              <textarea
                className="w-full p-4 text-sm min-h-[250px] resize-y border-0 outline-none"
                placeholder="Type your submission here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                disabled={!canSubmit}
              />

              {/* Word count */}
              <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-light)] text-xs text-[var(--text-muted)] flex justify-between">
                <span>
                  Word count: {submissionText.trim() ? submissionText.trim().split(/\s+/).length : 0}
                  {assignment.wordLimit > 0 && ` / ${assignment.wordLimit}`}
                </span>
                <span>Atto HTML editor</span>
              </div>
            </div>
          )}

          {/* File submissions */}
          {assignment.submissionTypes.includes('file') && (
            <div className="border border-[var(--border-color)] rounded-lg mb-4">
              <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-semibold m-0">
                  File submissions
                  <span className="font-normal text-[var(--text-muted)] ml-2">
                    ({files.length} / {assignment.maxFileSubmissions} files, max {assignment.maxFileSizeLabel} each)
                  </span>
                </h3>
              </div>

              <div className="p-4">
                {/* Uploaded files list */}
                {files.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-2 border border-[var(--border-color)] rounded bg-[var(--bg-light)]"
                      >
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{file.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">
                            {formatFileSize(file.size)}
                            {file.status === 'complete' && (
                              <span className="text-green-600 ml-2">
                                <CheckCircle2 size={10} className="inline" /> Uploaded
                              </span>
                            )}
                            {file.status === 'error' && (
                              <span className="text-red-600 ml-2">Upload failed</span>
                            )}
                          </div>
                          {file.status === 'uploading' && (
                            <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--moodle-primary)] transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-[var(--text-muted)] hover:text-[var(--moodle-danger)] rounded"
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drop zone */}
                {files.length < assignment.maxFileSubmissions && canSubmit && (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver
                        ? 'border-[var(--moodle-primary)] bg-blue-50'
                        : 'border-[var(--border-color)] hover:border-[var(--moodle-primary)]'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <Upload size={32} className="mx-auto mb-2 text-[var(--text-muted)]" />
                    <p className="text-sm text-[var(--text-secondary)] mb-2">
                      Drag and drop files here, or{' '}
                      <button
                        className="text-[var(--text-link)] hover:underline font-medium"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        browse your computer
                      </button>
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Maximum file size: {assignment.maxFileSizeLabel} &middot;{' '}
                      {assignment.maxFileSubmissions - files.length} file(s) remaining
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                  </div>
                )}

                {files.length >= assignment.maxFileSubmissions && (
                  <p className="text-xs text-[var(--text-muted)] text-center py-2">
                    Maximum number of files reached. Remove a file to upload a new one.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submission statement */}
          <div className="border border-[var(--border-color)] rounded-lg p-4 mb-4 bg-[var(--bg-light)]">
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5 w-4 h-4" defaultChecked />
              <span className="text-[var(--text-secondary)]">
                This submission is my own work, except where I have acknowledged the use of the works of other people.
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              Submit assignment
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleSaveDraft}
              disabled={!canSubmit}
            >
              Save as draft
            </button>
            <Link
              href={`/course/${courseId}/mod/assign/${assignId}`}
              className="btn btn-secondary"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[1060] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[var(--border-color)] shadow-xl max-w-md w-full">
            <div className="px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="font-semibold text-base">Confirm submission</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-[var(--text-secondary)]">
                You are about to submit your assignment for grading. Once submitted, you
                {assignment.attemptsAllowed === 'Unlimited'
                  ? ' will be able to edit and resubmit.'
                  : ' may not be able to make further changes.'}
              </p>
              {isLate && (
                <p className="text-sm text-amber-700 mt-2 flex items-center gap-1">
                  <AlertTriangle size={14} />
                  This submission will be marked as late.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-light)]">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmSubmit}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
