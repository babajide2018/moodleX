'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Search,
  UserPlus,
  Filter,
  ChevronDown,
  Mail,
  MoreVertical,
  Shield,
  GraduationCap,
  User as UserIcon,
  Settings,
} from 'lucide-react';

interface Participant {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  lastaccess: string;
  status: 'active' | 'suspended';
  groups: string[];
}

const roleIcons: Record<string, React.ReactNode> = {
  editingteacher: <Shield size={14} className="text-[var(--moodle-danger)]" />,
  teacher: <Shield size={14} className="text-orange-500" />,
  student: <GraduationCap size={14} className="text-[var(--moodle-primary)]" />,
};

const roleLabels: Record<string, string> = {
  editingteacher: 'Teacher',
  teacher: 'Non-editing teacher',
  student: 'Student',
};

const demoParticipants: Participant[] = [
  { id: '1', firstname: 'Admin', lastname: 'User', email: 'admin@example.com', role: 'editingteacher', lastaccess: '2 minutes ago', status: 'active', groups: ['Group A'] },
  { id: '2', firstname: 'Sarah', lastname: 'Johnson', email: 'sarah.j@example.com', role: 'editingteacher', lastaccess: '1 hour ago', status: 'active', groups: [] },
  { id: '3', firstname: 'James', lastname: 'Williams', email: 'james.w@example.com', role: 'student', lastaccess: '3 hours ago', status: 'active', groups: ['Group A'] },
  { id: '4', firstname: 'Emily', lastname: 'Brown', email: 'emily.b@example.com', role: 'student', lastaccess: 'Yesterday', status: 'active', groups: ['Group B'] },
  { id: '5', firstname: 'Michael', lastname: 'Davis', email: 'michael.d@example.com', role: 'student', lastaccess: '2 days ago', status: 'active', groups: ['Group A'] },
  { id: '6', firstname: 'Jessica', lastname: 'Wilson', email: 'jessica.w@example.com', role: 'student', lastaccess: '3 days ago', status: 'active', groups: ['Group B'] },
  { id: '7', firstname: 'David', lastname: 'Taylor', email: 'david.t@example.com', role: 'student', lastaccess: '1 week ago', status: 'active', groups: [] },
  { id: '8', firstname: 'Ashley', lastname: 'Anderson', email: 'ashley.a@example.com', role: 'student', lastaccess: 'Never', status: 'suspended', groups: ['Group A'] },
  { id: '9', firstname: 'Robert', lastname: 'Thomas', email: 'robert.t@example.com', role: 'student', lastaccess: '5 days ago', status: 'active', groups: ['Group B'] },
  { id: '10', firstname: 'Jennifer', lastname: 'Martinez', email: 'jennifer.m@example.com', role: 'student', lastaccess: '4 hours ago', status: 'active', groups: [] },
];

export default function ParticipantsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showEnrolModal, setShowEnrolModal] = useState(false);

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
  ];

  const filtered = demoParticipants.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!`${p.firstname} ${p.lastname}`.toLowerCase().includes(q) &&
          !p.email.toLowerCase().includes(q)) return false;
    }
    if (roleFilter !== 'all' && p.role !== roleFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedUsers.size === filtered.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filtered.map((p) => p.id)));
    }
  };

  return (
    <>
      <PageHeader
        title="Participants"
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: 'Participants' },
        ]}
        actions={
          <button
            className="btn btn-primary text-sm flex items-center gap-1"
            onClick={() => setShowEnrolModal(true)}
          >
            <UserPlus size={16} /> Enrol users
          </button>
        }
      />

      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Filters bar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <input
                type="text"
                className="form-control text-sm"
                style={{ paddingLeft: '2rem' }}
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[var(--text-muted)]" />
              <select
                className="form-control text-sm py-1"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All roles</option>
                <option value="editingteacher">Teacher</option>
                <option value="teacher">Non-editing teacher</option>
                <option value="student">Student</option>
              </select>

              <select
                className="form-control text-sm py-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Active and suspended</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <span className="text-sm text-[var(--text-muted)]">
              {filtered.length} participants
            </span>
          </div>

          {/* Participants table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left w-8">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedUsers.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">First name / Surname</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Email address</th>
                  <th className="py-2 px-3 text-left font-semibold">Roles</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Groups</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Last access</th>
                  <th className="py-2 px-3 text-left font-semibold">Status</th>
                  <th className="py-2 px-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((participant) => (
                  <tr
                    key={participant.id}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <td className="py-2 px-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedUsers.has(participant.id)}
                        onChange={() => toggleUser(participant.id)}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {participant.firstname[0]}{participant.lastname[0]}
                        </div>
                        <Link
                          href={`/user/${participant.id}`}
                          className="text-[var(--text-link)] font-medium hover:underline"
                        >
                          {participant.firstname} {participant.lastname}
                        </Link>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell">
                      {participant.email}
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1 text-xs bg-[var(--bg-light)] px-2 py-0.5 rounded">
                        {roleIcons[participant.role]}
                        {roleLabels[participant.role]}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden lg:table-cell">
                      {participant.groups.length > 0 ? participant.groups.join(', ') : 'No group'}
                    </td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">
                      {participant.lastaccess}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center text-xs px-2 py-0.5 rounded ${
                          participant.status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {participant.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <button className="btn-icon">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bulk actions */}
          {selectedUsers.size > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-[var(--text-muted)]">
                With {selectedUsers.size} selected users:
              </span>
              <select className="form-control text-sm py-1 w-auto">
                <option value="">Choose...</option>
                <option value="message">Send a message</option>
                <option value="addnote">Add a note</option>
                <option value="remove">Remove from course</option>
              </select>
              <button className="btn btn-secondary text-sm">Go</button>
            </div>
          )}

          {/* Enrolment methods info */}
          <div className="mt-6 text-sm">
            <h3 className="font-semibold mb-2">Enrolment methods</h3>
            <div className="border border-[var(--border-color)] rounded-lg divide-y divide-[var(--border-color)]">
              <div className="flex items-center justify-between px-4 py-2">
                <div>
                  <span className="font-medium">Manual enrolments</span>
                  <span className="text-[var(--text-muted)] ml-2">
                    ({demoParticipants.length} enrolled users)
                  </span>
                </div>
                <button className="btn-icon"><Settings size={14} /></button>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <div>
                  <span className="font-medium">Self enrolment (Student)</span>
                  <span className="text-[var(--text-muted)] ml-2">(0 enrolled users)</span>
                </div>
                <button className="btn-icon"><Settings size={14} /></button>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <div>
                  <span className="font-medium">Guest access</span>
                  <span className="text-xs text-[var(--text-muted)] ml-2">Disabled</span>
                </div>
                <button className="btn-icon"><Settings size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrol users modal */}
      {showEnrolModal && (
        <div className="fixed inset-0 bg-black/40 z-[1060] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[var(--border-color)] shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="font-semibold text-base">Enrol users</h3>
              <button className="btn-icon" onClick={() => setShowEnrolModal(false)}>
                &times;
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="form-label text-sm">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for users..."
                  autoFocus
                />
              </div>
              <div>
                <label className="form-label text-sm">Assign role</label>
                <select className="form-control">
                  <option value="student">Student</option>
                  <option value="editingteacher">Teacher</option>
                  <option value="teacher">Non-editing teacher</option>
                </select>
              </div>
              <div className="border border-[var(--border-color)] rounded p-4 min-h-[120px] text-sm text-[var(--text-muted)]">
                Search for users above to enrol them in this course.
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-light)]">
              <button className="btn btn-secondary" onClick={() => setShowEnrolModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary">Enrol users</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
