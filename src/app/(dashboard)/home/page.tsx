'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  MessageSquare,
  Calendar,
  Newspaper,
  GraduationCap,
  Clock,
  User,
  ArrowRight,
  Search,
  LayoutGrid,
  List,
  AlignJustify,
  Loader2,
  Award,
  FileText,
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import CoursePlaceholderImage from '@/components/course/CoursePlaceholderImage';
import { getCourseColor } from '@/lib/course-colors';
import { useDrawerStore } from '@/store/drawer';

// --- Types ---

interface Course {
  id: string;
  fullname: string;
  shortname: string;
  category: string;
  image?: string;
  summary?: string;
  teachers?: string[];
  studentCount?: number;
}

interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorId: string;
  date: string;
  replies: number;
  forumId: string;
  discussionId: string;
  courseId: string;
}

interface UpcomingEvent {
  id: string;
  name: string;
  description: string;
  eventType: string;
  courseId?: string;
  courseShortname?: string;
  timestart: string;
  timeduration: number;
}

interface SiteStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalForumPosts: number;
  totalBadgesIssued: number;
  totalEvents: number;
}

// --- Helpers ---

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const homeTabs = [
  { key: 'home', label: 'Home', href: '/home' },
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'mycourses', label: 'My courses', href: '/my/courses' },
];

type CourseViewMode = 'card' | 'list' | 'summary';

// --- Loading spinner component ---

function SectionSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 size={24} className="animate-spin text-[var(--moodle-primary)]" />
    </div>
  );
}

// --- Component ---

export default function SiteHomePage() {
  const { editMode } = useDrawerStore();
  const [courseView, setCourseView] = useState<CourseViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');

  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch all data from API endpoints on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses/all');
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch {
        // API unavailable — leave empty
      } finally {
        setLoadingCourses(false);
      }
    }

    async function fetchAnnouncements() {
      try {
        const res = await fetch('/api/announcements');
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data.announcements || []);
        }
      } catch {
        // API unavailable — leave empty
      } finally {
        setLoadingAnnouncements(false);
      }
    }

    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch {
        // API unavailable — leave empty
      } finally {
        setLoadingEvents(false);
      }
    }

    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats || null);
        }
      } catch {
        // API unavailable — leave empty
      } finally {
        setLoadingStats(false);
      }
    }

    fetchCourses();
    fetchAnnouncements();
    fetchEvents();
    fetchStats();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = loadingCourses || loadingAnnouncements || loadingEvents || loadingStats;

  return (
    <>
      <PageHeader
        title="Home"
        breadcrumbs={[{ label: 'Home' }]}
        actions={
          editMode ? (
            <button className="btn btn-outline-secondary text-sm">
              Customise this page
            </button>
          ) : undefined
        }
      />

      <SecondaryNavigation tabs={homeTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Welcome area */}
          <div className="mb-6 p-5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-light)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--moodle-primary)]">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">
                  Welcome to MoodleX
                </h2>
                <p className="text-sm mb-3 text-[var(--text-secondary)]">
                  Your online learning environment. Browse available courses below or
                  visit your{' '}
                  <Link href="/dashboard" className="font-medium text-[var(--moodle-primary)]">
                    Dashboard
                  </Link>{' '}
                  to see your enrolled courses and upcoming activities.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {loadingStats ? (
                    <Loader2 size={14} className="animate-spin text-[var(--moodle-primary)]" />
                  ) : stats ? (
                    <>
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <BookOpen size={15} className="text-[var(--moodle-primary)]" />
                        <span><strong>{stats.totalCourses}</strong> courses available</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Users size={15} className="text-[var(--moodle-primary)]" />
                        <span><strong>{stats.totalEnrollments.toLocaleString()}</strong> active learners</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <MessageSquare size={15} className="text-[var(--moodle-primary)]" />
                        <span><strong>{stats.totalForumPosts}</strong> forum posts</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <BookOpen size={15} className="text-[var(--moodle-primary)]" />
                        <span><strong>{courses.length}</strong> courses available</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <MessageSquare size={15} className="text-[var(--moodle-primary)]" />
                        <span><strong>{announcements.length}</strong> announcements</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Site announcements (Site news forum) */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border-color)]">
              <h3 className="text-base font-semibold flex items-center gap-2 m-0 text-[var(--text-primary)]">
                <Newspaper size={18} className="text-[var(--moodle-primary)]" />
                Site news
              </h3>
              {announcements.length > 0 && (
                <Link
                  href={`/course/${announcements[0].courseId}/mod/forum/${announcements[0].forumId}`}
                  className="text-sm flex items-center gap-1 text-[var(--moodle-primary)]"
                >
                  Older topics
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {loadingAnnouncements ? (
              <SectionSpinner />
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-sm text-[var(--text-secondary)]">
                No announcements yet.
              </div>
            ) : (
              <div>
                {announcements.map((announcement, index) => (
                  <div
                    key={announcement.id}
                    className={`flex gap-3 p-3 ${index < announcements.length - 1 ? 'border-b border-[var(--border-color)]' : ''} ${index === 0 ? 'bg-[var(--bg-light)]' : ''}`}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200">
                      <User size={16} className="text-[var(--text-secondary)]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/course/${announcement.courseId}/mod/forum/${announcement.forumId}/discuss/${announcement.discussionId}`}
                        className="text-sm font-semibold hover:underline line-clamp-1 text-[var(--moodle-primary)]"
                      >
                        {announcement.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs mb-1 text-[var(--text-muted)]">
                        <span>{announcement.author}</span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {formatDate(announcement.date)}
                        </span>
                        {announcement.replies > 0 && (
                          <>
                            <span>&middot;</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={11} />
                              {announcement.replies} {announcement.replies === 1 ? 'reply' : 'replies'}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm m-0 line-clamp-2 text-[var(--text-secondary)]">
                        {announcement.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loadingAnnouncements && announcements.length > 0 && (
              <div className="mt-2 text-center">
                <Link
                  href={`/course/${announcements[0].courseId}/mod/forum/${announcements[0].forumId}`}
                  className="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded hover:underline text-[var(--moodle-primary)]"
                >
                  Add a new topic...
                </Link>
              </div>
            )}
          </div>

          {/* Available courses */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border-color)]">
              <h3 className="text-base font-semibold flex items-center gap-2 m-0 text-[var(--text-primary)]">
                <BookOpen size={18} className="text-[var(--moodle-primary)]" />
                Available courses
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]"
                  />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-3 py-1.5 text-sm border border-[var(--border-color)] rounded bg-white text-[var(--text-primary)]"
                    style={{ paddingLeft: '2rem' }}
                  />
                </div>

                <div className="flex border border-[var(--border-color)] rounded overflow-hidden">
                  {([
                    { mode: 'card' as CourseViewMode, icon: LayoutGrid, title: 'Card' },
                    { mode: 'list' as CourseViewMode, icon: List, title: 'List' },
                    { mode: 'summary' as CourseViewMode, icon: AlignJustify, title: 'Summary' },
                  ]).map(({ mode, icon: Icon, title }, i) => (
                    <button
                      key={mode}
                      className={`p-1.5 border-none cursor-pointer ${i > 0 ? 'border-l border-[var(--border-color)]' : ''} ${
                        courseView === mode
                          ? 'bg-[var(--moodle-primary)] text-white'
                          : 'bg-white text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                      }`}
                      onClick={() => setCourseView(mode)}
                      title={`${title} view`}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loadingCourses ? (
              <SectionSpinner />
            ) : courses.length === 0 ? (
              <div className="text-center py-8 text-sm text-[var(--text-secondary)]">
                No courses available yet.
              </div>
            ) : courseView === 'card' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="card-moodle group relative">
                    <Link href={`/course/${course.id}`} className="no-underline">
                      <CoursePlaceholderImage
                        courseId={course.id}
                        category={course.category}
                        className="card-img-top"
                        size="md"
                      />
                      <div className="card-body pb-2">
                        <p className="text-xs text-[var(--text-muted)] mb-0.5 uppercase tracking-wide">
                          {course.shortname}
                        </p>
                        <h6 className="card-title text-sm group-hover:text-[var(--moodle-primary)] transition-colors line-clamp-2 mb-1">
                          {course.fullname}
                        </h6>
                        <p className="card-text text-xs mb-0">{course.category}</p>
                      </div>
                    </Link>
                    <div className="px-4 pb-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
                      {course.teachers && course.teachers.length > 0 ? (
                        <span className="flex items-center gap-1">
                          <User size={11} />
                          {course.teachers[0]}
                        </span>
                      ) : <span />}
                      {course.studentCount != null && course.studentCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {course.studentCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : courseView === 'list' ? (
              <div className="space-y-1">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-3 p-3 rounded border border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCourseColor(course.id) }}
                    />
                    <Link href={`/course/${course.id}`} className="flex-1 min-w-0 no-underline">
                      <span className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--moodle-primary)]">
                        {course.fullname}
                      </span>
                    </Link>
                    <span className="text-xs text-[var(--text-muted)] flex-shrink-0">{course.category}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex gap-4 p-4 rounded border border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <Link href={`/course/${course.id}`} className="no-underline flex-shrink-0">
                      <CoursePlaceholderImage
                        courseId={course.id}
                        category={course.category}
                        className="w-20 h-20 rounded"
                        size="sm"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--text-muted)] mb-0.5 uppercase tracking-wide">
                        {course.shortname}
                      </p>
                      <Link href={`/course/${course.id}`} className="no-underline">
                        <h6 className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--moodle-primary)] mb-1">
                          {course.fullname}
                        </h6>
                      </Link>
                      <p className="text-xs text-[var(--text-muted)] mb-0">{course.category}</p>
                      {course.summary && (
                        <p className="text-xs m-0 mt-1 line-clamp-2 text-[var(--text-secondary)]">
                          {course.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--text-muted)]">
                        {course.teachers && course.teachers.length > 0 && (
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {course.teachers.join(', ')}
                          </span>
                        )}
                        {course.studentCount != null && course.studentCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {course.studentCount} enrolled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loadingCourses && courses.length > 0 && filteredCourses.length === 0 && (
              <div className="text-center py-8 text-sm text-[var(--text-secondary)]">
                No courses match your search.
              </div>
            )}

            <div className="mt-4 pt-3 text-center border-t border-[var(--border-color)]">
              <Link
                href="/my/courses"
                className="text-sm inline-flex items-center gap-1.5 px-4 py-2 rounded font-medium text-[var(--moodle-primary)] border border-[var(--moodle-primary)]"
              >
                <BookOpen size={14} />
                View all courses
              </Link>
            </div>
          </div>

          {/* Bottom cards: Upcoming events & Site info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Upcoming events */}
            <div className="border border-[var(--border-color)] rounded-lg p-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 m-0 text-[var(--text-primary)]">
                <Calendar size={16} className="text-[var(--moodle-primary)]" />
                Upcoming events
              </h4>
              {loadingEvents ? (
                <SectionSpinner />
              ) : events.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-3">No upcoming events</p>
              ) : (
                <div className="space-y-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-2 text-sm p-2 rounded bg-[var(--bg-light)]"
                    >
                      <Clock size={14} className="flex-shrink-0 mt-0.5 text-[var(--moodle-primary)]" />
                      <div>
                        <Link
                          href={event.courseId ? `/course/${event.courseId}` : '/calendar'}
                          className="font-medium hover:underline text-[var(--moodle-primary)]"
                        >
                          {event.name}
                        </Link>
                        <div className="text-xs text-[var(--text-muted)]">
                          {event.courseShortname && event.courseId && (
                            <>
                              <Link href={`/course/${event.courseId}`} className="hover:underline text-[var(--text-muted)]">
                                {event.courseShortname}
                              </Link>
                              {' '}&middot;{' '}
                            </>
                          )}
                          {formatDate(event.timestart)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 text-center">
                <Link
                  href="/calendar"
                  className="text-xs flex items-center justify-center gap-1 text-[var(--moodle-primary)]"
                >
                  Go to calendar
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Site information */}
            <div className="border border-[var(--border-color)] rounded-lg p-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 m-0 text-[var(--text-primary)]">
                <GraduationCap size={16} className="text-[var(--moodle-primary)]" />
                Site information
              </h4>
              {loadingStats ? (
                <SectionSpinner />
              ) : stats ? (
                <div className="space-y-2.5">
                  {[
                    { icon: BookOpen, label: 'Total courses', value: String(stats.totalCourses) },
                    { icon: Users, label: 'Active learners', value: stats.totalUsers.toLocaleString() },
                    { icon: Users, label: 'Total enrolments', value: stats.totalEnrollments.toLocaleString() },
                    { icon: FileText, label: 'Forum posts', value: String(stats.totalForumPosts) },
                    { icon: Award, label: 'Badges issued', value: String(stats.totalBadgesIssued) },
                    { icon: Calendar, label: 'Total events', value: String(stats.totalEvents) },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm p-2 rounded bg-[var(--bg-light)]"
                      >
                        <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <Icon size={14} className="text-[var(--moodle-primary)]" />
                          {item.label}
                        </span>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-[var(--text-secondary)]">
                  Unable to load site statistics.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
