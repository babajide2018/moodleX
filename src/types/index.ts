// ============================================================
// MoodleX - Core Type Definitions
// ============================================================

// Database provider types - Moodle supports multiple databases
export type DatabaseProvider = 'postgresql' | 'mysql' | 'mariadb' | 'sqlite' | 'sqlserver';

// User roles matching Moodle's role system
export type UserRole = 'admin' | 'coursecreator' | 'editingteacher' | 'teacher' | 'student' | 'guest';

export interface User {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  city?: string;
  country?: string;
  timezone?: string;
  description?: string;
  institution?: string;
  department?: string;
  phone1?: string;
  phone2?: string;
  firstaccess?: Date;
  lastaccess?: Date;
  lastlogin?: Date;
  confirmed: boolean;
  suspended: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  fullname: string;
  shortname: string;
  summary?: string;
  categoryId: string;
  format: CourseFormat;
  startdate: Date;
  enddate?: Date;
  visible: boolean;
  image?: string;
  enrolledCount?: number;
  sections?: CourseSection[];
  createdAt: Date;
  updatedAt: Date;
}

export type CourseFormat = 'topics' | 'weeks' | 'social' | 'singleactivity';

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  sortorder: number;
  visible: boolean;
  depth: number;
  path: string;
  coursecount?: number;
}

export interface CourseSection {
  id: string;
  courseId: string;
  name?: string;
  summary?: string;
  section: number;
  visible: boolean;
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  sectionId: string;
  moduleType: ModuleType;
  name: string;
  description?: string;
  visible: boolean;
  indent: number;
  completionEnabled: boolean;
  completionState?: CompletionState;
  duedate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ModuleType =
  | 'assign'
  | 'quiz'
  | 'forum'
  | 'resource'
  | 'url'
  | 'page'
  | 'book'
  | 'folder'
  | 'label'
  | 'choice'
  | 'feedback'
  | 'glossary'
  | 'wiki'
  | 'workshop'
  | 'lesson'
  | 'data'
  | 'scorm'
  | 'h5pactivity'
  | 'lti';

export type CompletionState = 'incomplete' | 'complete' | 'complete_pass' | 'complete_fail';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  role: UserRole;
  status: 'active' | 'suspended';
  timestart?: Date;
  timeend?: Date;
  createdAt: Date;
}

export interface Assignment {
  id: string;
  moduleId: string;
  courseId: string;
  name: string;
  description?: string;
  duedate?: Date;
  cutoffdate?: Date;
  gradingType: 'point' | 'scale' | 'none';
  maxGrade: number;
  submissionTypes: SubmissionType[];
  allowLateSubmissions: boolean;
  teamSubmission: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SubmissionType = 'onlinetext' | 'file' | 'comments';

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  status: 'draft' | 'submitted' | 'graded';
  submissionText?: string;
  files?: FileRecord[];
  submittedAt?: Date;
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

export interface Quiz {
  id: string;
  moduleId: string;
  courseId: string;
  name: string;
  description?: string;
  timeopen?: Date;
  timeclose?: Date;
  timelimit?: number; // seconds
  attempts: number; // 0 = unlimited
  grademethod: 'highest' | 'average' | 'first' | 'last';
  maxGrade: number;
  shuffleQuestions: boolean;
  questions?: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionType: QuestionType;
  questionText: string;
  defaultMark: number;
  sortorder: number;
  answers?: QuizAnswer[];
}

export type QuestionType =
  | 'multichoice'
  | 'truefalse'
  | 'shortanswer'
  | 'numerical'
  | 'essay'
  | 'matching'
  | 'description'
  | 'calculated'
  | 'multianswer';

export interface QuizAnswer {
  id: string;
  questionId: string;
  answerText: string;
  fraction: number; // 0 to 1
  feedback?: string;
}

export interface Grade {
  id: string;
  userId: string;
  courseId: string;
  itemId: string;
  itemType: 'assignment' | 'quiz' | 'manual';
  rawgrade?: number;
  finalgrade?: number;
  feedback?: string;
  gradedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GradeItem {
  id: string;
  courseId: string;
  categoryId?: string;
  itemType: 'mod' | 'manual' | 'course' | 'category';
  itemModule?: string;
  itemName: string;
  gradeMax: number;
  gradeMin: number;
  sortorder: number;
}

export interface FileRecord {
  id: string;
  filename: string;
  filepath: string;
  filesize: number;
  mimetype: string;
  userId: string;
  contextId?: string;
  component: string;
  filearea: string;
  url: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  component: string;
  eventType: string;
  subject: string;
  fullMessage: string;
  contextUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  name: string;
  description?: string;
  eventType: 'site' | 'course' | 'group' | 'user';
  courseId?: string;
  userId?: string;
  timestart: Date;
  timeduration: number;
  visible: boolean;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  courseId?: string;
  type: 'site' | 'course';
  status: 'active' | 'inactive';
  criteria: string;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  userId: string;
  subject: string;
  summary: string;
  content: string;
  publishState: 'draft' | 'site' | 'public';
  createdAt: Date;
  updatedAt: Date;
}

// Setup & Configuration
export interface SiteConfig {
  id: string;
  siteName: string;
  shortname: string;
  summary?: string;
  frontpage: string;
  defaultRole: UserRole;
  selfRegistration: boolean;
  databaseProvider: DatabaseProvider;
  timezone: string;
  lang: string;
  theme: string;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation types
export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  active?: boolean;
  badge?: number;
}

// Drawer state
export interface DrawerState {
  leftOpen: boolean;
  rightOpen: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  setLeftOpen: (open: boolean) => void;
  setRightOpen: (open: boolean) => void;
}

// Breadcrumb
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Block (sidebar widgets)
export interface Block {
  id: string;
  type: string;
  title: string;
  region: 'side-pre' | 'side-post';
  weight: number;
  visible: boolean;
  configData?: Record<string, unknown>;
}
