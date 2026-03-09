'use client';

import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

interface Comment {
  id: string;
  userName: string;
  initials: string;
  avatarColor: string;
  date: string;
  text: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    userName: 'Alice Johnson',
    initials: 'AJ',
    avatarColor: '#4e6e9c',
    date: '8 March 2026, 14:30',
    text: 'Great progress on the group project so far!',
  },
  {
    id: '2',
    userName: 'Bob Smith',
    initials: 'BS',
    avatarColor: '#57a89a',
    date: '7 March 2026, 09:15',
    text: 'Remember to submit the peer review by Friday.',
  },
  {
    id: '3',
    userName: 'Carol Williams',
    initials: 'CW',
    avatarColor: '#7b62a8',
    date: '6 March 2026, 16:45',
    text: 'The lecture slides for Module 6 have been uploaded.',
  },
];

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: String(Date.now()),
      userName: 'You',
      initials: 'YO',
      avatarColor: '#e8a54b',
      date: 'Just now',
      text: newComment.trim(),
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="border border-[var(--border-color)] rounded mb-4">
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)]">
        <h6 className="text-sm font-semibold m-0">Comments</h6>
      </div>
      <div className="p-3">
        {/* Add comment form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
          <input
            type="text"
            className="flex-1 text-xs border border-[var(--border-color)] rounded px-2 py-1.5 outline-none focus:border-[var(--moodle-primary)]"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="p-1.5 rounded bg-[var(--moodle-primary)] text-white hover:opacity-90 disabled:opacity-50 flex-shrink-0"
            disabled={!newComment.trim()}
          >
            <Send size={14} />
          </button>
        </form>

        {/* Comments list */}
        {comments.length === 0 ? (
          <div className="text-center py-4">
            <MessageCircle size={32} className="mx-auto mb-2 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)] m-0">No comments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
                  style={{ backgroundColor: comment.avatarColor }}
                >
                  {comment.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      {comment.userName}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] m-0 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
