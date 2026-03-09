'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  Search,
  Send,
  Plus,
  Settings,
  Star,
  MoreVertical,
  User,
  Users,
  Check,
  CheckCheck,
  Circle,
  MessageSquare,
} from 'lucide-react';

interface Conversation {
  id: string;
  type: 'private' | 'group';
  name: string;
  participants: { id: string; name: string }[];
  lastMessage: { content: string; senderId: string; date: string; read: boolean };
  unreadCount: number;
  isFavourite: boolean;
  isOnline: boolean;
}

const currentUserId = '1';

const demoConversations: Conversation[] = [
  {
    id: 'c1', type: 'private', name: 'James Williams',
    participants: [{ id: '3', name: 'James Williams' }],
    lastMessage: { content: 'Thanks for the help with the assignment!', senderId: '3', date: '2026-03-08T15:30:00', read: true },
    unreadCount: 0, isFavourite: true, isOnline: true,
  },
  {
    id: 'c2', type: 'private', name: 'Emily Brown',
    participants: [{ id: '4', name: 'Emily Brown' }],
    lastMessage: { content: 'Can we discuss the project?', senderId: '4', date: '2026-03-08T14:00:00', read: false },
    unreadCount: 2, isFavourite: false, isOnline: true,
  },
  {
    id: 'c3', type: 'group', name: 'CS101 Study Group',
    participants: [
      { id: '3', name: 'James Williams' },
      { id: '4', name: 'Emily Brown' },
      { id: '5', name: 'Michael Davis' },
    ],
    lastMessage: { content: 'Meeting at 3pm tomorrow?', senderId: '5', date: '2026-03-08T12:00:00', read: false },
    unreadCount: 5, isFavourite: true, isOnline: false,
  },
  {
    id: 'c4', type: 'private', name: 'Michael Davis',
    participants: [{ id: '5', name: 'Michael Davis' }],
    lastMessage: { content: 'I submitted the quiz. How did you find it?', senderId: '1', date: '2026-03-07T16:00:00', read: true },
    unreadCount: 0, isFavourite: false, isOnline: false,
  },
  {
    id: 'c5', type: 'private', name: 'Sarah Johnson',
    participants: [{ id: '2', name: 'Sarah Johnson' }],
    lastMessage: { content: 'Your grade for Assignment 1 has been posted.', senderId: '2', date: '2026-03-07T10:00:00', read: true },
    unreadCount: 0, isFavourite: false, isOnline: true,
  },
];

const demoMessages = [
  { id: 'm1', senderId: '3', content: 'Hi! I have a question about the first assignment.', date: '2026-03-08T14:00:00' },
  { id: 'm2', senderId: '1', content: 'Sure, what do you need help with?', date: '2026-03-08T14:05:00' },
  { id: 'm3', senderId: '3', content: 'I\'m confused about the requirements for the input validation part. The instructions say "handle edge cases" but what exactly should we handle?', date: '2026-03-08T14:08:00' },
  { id: 'm4', senderId: '1', content: 'Good question! You should handle:\n1. Empty string input\n2. Very long input (more than 100 characters)\n3. Input with special characters\n\nFocus mainly on empty strings for now, that\'s the most important edge case.', date: '2026-03-08T14:15:00' },
  { id: 'm5', senderId: '3', content: 'That makes sense. So I should check if the name is empty before printing the greeting?', date: '2026-03-08T14:20:00' },
  { id: 'm6', senderId: '1', content: 'Exactly! Use an if-else statement to check.', date: '2026-03-08T14:22:00' },
  { id: 'm7', senderId: '3', content: 'Thanks for the help with the assignment!', date: '2026-03-08T15:30:00' },
];

export default function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>('c1');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [filter, setFilter] = useState<'all' | 'favourites' | 'group'>('all');

  const filteredConversations = demoConversations.filter((c) => {
    if (searchQuery) {
      return c.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (filter === 'favourites') return c.isFavourite;
    if (filter === 'group') return c.type === 'group';
    return true;
  });

  const selectedConv = demoConversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // In real app, POST to API
    setMessageText('');
  };

  return (
    <>
      <PageHeader
        title="Messages"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Messages' },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
            <div className="flex h-full">
              {/* Conversations sidebar */}
              <div className="w-80 border-r border-[var(--border-color)] flex flex-col bg-white">
                {/* Search */}
                <div className="p-3 border-b border-[var(--border-color)]">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      className="form-control text-sm"
                      style={{ paddingLeft: '2rem' }}
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  </div>

                  {/* Filter tabs */}
                  <div className="flex gap-1">
                    {(['all', 'favourites', 'group'] as const).map((f) => (
                      <button
                        key={f}
                        className={`px-3 py-1 text-xs rounded-full ${
                          filter === f
                            ? 'bg-[var(--moodle-primary)] text-white'
                            : 'bg-[var(--bg-light)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                        }`}
                        onClick={() => setFilter(f)}
                      >
                        {f === 'all' ? 'All' : f === 'favourites' ? 'Starred' : 'Group'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      className={`w-full text-left px-3 py-3 border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors ${
                        selectedConversation === conv.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedConversation(conv.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs font-medium">
                            {conv.type === 'group' ? (
                              <Users size={16} />
                            ) : (
                              conv.name.split(' ').map((n) => n[0]).join('')
                            )}
                          </div>
                          {conv.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate flex items-center gap-1">
                              {conv.isFavourite && <Star size={10} className="text-yellow-500 fill-yellow-500" />}
                              {conv.name}
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">
                              {formatTimeShort(conv.lastMessage.date)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-xs text-[var(--text-muted)] truncate pr-2">
                              {conv.lastMessage.senderId === currentUserId && (
                                <span className="inline-flex items-center mr-1">
                                  {conv.lastMessage.read ? (
                                    <CheckCheck size={10} className="text-[var(--moodle-primary)]" />
                                  ) : (
                                    <Check size={10} />
                                  )}
                                </span>
                              )}
                              {conv.lastMessage.content}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="badge-moodle flex-shrink-0">{conv.unreadCount}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* New message button */}
                <div className="p-3 border-t border-[var(--border-color)]">
                  <button className="btn btn-primary text-sm w-full flex items-center justify-center gap-1">
                    <Plus size={14} /> New message
                  </button>
                </div>
              </div>

              {/* Message area */}
              <div className="flex-1 flex flex-col">
                {selectedConv ? (
                  <>
                    {/* Chat header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-light)]">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs font-medium">
                            {selectedConv.type === 'group' ? (
                              <Users size={14} />
                            ) : (
                              selectedConv.name.split(' ').map((n) => n[0]).join('')
                            )}
                          </div>
                          {selectedConv.isOnline && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{selectedConv.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">
                            {selectedConv.isOnline ? 'Online' : 'Offline'}
                            {selectedConv.type === 'group' && ` · ${selectedConv.participants.length + 1} members`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="btn-icon" title="Star conversation">
                          <Star size={14} className={selectedConv.isFavourite ? 'text-yellow-500 fill-yellow-500' : ''} />
                        </button>
                        <button className="btn-icon" title="Settings">
                          <Settings size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {demoMessages.map((msg) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isMe ? 'order-2' : ''}`}>
                              {!isMe && (
                                <span className="text-xs text-[var(--text-muted)] mb-1 block">
                                  {selectedConv.name}
                                </span>
                              )}
                              <div
                                className={`rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                                  isMe
                                    ? 'bg-[var(--moodle-primary)] text-white rounded-br-sm'
                                    : 'bg-[var(--bg-light)] border border-[var(--border-color)] rounded-bl-sm'
                                }`}
                              >
                                {msg.content}
                              </div>
                              <div className={`text-xs text-[var(--text-muted)] mt-0.5 ${isMe ? 'text-right' : ''}`}>
                                {new Date(msg.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Message input */}
                    <div className="border-t border-[var(--border-color)] p-3">
                      <div className="flex items-end gap-2">
                        <textarea
                          className="form-control text-sm flex-1 resize-none"
                          placeholder="Write a message..."
                          rows={2}
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <button
                          className="btn btn-primary p-2"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                        >
                          <Send size={16} />
                        </button>
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">
                        Press Enter to send, Shift+Enter for new line
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
                    <div className="text-center">
                      <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function formatTimeShort(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString('en-GB', { weekday: 'short' });
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
