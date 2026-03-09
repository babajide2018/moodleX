'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Calendar,
  Info,
} from 'lucide-react';

interface FormSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FormSection({ title, defaultOpen = false, children }: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border-color)] rounded-lg">
      <button
        className="w-full flex items-center gap-2 px-4 py-3 text-left bg-[var(--bg-light)] hover:bg-[var(--bg-hover)] transition-colors rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="font-semibold text-sm">{title}</span>
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 border-t border-[var(--border-color)]">
          {children}
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  required,
  help,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 items-start">
      <label htmlFor={htmlFor} className="text-sm font-medium pt-2 flex items-center gap-1">
        {label}
        {required && <span className="text-[var(--moodle-danger)]">*</span>}
        {help && (
          <span className="text-[var(--text-muted)] cursor-help" title={help}>
            <HelpCircle size={12} />
          </span>
        )}
      </label>
      <div>{children}</div>
    </div>
  );
}

export default function CreateAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  // General
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [activityInstructions, setActivityInstructions] = useState('');

  // Availability
  const [allowSubmissionsFrom, setAllowSubmissionsFrom] = useState('');
  const [allowSubmissionsFromEnabled, setAllowSubmissionsFromEnabled] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [dueDateEnabled, setDueDateEnabled] = useState(true);
  const [cutoffDate, setCutoffDate] = useState('');
  const [cutoffDateEnabled, setCutoffDateEnabled] = useState(false);
  const [gradingDueDate, setGradingDueDate] = useState('');
  const [gradingDueDateEnabled, setGradingDueDateEnabled] = useState(false);
  const [alwaysShowDescription, setAlwaysShowDescription] = useState(true);

  // Submission types
  const [onlineText, setOnlineText] = useState(true);
  const [fileSubmissions, setFileSubmissions] = useState(true);
  const [wordLimit, setWordLimit] = useState(0);
  const [wordLimitEnabled, setWordLimitEnabled] = useState(false);
  const [maxFiles, setMaxFiles] = useState(20);
  const [maxFileSize, setMaxFileSize] = useState('5242880'); // 5MB

  // Feedback types
  const [feedbackComments, setFeedbackComments] = useState(true);
  const [annotatedPdf, setAnnotatedPdf] = useState(true);
  const [feedbackFiles, setFeedbackFiles] = useState(false);
  const [offlineGrading, setOfflineGrading] = useState(false);
  const [inlineComment, setInlineComment] = useState(true);

  // Submission settings
  const [requireSubmitButton, setRequireSubmitButton] = useState(true);
  const [requireSubmissionStatement, setRequireSubmissionStatement] = useState(true);
  const [attemptsAllowed, setAttemptsAllowed] = useState('unlimited');
  const [attemptsReopenMethod, setAttemptsReopenMethod] = useState('never');
  const [maxAttemptsInput, setMaxAttemptsInput] = useState('1');

  // Group submission
  const [teamSubmission, setTeamSubmission] = useState(false);
  const [requireAllGroupMembers, setRequireAllGroupMembers] = useState(false);
  const [groupingForGroups, setGroupingForGroups] = useState('');

  // Notifications
  const [notifyGraders, setNotifyGraders] = useState(false);
  const [notifyGradersLate, setNotifyGradersLate] = useState(false);

  // Grade
  const [gradeType, setGradeType] = useState('point');
  const [maxGrade, setMaxGrade] = useState('100');
  const [gradingMethod, setGradingMethod] = useState('simple');
  const [gradeCategory, setGradeCategory] = useState('');
  const [gradeToPass, setGradeToPass] = useState('');
  const [blindMarking, setBlindMarking] = useState(false);
  const [markingWorkflow, setMarkingWorkflow] = useState(false);
  const [markingAllocation, setMarkingAllocation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, POST to API
    router.push(`/course/${courseId}`);
  };

  return (
    <>
      <PageHeader
        title="Adding a new Assignment"
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: 'Adding a new Assignment' },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General */}
            <FormSection title="General" defaultOpen={true}>
              <FormField label="Assignment name" htmlFor="name" required>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Description" htmlFor="description">
                <textarea
                  id="description"
                  className="form-control min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the assignment and what students need to do..."
                />
              </FormField>

              <FormField label="" htmlFor="showDescription">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={showDescription}
                    onChange={(e) => setShowDescription(e.target.checked)}
                  />
                  Display description on course page
                </label>
              </FormField>

              <FormField label="Activity instructions" htmlFor="activityInstructions" help="Instructions shown on the submission page">
                <textarea
                  id="activityInstructions"
                  className="form-control min-h-[100px]"
                  value={activityInstructions}
                  onChange={(e) => setActivityInstructions(e.target.value)}
                  placeholder="Additional instructions displayed on the submission page..."
                />
              </FormField>
            </FormSection>

            {/* Availability */}
            <FormSection title="Availability">
              <FormField label="Allow submissions from" help="If enabled, students cannot submit before this date">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={allowSubmissionsFromEnabled}
                    onChange={(e) => setAllowSubmissionsFromEnabled(e.target.checked)}
                  />
                  <input
                    type="datetime-local"
                    className="form-control flex-1"
                    value={allowSubmissionsFrom}
                    onChange={(e) => setAllowSubmissionsFrom(e.target.value)}
                    disabled={!allowSubmissionsFromEnabled}
                  />
                </div>
              </FormField>

              <FormField label="Due date" help="Submissions after this date will be marked as late">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={dueDateEnabled}
                    onChange={(e) => setDueDateEnabled(e.target.checked)}
                  />
                  <input
                    type="datetime-local"
                    className="form-control flex-1"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={!dueDateEnabled}
                  />
                </div>
              </FormField>

              <FormField label="Cut-off date" help="No submissions accepted after this date">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={cutoffDateEnabled}
                    onChange={(e) => setCutoffDateEnabled(e.target.checked)}
                  />
                  <input
                    type="datetime-local"
                    className="form-control flex-1"
                    value={cutoffDate}
                    onChange={(e) => setCutoffDate(e.target.value)}
                    disabled={!cutoffDateEnabled}
                  />
                </div>
              </FormField>

              <FormField label="Remind me to grade by" help="Expected date for grading to be completed">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={gradingDueDateEnabled}
                    onChange={(e) => setGradingDueDateEnabled(e.target.checked)}
                  />
                  <input
                    type="datetime-local"
                    className="form-control flex-1"
                    value={gradingDueDate}
                    onChange={(e) => setGradingDueDate(e.target.value)}
                    disabled={!gradingDueDateEnabled}
                  />
                </div>
              </FormField>

              <FormField label="" htmlFor="alwaysShowDescription">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={alwaysShowDescription}
                    onChange={(e) => setAlwaysShowDescription(e.target.checked)}
                  />
                  Always show description
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  If disabled, the description above will only become visible to students at the &quot;Allow submissions from&quot; date.
                </p>
              </FormField>
            </FormSection>

            {/* Submission types */}
            <FormSection title="Submission types">
              <FormField label="Submission types">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={onlineText}
                      onChange={(e) => setOnlineText(e.target.checked)}
                    />
                    Online text
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={fileSubmissions}
                      onChange={(e) => setFileSubmissions(e.target.checked)}
                    />
                    File submissions
                  </label>
                </div>
              </FormField>

              {onlineText && (
                <FormField label="Word limit" help="If set, students cannot submit more than this number of words">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={wordLimitEnabled}
                      onChange={(e) => setWordLimitEnabled(e.target.checked)}
                    />
                    <input
                      type="number"
                      className="form-control w-32"
                      value={wordLimit}
                      onChange={(e) => setWordLimit(Number(e.target.value))}
                      disabled={!wordLimitEnabled}
                      min={0}
                    />
                    <span className="text-sm text-[var(--text-muted)]">words</span>
                  </div>
                </FormField>
              )}

              {fileSubmissions && (
                <>
                  <FormField label="Maximum number of uploaded files">
                    <select
                      className="form-control w-32"
                      value={maxFiles}
                      onChange={(e) => setMaxFiles(Number(e.target.value))}
                    >
                      {[1, 2, 3, 5, 10, 20].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Maximum submission size">
                    <select
                      className="form-control w-48"
                      value={maxFileSize}
                      onChange={(e) => setMaxFileSize(e.target.value)}
                    >
                      <option value="1048576">1 MB</option>
                      <option value="2097152">2 MB</option>
                      <option value="5242880">5 MB</option>
                      <option value="10485760">10 MB</option>
                      <option value="20971520">20 MB</option>
                      <option value="52428800">50 MB</option>
                      <option value="104857600">100 MB</option>
                    </select>
                  </FormField>

                  <FormField label="Accepted file types" help="Leave empty to allow all file types">
                    <input
                      type="text"
                      className="form-control"
                      placeholder=".pdf, .doc, .docx, .py, .java, .zip"
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Comma-separated list of accepted file extensions. Leave blank to accept all types.
                    </p>
                  </FormField>
                </>
              )}
            </FormSection>

            {/* Feedback types */}
            <FormSection title="Feedback types">
              <FormField label="Feedback types">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={feedbackComments}
                      onChange={(e) => setFeedbackComments(e.target.checked)}
                    />
                    Feedback comments
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={annotatedPdf}
                      onChange={(e) => setAnnotatedPdf(e.target.checked)}
                    />
                    Annotate PDF
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={feedbackFiles}
                      onChange={(e) => setFeedbackFiles(e.target.checked)}
                    />
                    Feedback files
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={offlineGrading}
                      onChange={(e) => setOfflineGrading(e.target.checked)}
                    />
                    Offline grading worksheet
                  </label>
                </div>
              </FormField>

              <FormField label="" htmlFor="inlineComment">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={inlineComment}
                    onChange={(e) => setInlineComment(e.target.checked)}
                  />
                  Comment inline
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  If enabled, the submission text will be copied into the feedback comment field during grading, making it easier to comment inline or to edit the original text.
                </p>
              </FormField>
            </FormSection>

            {/* Submission settings */}
            <FormSection title="Submission settings">
              <FormField label="Require students to click the submit button" help="Students must click a submit button to declare their submission as final">
                <select
                  className="form-control w-32"
                  value={requireSubmitButton ? 'yes' : 'no'}
                  onChange={(e) => setRequireSubmitButton(e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </FormField>

              <FormField label="Require that students accept the submission statement">
                <select
                  className="form-control w-32"
                  value={requireSubmissionStatement ? 'yes' : 'no'}
                  onChange={(e) => setRequireSubmissionStatement(e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </FormField>

              <FormField label="Attempts allowed" help="Number of times a student can submit">
                <select
                  className="form-control w-32"
                  value={attemptsAllowed}
                  onChange={(e) => setAttemptsAllowed(e.target.value)}
                >
                  <option value="unlimited">Unlimited</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </FormField>

              <FormField label="Attempts reopened" help="Determines how student submission attempts are reopened">
                <select
                  className="form-control w-48"
                  value={attemptsReopenMethod}
                  onChange={(e) => setAttemptsReopenMethod(e.target.value)}
                >
                  <option value="never">Never</option>
                  <option value="manual">Manually</option>
                  <option value="untilpass">Automatically until pass</option>
                </select>
              </FormField>
            </FormSection>

            {/* Group submission settings */}
            <FormSection title="Group submission settings">
              <FormField label="Students submit in groups">
                <select
                  className="form-control w-32"
                  value={teamSubmission ? 'yes' : 'no'}
                  onChange={(e) => setTeamSubmission(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </FormField>

              {teamSubmission && (
                <>
                  <FormField label="Require all group members submit">
                    <select
                      className="form-control w-32"
                      value={requireAllGroupMembers ? 'yes' : 'no'}
                      onChange={(e) => setRequireAllGroupMembers(e.target.value === 'yes')}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </FormField>

                  <FormField label="Grouping for student groups">
                    <select
                      className="form-control"
                      value={groupingForGroups}
                      onChange={(e) => setGroupingForGroups(e.target.value)}
                    >
                      <option value="">None</option>
                    </select>
                  </FormField>
                </>
              )}
            </FormSection>

            {/* Notifications */}
            <FormSection title="Notifications">
              <FormField label="Notify graders about submissions" help="Send a notification to graders when a student submits">
                <select
                  className="form-control w-32"
                  value={notifyGraders ? 'yes' : 'no'}
                  onChange={(e) => setNotifyGraders(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </FormField>

              <FormField label="Notify graders about late submissions">
                <select
                  className="form-control w-32"
                  value={notifyGradersLate ? 'yes' : 'no'}
                  onChange={(e) => setNotifyGradersLate(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </FormField>
            </FormSection>

            {/* Grade */}
            <FormSection title="Grade">
              <FormField label="Grade" required>
                <div className="flex items-center gap-3">
                  <select
                    className="form-control w-40"
                    value={gradeType}
                    onChange={(e) => setGradeType(e.target.value)}
                  >
                    <option value="point">Point</option>
                    <option value="scale">Scale</option>
                    <option value="none">None</option>
                  </select>
                  {gradeType === 'point' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text-muted)]">Maximum grade:</span>
                      <input
                        type="number"
                        className="form-control w-24"
                        value={maxGrade}
                        onChange={(e) => setMaxGrade(e.target.value)}
                        min={1}
                        max={1000}
                      />
                    </div>
                  )}
                </div>
              </FormField>

              <FormField label="Grading method">
                <select
                  className="form-control w-48"
                  value={gradingMethod}
                  onChange={(e) => setGradingMethod(e.target.value)}
                >
                  <option value="simple">Simple direct grading</option>
                  <option value="rubric">Rubric</option>
                  <option value="guide">Marking guide</option>
                </select>
              </FormField>

              <FormField label="Grade category">
                <select
                  className="form-control"
                  value={gradeCategory}
                  onChange={(e) => setGradeCategory(e.target.value)}
                >
                  <option value="">Uncategorised</option>
                </select>
              </FormField>

              <FormField label="Grade to pass" help="Minimum grade required to pass">
                <input
                  type="number"
                  className="form-control w-24"
                  value={gradeToPass}
                  onChange={(e) => setGradeToPass(e.target.value)}
                  min={0}
                  placeholder="0"
                />
              </FormField>

              <FormField label="Anonymous submissions" help="Student identities are hidden from graders">
                <select
                  className="form-control w-32"
                  value={blindMarking ? 'yes' : 'no'}
                  onChange={(e) => setBlindMarking(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </FormField>

              <FormField label="Use marking workflow" help="Grades go through a series of workflow stages before being released to students">
                <select
                  className="form-control w-32"
                  value={markingWorkflow ? 'yes' : 'no'}
                  onChange={(e) => setMarkingWorkflow(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </FormField>

              {markingWorkflow && (
                <FormField label="Use marking allocation">
                  <select
                    className="form-control w-32"
                    value={markingAllocation ? 'yes' : 'no'}
                    onChange={(e) => setMarkingAllocation(e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </FormField>
              )}
            </FormSection>

            {/* Common module settings */}
            <FormSection title="Common module settings">
              <FormField label="Availability">
                <select className="form-control w-48">
                  <option value="show">Show on course page</option>
                  <option value="hide">Hide from students</option>
                </select>
              </FormField>

              <FormField label="ID number" help="Setting an ID number provides a way of identifying the activity for grade calculation purposes">
                <input type="text" className="form-control w-48" />
              </FormField>

              <FormField label="Group mode">
                <select className="form-control w-48">
                  <option value="0">No groups</option>
                  <option value="1">Separate groups</option>
                  <option value="2">Visible groups</option>
                </select>
              </FormField>
            </FormSection>

            {/* Restrict access */}
            <FormSection title="Restrict access">
              <div className="text-sm text-[var(--text-muted)]">
                <Info size={14} className="inline mr-1" />
                None. Click to add a restriction.
              </div>
              <button type="button" className="btn btn-secondary text-sm">
                Add restriction...
              </button>
            </FormSection>

            {/* Activity completion */}
            <FormSection title="Activity completion">
              <FormField label="Completion tracking">
                <select className="form-control">
                  <option value="0">Do not indicate activity completion</option>
                  <option value="1">Students can manually mark the activity as completed</option>
                  <option value="2">Show activity as complete when conditions are met</option>
                </select>
              </FormField>
            </FormSection>

            {/* Tags */}
            <FormSection title="Tags">
              <FormField label="Tags">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter tags..."
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Enter comma-separated tags to help categorize this assignment.
                </p>
              </FormField>
            </FormSection>

            {/* Submit buttons */}
            <div className="flex items-center gap-3 py-4 border-t border-[var(--border-color)]">
              <button type="submit" className="btn btn-primary">
                Save and return to course
              </button>
              <button type="button" className="btn btn-secondary">
                Save and display
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push(`/course/${courseId}`)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
