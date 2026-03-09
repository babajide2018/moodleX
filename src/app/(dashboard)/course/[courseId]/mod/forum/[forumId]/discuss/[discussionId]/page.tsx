'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  Reply,
  ThumbsUp,
  Flag,
  MoreVertical,
  Pin,
  Lock,
  Star,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  Clock,
  MessageSquare,
} from 'lucide-react';

interface ForumPost {
  id: string;
  author: { id: string; name: string; avatar?: string };
  content: string;
  createdAt: string;
  editedAt?: string;
  rating: number;
  parentId?: string;
  replies: ForumPost[];
  isStarter: boolean;
}

const demoDiscussion = {
  id: 'd2',
  title: 'Struggling with the "Hello World" exercise - need help',
  pinned: false,
  locked: false,
  starred: true,
  forumName: 'Week 1 Discussion',
  forumId: 'm6',
};

const demoThread: ForumPost = {
  id: 'p1',
  author: { id: '3', name: 'James Williams' },
  content: `I'm having trouble getting the "Hello World" program to work. I followed the instructions but keep getting a syntax error.\n\nHere's what I wrote:\n\n\`\`\`python\nprint("Hello World!)\n\`\`\`\n\nThe error says:\n\`SyntaxError: EOL while scanning string literal\`\n\nCan anyone help me figure out what's wrong? I've been staring at this for an hour and can't see the issue.`,
  createdAt: '2026-03-05T14:30:00',
  rating: 0,
  parentId: undefined,
  isStarter: true,
  replies: [
    {
      id: 'p2',
      author: { id: '1', name: 'Sarah Johnson' },
      content: `Hi James,\n\nI can see the problem! You're missing the closing quotation mark in your print statement.\n\nYou wrote:\n\`\`\`python\nprint("Hello World!)\n\`\`\`\n\nIt should be:\n\`\`\`python\nprint("Hello World!")\n\`\`\`\n\nNotice the missing \`"\` before the closing parenthesis. This is a very common mistake, especially when you're just starting out. Don't worry about it!`,
      createdAt: '2026-03-05T15:10:00',
      rating: 5,
      parentId: 'p1',
      isStarter: false,
      replies: [
        {
          id: 'p3',
          author: { id: '3', name: 'James Williams' },
          content: `Thank you so much Sarah! I can't believe I missed that. It works now! 🎉\n\nSuch a small thing but it caused such a confusing error message.`,
          createdAt: '2026-03-05T15:25:00',
          rating: 2,
          parentId: 'p2',
          isStarter: false,
          replies: [],
        },
      ],
    },
    {
      id: 'p4',
      author: { id: '5', name: 'Michael Davis' },
      content: `A good tip: most code editors will highlight mismatched quotes for you. Try using VS Code - it shows these kinds of errors right away with red underlines.\n\nAlso, the error message "EOL while scanning string literal" basically means Python reached the end of the line while still looking for the closing quote. Once you know what it means, it's easier to debug!`,
      createdAt: '2026-03-05T16:00:00',
      rating: 8,
      parentId: 'p1',
      isStarter: false,
      replies: [
        {
          id: 'p5',
          author: { id: '4', name: 'Emily Brown' },
          content: `+1 for VS Code! The Python extension is really helpful for beginners. It catches these syntax errors as you type.`,
          createdAt: '2026-03-05T17:30:00',
          rating: 3,
          parentId: 'p4',
          isStarter: false,
          replies: [],
        },
      ],
    },
    {
      id: 'p6',
      author: { id: '6', name: 'Jessica Wilson' },
      content: `I had the exact same problem last week! Don't worry, it gets easier. A few tips:\n\n1. Always check your opening and closing quotes match\n2. Use an editor that highlights syntax\n3. Read error messages carefully - they usually point you to the right line\n\nKeep going! 💪`,
      createdAt: '2026-03-06T09:00:00',
      rating: 4,
      parentId: 'p1',
      isStarter: false,
      replies: [],
    },
    {
      id: 'p7',
      author: { id: '1', name: 'Sarah Johnson' },
      content: `Great tips from everyone! I want to add that the Python documentation has a really good section on common errors for beginners:\n\nhttps://docs.python.org/3/tutorial/errors.html\n\nI'd recommend bookmarking it.`,
      createdAt: '2026-03-07T11:20:00',
      rating: 6,
      parentId: 'p1',
      isStarter: false,
      replies: [],
    },
  ],
};

function PostComponent({
  post,
  depth,
  courseId,
  isLocked,
}: {
  post: ForumPost;
  depth: number;
  courseId: string;
  isLocked: boolean;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const maxIndent = 4;
  const indent = Math.min(depth, maxIndent);

  return (
    <div className={`${indent > 0 ? 'ml-6 pl-4 border-l-2 border-[var(--border-color)]' : ''}`}>
      <div className={`border border-[var(--border-color)] rounded-lg mb-3 ${post.isStarter ? 'border-[var(--moodle-primary)] border-l-4' : ''}`}>
        {/* Post header */}
        <div className="flex items-start justify-between px-4 py-2 bg-[var(--bg-light)] border-b border-[var(--border-color)] rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
              {post.author.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <Link
                href={`/user/${post.author.id}`}
                className="text-sm font-medium text-[var(--text-link)] hover:underline"
              >
                {post.author.name}
              </Link>
              <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Clock size={10} />
                {new Date(post.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
                {post.editedAt && <span className="italic">(edited)</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {post.replies.length > 0 && (
              <button
                className="p-1 rounded text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                onClick={() => setCollapsed(!collapsed)}
                title={collapsed ? 'Expand replies' : 'Collapse replies'}
              >
                {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
            <div className="relative">
              <button
                className="btn-icon"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical size={14} />
              </button>
              {showActions && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[var(--border-color)] rounded-lg shadow-lg z-10 w-40">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2">
                    <Edit3 size={12} /> Edit
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2">
                    <Trash2 size={12} /> Delete
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2">
                    <Flag size={12} /> Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post content */}
        <div className="px-4 py-3">
          <div className="text-sm whitespace-pre-line">{post.content}</div>
        </div>

        {/* Post actions */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-light)]">
          {!isLocked && (
            <button
              className="text-xs text-[var(--text-link)] hover:underline flex items-center gap-1"
              onClick={() => setShowReply(!showReply)}
            >
              <Reply size={12} /> Reply
            </button>
          )}
          <button className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1">
            <ThumbsUp size={12} />
            {post.rating > 0 && <span>{post.rating}</span>}
          </button>
          <span className="text-xs text-[var(--text-muted)]">
            Permalink
          </span>
        </div>

        {/* Reply form */}
        {showReply && (
          <div className="px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-light)]">
            <textarea
              className="form-control text-sm min-h-[100px] mb-2"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button className="btn btn-primary text-sm">
                Submit
              </button>
              <button
                className="btn btn-secondary text-sm"
                onClick={() => { setShowReply(false); setReplyText(''); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {!collapsed && post.replies.map((reply) => (
        <PostComponent
          key={reply.id}
          post={reply}
          depth={depth + 1}
          courseId={courseId}
          isLocked={isLocked}
        />
      ))}
    </div>
  );
}

export default function DiscussionPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const forumId = params.forumId as string;

  const discussion = demoDiscussion;
  const thread = demoThread;

  const totalPosts = countPosts(thread);

  return (
    <>
      <PageHeader
        title={discussion.title}
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: discussion.forumName, href: `/course/${courseId}/mod/forum/${forumId}` },
          { label: discussion.title },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Discussion status bar */}
          <div className="flex items-center justify-between mb-4 p-3 bg-[var(--bg-light)] border border-[var(--border-color)] rounded-lg">
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-[var(--text-muted)]">
                <MessageSquare size={14} /> {totalPosts} posts
              </span>
              {discussion.starred && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" /> Starred
                </span>
              )}
              {discussion.pinned && (
                <span className="flex items-center gap-1 text-[var(--moodle-primary)]">
                  <Pin size={14} /> Pinned
                </span>
              )}
              {discussion.locked && (
                <span className="flex items-center gap-1 text-[var(--text-muted)]">
                  <Lock size={14} /> Locked
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-secondary text-xs flex items-center gap-1">
                <Star size={12} /> {discussion.starred ? 'Unstar' : 'Star'}
              </button>
              <button className="btn btn-secondary text-xs flex items-center gap-1">
                Subscribe
              </button>
            </div>
          </div>

          {/* Thread */}
          <PostComponent
            post={thread}
            depth={0}
            courseId={courseId}
            isLocked={discussion.locked}
          />

          {/* Bottom reply */}
          {!discussion.locked && (
            <div className="mt-4">
              <Link
                href={`/course/${courseId}/mod/forum/${forumId}`}
                className="btn btn-secondary text-sm"
              >
                Back to forum
              </Link>
            </div>
          )}

          {discussion.locked && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-center gap-2">
              <Lock size={14} />
              This discussion has been locked. No new replies can be posted.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function countPosts(post: ForumPost): number {
  return 1 + post.replies.reduce((sum, r) => sum + countPosts(r), 0);
}
