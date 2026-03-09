'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  MessageSquare,
  Pin,
  Lock,
  Star,
  Plus,
  ChevronDown,
  Search,
} from 'lucide-react';

interface Discussion {
  id: string;
  title: string;
  author: { id: string; name: string; avatar?: string };
  replies: number;
  unread: number;
  lastPost: { author: string; date: string };
  pinned: boolean;
  locked: boolean;
  starred: boolean;
  created: string;
}

const demoForum = {
  id: 'm6',
  name: 'Week 1 Discussion',
  description: 'Share your thoughts about the first week of programming. What challenges did you face? What concepts were most interesting?',
  forumType: 'general',
};

const demoDiscussions: Discussion[] = [
  {
    id: 'd1',
    title: 'Welcome to the course! Please introduce yourself',
    author: { id: '1', name: 'Sarah Johnson' },
    replies: 24,
    unread: 3,
    lastPost: { author: 'Emily Brown', date: '2026-03-08T15:30:00' },
    pinned: true,
    locked: false,
    starred: false,
    created: '2026-03-01T09:00:00',
  },
  {
    id: 'd2',
    title: 'Struggling with the "Hello World" exercise - need help',
    author: { id: '3', name: 'James Williams' },
    replies: 8,
    unread: 0,
    lastPost: { author: 'Sarah Johnson', date: '2026-03-07T11:20:00' },
    pinned: false,
    locked: false,
    starred: true,
    created: '2026-03-05T14:30:00',
  },
  {
    id: 'd3',
    title: 'What IDE/editor is everyone using?',
    author: { id: '5', name: 'Michael Davis' },
    replies: 15,
    unread: 2,
    lastPost: { author: 'David Taylor', date: '2026-03-08T09:45:00' },
    pinned: false,
    locked: false,
    starred: false,
    created: '2026-03-03T10:00:00',
  },
  {
    id: 'd4',
    title: 'Study group for Week 2 topics?',
    author: { id: '4', name: 'Emily Brown' },
    replies: 6,
    unread: 0,
    lastPost: { author: 'Jessica Wilson', date: '2026-03-06T16:00:00' },
    pinned: false,
    locked: false,
    starred: false,
    created: '2026-03-04T11:15:00',
  },
  {
    id: 'd5',
    title: 'Resources for learning programming outside this course',
    author: { id: '1', name: 'Sarah Johnson' },
    replies: 12,
    unread: 0,
    lastPost: { author: 'Robert Thomas', date: '2026-03-05T14:30:00' },
    pinned: false,
    locked: true,
    starred: false,
    created: '2026-03-02T08:30:00',
  },
];

export default function ForumPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastpost');

  const forum = demoForum;

  const filteredDiscussions = demoDiscussions.filter((d) => {
    if (searchQuery) {
      return d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             d.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Sort: pinned first, then by criteria
  const sorted = [...filteredDiscussions].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (sortBy === 'lastpost') {
      return new Date(b.lastPost.date).getTime() - new Date(a.lastPost.date).getTime();
    }
    if (sortBy === 'replies') return b.replies - a.replies;
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });

  return (
    <>
      <PageHeader
        title={forum.name}
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: forum.name },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Forum description */}
          {forum.description && (
            <div className="mb-4 p-4 border border-[var(--border-color)] rounded-lg text-sm">
              {forum.description}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <button className="btn btn-primary text-sm flex items-center gap-1">
              <Plus size={16} /> Add discussion topic
            </button>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  className="form-control text-sm py-1 w-48"
                  style={{ paddingLeft: '2rem' }}
                  placeholder="Search forums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              </div>

              <select
                className="form-control text-sm py-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="lastpost">Sort by last post</option>
                <option value="created">Sort by creation date</option>
                <option value="replies">Sort by replies</option>
              </select>
            </div>
          </div>

          {/* Discussions list */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="bg-[var(--bg-light)] border-b border-[var(--border-color)] grid grid-cols-[1fr_80px_120px] px-4 py-2 text-xs font-semibold text-[var(--text-muted)]">
              <span>Discussion</span>
              <span className="text-center">Replies</span>
              <span className="text-right">Last post</span>
            </div>

            {/* Discussion rows */}
            {sorted.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-muted)]">
                There are no discussion topics yet in this forum.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {sorted.map((discussion) => (
                  <div
                    key={discussion.id}
                    className="grid grid-cols-[1fr_80px_120px] px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors items-center"
                  >
                    {/* Discussion info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {discussion.pinned && (
                          <Pin size={12} className="text-[var(--moodle-primary)] flex-shrink-0" />
                        )}
                        {discussion.locked && (
                          <Lock size={12} className="text-[var(--text-muted)] flex-shrink-0" />
                        )}
                        {discussion.starred && (
                          <Star size={12} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                        <Link
                          href={`/course/${courseId}/mod/forum/${params.forumId}/discuss/${discussion.id}`}
                          className="text-sm font-medium text-[var(--text-link)] hover:underline truncate"
                        >
                          {discussion.title}
                        </Link>
                        {discussion.unread > 0 && (
                          <span className="badge-moodle">{discussion.unread}</span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        Started by {discussion.author.name}
                      </div>
                    </div>

                    {/* Reply count */}
                    <div className="text-center">
                      <span className="text-sm text-[var(--text-primary)]">{discussion.replies}</span>
                    </div>

                    {/* Last post */}
                    <div className="text-right min-w-0">
                      <div className="text-xs text-[var(--text-primary)] truncate">
                        {discussion.lastPost.author}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {formatDateShort(discussion.lastPost.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Forum subscription info */}
          <div className="mt-4 flex items-center gap-4 text-sm text-[var(--text-muted)]">
            <button className="btn-link text-sm">
              Subscribe to this forum
            </button>
            <span>|</span>
            <span>
              Tracking: <strong>Optional</strong>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}
