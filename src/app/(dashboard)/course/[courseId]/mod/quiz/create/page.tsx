'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
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

export default function CreateQuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  // General
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);

  // Timing
  const [openDateEnabled, setOpenDateEnabled] = useState(false);
  const [openDate, setOpenDate] = useState('');
  const [closeDateEnabled, setCloseDateEnabled] = useState(false);
  const [closeDate, setCloseDate] = useState('');
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(true);
  const [timeLimit, setTimeLimit] = useState('30');
  const [timeLimitUnit, setTimeLimitUnit] = useState('minutes');
  const [overdueHandling, setOverdueHandling] = useState('autosubmit');
  const [graceperiod, setGraceperiod] = useState('60');

  // Grade
  const [gradeCategory, setGradeCategory] = useState('');
  const [gradeToPass, setGradeToPass] = useState('');
  const [attemptsAllowed, setAttemptsAllowed] = useState('0'); // 0 = unlimited
  const [gradingMethod, setGradingMethod] = useState('highest');

  // Layout
  const [questionsPerPage, setQuestionsPerPage] = useState('1');
  const [navMethod, setNavMethod] = useState('free');

  // Question behaviour
  const [shuffleWithin, setShuffleWithin] = useState(true);
  const [howQuestionsBehave, setHowQuestionsBehave] = useState('deferredfeedback');
  const [eachAttemptBuilds, setEachAttemptBuilds] = useState(false);

  // Review options
  const [reviewDuringAttempt, setReviewDuringAttempt] = useState<Record<string, boolean>>({ attempt: true, correctness: false, marks: false, feedback: false, generalFeedback: false, rightAnswer: false });
  const [reviewImmediately, setReviewImmediately] = useState<Record<string, boolean>>({ attempt: true, correctness: true, marks: true, feedback: true, generalFeedback: true, rightAnswer: true });
  const [reviewLater, setReviewLater] = useState<Record<string, boolean>>({ attempt: true, correctness: true, marks: true, feedback: true, generalFeedback: true, rightAnswer: true });
  const [reviewAfterClose, setReviewAfterClose] = useState<Record<string, boolean>>({ attempt: true, correctness: true, marks: true, feedback: true, generalFeedback: true, rightAnswer: true });

  // Appearance
  const [showUserPicture, setShowUserPicture] = useState(false);
  const [decimalPlaces, setDecimalPlaces] = useState('2');
  const [decimalPlacesQuestion, setDecimalPlacesQuestion] = useState('-1'); // same as overall
  const [showBlocks, setShowBlocks] = useState(false);

  // Extra restrictions
  const [requirePassword, setRequirePassword] = useState('');
  const [requireNetwork, setRequireNetwork] = useState('');
  const [enforceDelay1, setEnforceDelay1] = useState('0');
  const [enforceDelay2, setEnforceDelay2] = useState('0');
  const [browserSecurity, setBrowserSecurity] = useState('none');

  const ReviewCheckboxGroup = ({
    label,
    state,
    onChange,
  }: {
    label: string;
    state: Record<string, boolean>;
    onChange: (s: Record<string, boolean>) => void;
  }) => (
    <div className="border border-[var(--border-color)] rounded p-3">
      <div className="text-xs font-semibold text-[var(--text-muted)] mb-2">{label}</div>
      <div className="grid grid-cols-2 gap-1">
        {Object.entries(state).map(([key, val]) => (
          <label key={key} className="flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              className="w-3.5 h-3.5"
              checked={val}
              onChange={(e) => onChange({ ...state, [key]: e.target.checked })}
            />
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
          </label>
        ))}
      </div>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/course/${courseId}`);
  };

  return (
    <>
      <PageHeader
        title="Adding a new Quiz"
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: 'Adding a new Quiz' },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General */}
            <FormSection title="General" defaultOpen={true}>
              <FormField label="Name" htmlFor="name" required>
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
                  placeholder="Describe the quiz..."
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
            </FormSection>

            {/* Timing */}
            <FormSection title="Timing">
              <FormField label="Open the quiz" help="Students can only start their attempt after the open date">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={openDateEnabled}
                    onChange={(e) => setOpenDateEnabled(e.target.checked)}
                  />
                  <input
                    type="datetime-local"
                    className="form-control flex-1"
                    value={openDate}
                    onChange={(e) => setOpenDate(e.target.value)}
                    disabled={!openDateEnabled}
                  />
                </div>
              </FormField>

              <FormField label="Close the quiz" help="Students must finish their attempt before this date">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={closeDateEnabled}
                    onChange={(e) => setCloseDateEnabled(e.target.checked)}
                  />
                  <input
                    type="datetime-local"
                    className="form-control flex-1"
                    value={closeDate}
                    onChange={(e) => setCloseDate(e.target.value)}
                    disabled={!closeDateEnabled}
                  />
                </div>
              </FormField>

              <FormField label="Time limit" help="Time allowed for each attempt">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={timeLimitEnabled}
                    onChange={(e) => setTimeLimitEnabled(e.target.checked)}
                  />
                  <input
                    type="number"
                    className="form-control w-24"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    disabled={!timeLimitEnabled}
                    min={1}
                  />
                  <select
                    className="form-control w-32"
                    value={timeLimitUnit}
                    onChange={(e) => setTimeLimitUnit(e.target.value)}
                    disabled={!timeLimitEnabled}
                  >
                    <option value="seconds">seconds</option>
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                  </select>
                </div>
              </FormField>

              <FormField label="When time expires" help="What happens when a student's time runs out">
                <select
                  className="form-control"
                  value={overdueHandling}
                  onChange={(e) => setOverdueHandling(e.target.value)}
                >
                  <option value="autosubmit">Open attempts are submitted automatically</option>
                  <option value="graceperiod">There is a grace period to submit, but no more answers</option>
                  <option value="autoabandon">Attempts must be submitted before time expires, or they are not counted</option>
                </select>
              </FormField>

              {overdueHandling === 'graceperiod' && (
                <FormField label="Submission grace period">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="form-control w-24"
                      value={graceperiod}
                      onChange={(e) => setGraceperiod(e.target.value)}
                      min={0}
                    />
                    <span className="text-sm text-[var(--text-muted)]">seconds</span>
                  </div>
                </FormField>
              )}
            </FormSection>

            {/* Grade */}
            <FormSection title="Grade">
              <FormField label="Grade category">
                <select
                  className="form-control"
                  value={gradeCategory}
                  onChange={(e) => setGradeCategory(e.target.value)}
                >
                  <option value="">Uncategorised</option>
                </select>
              </FormField>

              <FormField label="Grade to pass" help="Minimum grade to pass this quiz">
                <input
                  type="number"
                  className="form-control w-24"
                  value={gradeToPass}
                  onChange={(e) => setGradeToPass(e.target.value)}
                  min={0}
                  placeholder="0"
                />
              </FormField>

              <FormField label="Attempts allowed">
                <select
                  className="form-control w-32"
                  value={attemptsAllowed}
                  onChange={(e) => setAttemptsAllowed(e.target.value)}
                >
                  <option value="0">Unlimited</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </FormField>

              <FormField label="Grading method" help="When multiple attempts are allowed, how the final grade is calculated">
                <select
                  className="form-control w-48"
                  value={gradingMethod}
                  onChange={(e) => setGradingMethod(e.target.value)}
                >
                  <option value="highest">Highest grade</option>
                  <option value="average">Average grade</option>
                  <option value="first">First attempt</option>
                  <option value="last">Last attempt</option>
                </select>
              </FormField>
            </FormSection>

            {/* Layout */}
            <FormSection title="Layout">
              <FormField label="New page" help="Number of questions per page">
                <select
                  className="form-control w-32"
                  value={questionsPerPage}
                  onChange={(e) => setQuestionsPerPage(e.target.value)}
                >
                  <option value="0">Never, all questions on one page</option>
                  <option value="1">Every question</option>
                  <option value="2">Every 2 questions</option>
                  <option value="5">Every 5 questions</option>
                  <option value="10">Every 10 questions</option>
                </select>
              </FormField>

              <FormField label="Navigation method">
                <select
                  className="form-control w-48"
                  value={navMethod}
                  onChange={(e) => setNavMethod(e.target.value)}
                >
                  <option value="free">Free</option>
                  <option value="sequential">Sequential</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Sequential forces students to answer questions in order and not go back.
                </p>
              </FormField>
            </FormSection>

            {/* Question behaviour */}
            <FormSection title="Question behaviour">
              <FormField label="Shuffle within questions" help="Randomly shuffle the parts within each question each time a student starts a new attempt">
                <select
                  className="form-control w-32"
                  value={shuffleWithin ? 'yes' : 'no'}
                  onChange={(e) => setShuffleWithin(e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </FormField>

              <FormField label="How questions behave" help="Controls when students see feedback and can change their answers">
                <select
                  className="form-control"
                  value={howQuestionsBehave}
                  onChange={(e) => setHowQuestionsBehave(e.target.value)}
                >
                  <option value="deferredfeedback">Deferred feedback</option>
                  <option value="adaptive">Adaptive mode</option>
                  <option value="adaptivenopenalty">Adaptive mode (no penalties)</option>
                  <option value="interactive">Interactive with multiple tries</option>
                  <option value="immediatefeedback">Immediate feedback</option>
                  <option value="immediatecbm">Immediate feedback with CBM</option>
                  <option value="deferredcbm">Deferred feedback with CBM</option>
                </select>
              </FormField>

              {Number(attemptsAllowed) !== 1 && (
                <FormField label="Each attempt builds on the last" help="Pre-fills answers from the previous attempt">
                  <select
                    className="form-control w-32"
                    value={eachAttemptBuilds ? 'yes' : 'no'}
                    onChange={(e) => setEachAttemptBuilds(e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </FormField>
              )}
            </FormSection>

            {/* Review options */}
            <FormSection title="Review options">
              <p className="text-sm text-[var(--text-muted)] mb-3">
                These options control what information students can see when they review a quiz attempt or look at the quiz reports.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ReviewCheckboxGroup label="During the attempt" state={reviewDuringAttempt} onChange={setReviewDuringAttempt} />
                <ReviewCheckboxGroup label="Immediately after the attempt" state={reviewImmediately} onChange={setReviewImmediately} />
                <ReviewCheckboxGroup label="Later, while still open" state={reviewLater} onChange={setReviewLater} />
                <ReviewCheckboxGroup label="After the quiz is closed" state={reviewAfterClose} onChange={setReviewAfterClose} />
              </div>
            </FormSection>

            {/* Appearance */}
            <FormSection title="Appearance">
              <FormField label="Show the user's picture" help="Show the student's profile picture during the attempt to help invigilators">
                <select
                  className="form-control w-32"
                  value={showUserPicture ? 'yes' : 'no'}
                  onChange={(e) => setShowUserPicture(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </FormField>

              <FormField label="Decimal places in grades">
                <select
                  className="form-control w-20"
                  value={decimalPlaces}
                  onChange={(e) => setDecimalPlaces(e.target.value)}
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Decimal places in question grades">
                <select
                  className="form-control w-32"
                  value={decimalPlacesQuestion}
                  onChange={(e) => setDecimalPlacesQuestion(e.target.value)}
                >
                  <option value="-1">Same as for overall grades</option>
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Show blocks during quiz attempts">
                <select
                  className="form-control w-32"
                  value={showBlocks ? 'yes' : 'no'}
                  onChange={(e) => setShowBlocks(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </FormField>
            </FormSection>

            {/* Extra restrictions on attempts */}
            <FormSection title="Extra restrictions on attempts">
              <FormField label="Require password" help="Students must enter this password before they can attempt the quiz">
                <input
                  type="text"
                  className="form-control"
                  value={requirePassword}
                  onChange={(e) => setRequirePassword(e.target.value)}
                  placeholder="Leave blank for no password"
                />
              </FormField>

              <FormField label="Require network address" help="Restrict quiz attempts to specific IP addresses or subnets">
                <input
                  type="text"
                  className="form-control"
                  value={requireNetwork}
                  onChange={(e) => setRequireNetwork(e.target.value)}
                  placeholder="e.g. 192.168.0.0/24"
                />
              </FormField>

              <FormField label="Enforced delay between 1st and 2nd attempts">
                <select
                  className="form-control w-48"
                  value={enforceDelay1}
                  onChange={(e) => setEnforceDelay1(e.target.value)}
                >
                  <option value="0">None</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                  <option value="1800">30 minutes</option>
                  <option value="3600">1 hour</option>
                  <option value="7200">2 hours</option>
                  <option value="86400">1 day</option>
                </select>
              </FormField>

              <FormField label="Enforced delay between later attempts">
                <select
                  className="form-control w-48"
                  value={enforceDelay2}
                  onChange={(e) => setEnforceDelay2(e.target.value)}
                >
                  <option value="0">None</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                  <option value="1800">30 minutes</option>
                  <option value="3600">1 hour</option>
                  <option value="7200">2 hours</option>
                  <option value="86400">1 day</option>
                </select>
              </FormField>

              <FormField label="Browser security">
                <select
                  className="form-control"
                  value={browserSecurity}
                  onChange={(e) => setBrowserSecurity(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="securewindow">Full screen pop-up with some JavaScript security</option>
                </select>
              </FormField>
            </FormSection>

            {/* Common module settings */}
            <FormSection title="Common module settings">
              <FormField label="Availability">
                <select className="form-control w-48">
                  <option value="show">Show on course page</option>
                  <option value="hide">Hide from students</option>
                </select>
              </FormField>

              <FormField label="ID number">
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
