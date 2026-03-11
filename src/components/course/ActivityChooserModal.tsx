'use client';

import { useState } from 'react';
import {
  ClipboardCheck,
  HelpCircle,
  MessageSquare,
  FileText,
  LinkIcon,
  File,
  BookOpen,
  Pencil,
  X,
  Loader2,
} from 'lucide-react';

interface ActivityType {
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const activityTypes: ActivityType[] = [
  {
    type: 'assign',
    name: 'Assignment',
    description: 'Allow students to submit work for grading.',
    icon: <ClipboardCheck size={24} className="text-green-600" />,
  },
  {
    type: 'quiz',
    name: 'Quiz',
    description: 'Create quizzes with various question types.',
    icon: <HelpCircle size={24} className="text-orange-500" />,
  },
  {
    type: 'forum',
    name: 'Forum',
    description: 'Facilitate discussions among participants.',
    icon: <MessageSquare size={24} className="text-blue-500" />,
  },
  {
    type: 'page',
    name: 'Page',
    description: 'A single page of content using the text editor.',
    icon: <FileText size={24} className="text-teal-600" />,
  },
  {
    type: 'url',
    name: 'URL',
    description: 'Link to an external website or online resource.',
    icon: <LinkIcon size={24} className="text-purple-500" />,
  },
  {
    type: 'resource',
    name: 'File',
    description: 'Upload and share a file as a course resource.',
    icon: <File size={24} className="text-red-500" />,
  },
  {
    type: 'book',
    name: 'Book',
    description: 'Multi-page resource with chapters and subchapters.',
    icon: <BookOpen size={24} className="text-amber-600" />,
  },
  {
    type: 'label',
    name: 'Label',
    description: 'Add text or media directly on the course page.',
    icon: <Pencil size={24} className="text-gray-500" />,
  },
];

interface ActivityChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  sectionId: string;
  onModuleAdded: () => void;
}

export default function ActivityChooserModal({
  isOpen,
  onClose,
  courseId,
  sectionId,
  onModuleAdded,
}: ActivityChooserModalProps) {
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Type-specific fields
  const [duedate, setDuedate] = useState('');
  const [maxGrade, setMaxGrade] = useState('100');
  const [submissionTypes, setSubmissionTypes] = useState('onlinetext,file');
  const [timeclose, setTimeclose] = useState('');
  const [timelimit, setTimelimit] = useState('');
  const [attempts, setAttempts] = useState('0');
  const [forumType, setForumType] = useState('general');
  const [externalUrl, setExternalUrl] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setSelectedType(null);
    setName('');
    setDescription('');
    setError(null);
    setDuedate('');
    setMaxGrade('100');
    setSubmissionTypes('onlinetext,file');
    setTimeclose('');
    setTimelimit('');
    setAttempts('0');
    setForumType('general');
    setExternalUrl('');
    setContent('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBack = () => {
    setSelectedType(null);
    setName('');
    setDescription('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      // Build type-specific payload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {
        name: name.trim(),
        moduleType: selectedType.type,
        description: description.trim() || undefined,
      };

      switch (selectedType.type) {
        case 'assign':
          if (duedate) payload.duedate = duedate;
          payload.maxGrade = parseFloat(maxGrade) || 100;
          payload.submissionTypes = submissionTypes;
          break;
        case 'quiz':
          if (timeclose) payload.timeclose = timeclose;
          if (timelimit) payload.timelimit = parseInt(timelimit);
          payload.attempts = parseInt(attempts) || 0;
          payload.maxGrade = parseFloat(maxGrade) || 100;
          break;
        case 'forum':
          payload.forumType = forumType;
          break;
        case 'url':
          payload.externalUrl = externalUrl;
          break;
        case 'page':
        case 'book':
          payload.content = content;
          break;
        case 'label':
          payload.content = content || description.trim();
          break;
      }

      const res = await fetch(
        `/api/courses/${courseId}/sections/${sectionId}/modules`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create activity');
      }

      handleClose();
      onModuleAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1050] flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-[640px] max-h-[80vh] flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
          <h4 className="text-base font-semibold m-0">
            {selectedType
              ? `Add ${selectedType.name}`
              : 'Add an activity or resource'}
          </h4>
          <button
            onClick={handleClose}
            className="btn-icon text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {!selectedType ? (
            /* Activity type grid */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activityTypes.map((activity) => (
                <button
                  key={activity.type}
                  onClick={() => setSelectedType(activity)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[var(--border-color)] hover:border-[var(--moodle-primary)] hover:bg-[var(--bg-hover)] transition-colors text-center cursor-pointer bg-white"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-light)] flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {activity.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] leading-tight">
                    {activity.description}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            /* Activity creation form */
            <form onSubmit={handleSubmit} id="activity-form">
              <div className="flex items-center gap-3 mb-5 p-3 bg-[var(--bg-light)] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[var(--border-color)]">
                  {selectedType.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold">{selectedType.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {selectedType.description}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="activity-name"
                  className="block text-sm font-medium mb-1.5"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="activity-name"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Enter ${selectedType.name.toLowerCase()} name`}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="activity-description"
                  className="block text-sm font-medium mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="activity-description"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={2}
                />
              </div>

              {/* Assignment-specific fields */}
              {selectedType.type === 'assign' && (
                <>
                  <div className="mb-4">
                    <label htmlFor="assign-duedate" className="block text-sm font-medium mb-1.5">
                      Due date
                    </label>
                    <input
                      id="assign-duedate"
                      type="datetime-local"
                      className="form-control"
                      value={duedate}
                      onChange={(e) => setDuedate(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label htmlFor="assign-grade" className="block text-sm font-medium mb-1.5">
                        Maximum grade
                      </label>
                      <input
                        id="assign-grade"
                        type="number"
                        className="form-control"
                        value={maxGrade}
                        onChange={(e) => setMaxGrade(e.target.value)}
                        min="0"
                        max="1000"
                      />
                    </div>
                    <div>
                      <label htmlFor="assign-submission" className="block text-sm font-medium mb-1.5">
                        Submission types
                      </label>
                      <select
                        id="assign-submission"
                        className="form-control"
                        value={submissionTypes}
                        onChange={(e) => setSubmissionTypes(e.target.value)}
                      >
                        <option value="onlinetext,file">Online text &amp; File</option>
                        <option value="onlinetext">Online text only</option>
                        <option value="file">File submissions only</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Quiz-specific fields */}
              {selectedType.type === 'quiz' && (
                <>
                  <div className="mb-4">
                    <label htmlFor="quiz-close" className="block text-sm font-medium mb-1.5">
                      Close the quiz
                    </label>
                    <input
                      id="quiz-close"
                      type="datetime-local"
                      className="form-control"
                      value={timeclose}
                      onChange={(e) => setTimeclose(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <label htmlFor="quiz-timelimit" className="block text-sm font-medium mb-1.5">
                        Time limit (min)
                      </label>
                      <input
                        id="quiz-timelimit"
                        type="number"
                        className="form-control"
                        value={timelimit}
                        onChange={(e) => setTimelimit(e.target.value)}
                        placeholder="No limit"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="quiz-attempts" className="block text-sm font-medium mb-1.5">
                        Attempts allowed
                      </label>
                      <select
                        id="quiz-attempts"
                        className="form-control"
                        value={attempts}
                        onChange={(e) => setAttempts(e.target.value)}
                      >
                        <option value="0">Unlimited</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="quiz-grade" className="block text-sm font-medium mb-1.5">
                        Maximum grade
                      </label>
                      <input
                        id="quiz-grade"
                        type="number"
                        className="form-control"
                        value={maxGrade}
                        onChange={(e) => setMaxGrade(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Forum-specific fields */}
              {selectedType.type === 'forum' && (
                <div className="mb-4">
                  <label htmlFor="forum-type" className="block text-sm font-medium mb-1.5">
                    Forum type
                  </label>
                  <select
                    id="forum-type"
                    className="form-control"
                    value={forumType}
                    onChange={(e) => setForumType(e.target.value)}
                  >
                    <option value="general">Standard forum for general use</option>
                    <option value="news">Announcements</option>
                    <option value="qanda">Q and A forum</option>
                    <option value="social">Standard forum displayed in blog-like format</option>
                    <option value="blog">Each person posts one discussion</option>
                  </select>
                </div>
              )}

              {/* URL-specific fields */}
              {selectedType.type === 'url' && (
                <div className="mb-4">
                  <label htmlFor="url-external" className="block text-sm font-medium mb-1.5">
                    External URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="url-external"
                    type="url"
                    className="form-control"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </div>
              )}

              {/* Page/Book content field */}
              {(selectedType.type === 'page' || selectedType.type === 'book') && (
                <div className="mb-4">
                  <label htmlFor="page-content" className="block text-sm font-medium mb-1.5">
                    Page content
                  </label>
                  <textarea
                    id="page-content"
                    className="form-control"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter page content (HTML supported)"
                    rows={6}
                  />
                </div>
              )}

              {/* Label content field */}
              {selectedType.type === 'label' && (
                <div className="mb-4">
                  <label htmlFor="label-content" className="block text-sm font-medium mb-1.5">
                    Label text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="label-content"
                    className="form-control"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter text or HTML to display on the course page"
                    rows={4}
                    required
                  />
                </div>
              )}

              {/* File upload placeholder */}
              {selectedType.type === 'resource' && (
                <div className="mb-4 p-4 border-2 border-dashed border-[var(--border-color)] rounded-lg text-center">
                  <File size={24} className="mx-auto text-[var(--text-muted)] mb-2" />
                  <p className="text-sm text-[var(--text-muted)]">
                    File upload will be available after creating the resource. You can add files from the resource settings page.
                  </p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--border-color)] bg-[var(--bg-light)] rounded-b-lg">
          {selectedType ? (
            <>
              <button
                type="button"
                className="btn btn-secondary text-sm"
                onClick={handleBack}
                disabled={submitting}
              >
                Back
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-secondary text-sm"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="activity-form"
                  className="btn btn-primary text-sm flex items-center gap-1.5"
                  disabled={submitting || !name.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Adding...
                    </>
                  ) : (
                    `Add ${selectedType.name}`
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="ml-auto">
              <button
                type="button"
                className="btn btn-secondary text-sm"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
