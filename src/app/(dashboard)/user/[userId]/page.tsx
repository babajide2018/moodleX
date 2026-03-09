'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  Mail,
  MapPin,
  Globe,
  Clock,
  Calendar,
  MessageSquare,
  BookOpen,
  Award,
} from 'lucide-react';

const demoUser = {
  id: '3',
  firstname: 'James',
  lastname: 'Williams',
  email: 'james.w@example.com',
  city: 'London',
  country: 'United Kingdom',
  timezone: 'Europe/London',
  description: 'Computer Science student with a passion for web development and open-source software. Currently in my second year, focusing on algorithms and data structures.',
  institution: 'University of London',
  department: 'School of Computer Science',
  firstaccess: '2025-09-01T09:00:00',
  lastaccess: '2026-03-08T15:30:00',
  courses: [
    { id: '1', fullname: 'Introduction to Computer Science', shortname: 'CS101', role: 'Student' },
    { id: '2', fullname: 'Data Structures and Algorithms', shortname: 'CS201', role: 'Student' },
    { id: '5', fullname: 'Mathematics for Engineers', shortname: 'MATH201', role: 'Student' },
  ],
  badges: [
    { id: 'b1', name: 'Course Completed', image: '', issuedOn: '2026-01-15' },
    { id: 'b2', name: 'Active Participant', image: '', issuedOn: '2026-02-20' },
  ],
};

export default function UserProfilePage() {
  const params = useParams();
  const user = demoUser;

  return (
    <>
      <PageHeader
        title={`${user.firstname} ${user.lastname}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Participants' },
          { label: `${user.firstname} ${user.lastname}` },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Profile header */}
          <div className="border border-[var(--border-color)] rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-3xl font-bold flex-shrink-0">
                {user.firstname[0]}{user.lastname[0]}
              </div>

              {/* User info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">
                  {user.firstname} {user.lastname}
                </h2>

                <div className="space-y-1.5 text-sm text-[var(--text-secondary)] mb-4">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[var(--text-muted)]" />
                    <a href={`mailto:${user.email}`} className="text-[var(--text-link)]">
                      {user.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[var(--text-muted)]" />
                    {user.city}, {user.country}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-[var(--text-muted)]" />
                    {user.institution} - {user.department}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[var(--text-muted)]" />
                    Timezone: {user.timezone}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="btn btn-primary text-sm flex items-center gap-1">
                    <MessageSquare size={14} /> Message
                  </button>
                  <button className="btn btn-secondary text-sm">
                    Add to contacts
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            {user.description && (
              <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-sm text-[var(--text-secondary)]">{user.description}</p>
              </div>
            )}
          </div>

          {/* Details & courses in two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User details */}
            <div className="border border-[var(--border-color)] rounded-lg">
              <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-semibold m-0">User details</h3>
              </div>
              <div className="p-0">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)] w-36">Email</td>
                      <td className="py-2 px-4">{user.email}</td>
                    </tr>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">City/town</td>
                      <td className="py-2 px-4">{user.city}</td>
                    </tr>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">Country</td>
                      <td className="py-2 px-4">{user.country}</td>
                    </tr>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                        <span className="flex items-center gap-1"><Calendar size={12} /> First access</span>
                      </td>
                      <td className="py-2 px-4">
                        {new Date(user.firstaccess).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                        <span className="flex items-center gap-1"><Clock size={12} /> Last access</span>
                      </td>
                      <td className="py-2 px-4">
                        {new Date(user.lastaccess).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Course details */}
            <div className="border border-[var(--border-color)] rounded-lg">
              <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-semibold m-0 flex items-center gap-2">
                  <BookOpen size={14} /> Course details
                </h3>
              </div>
              <div className="divide-y divide-[var(--border-color)]">
                {user.courses.map((course) => (
                  <div key={course.id} className="px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors">
                    <Link
                      href={`/course/${course.id}`}
                      className="text-sm font-medium text-[var(--text-link)] hover:underline"
                    >
                      {course.fullname}
                    </Link>
                    <div className="text-xs text-[var(--text-muted)]">
                      {course.shortname} &middot; {course.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="border border-[var(--border-color)] rounded-lg mt-6">
              <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-semibold m-0 flex items-center gap-2">
                  <Award size={14} /> Badges ({user.badges.length})
                </h3>
              </div>
              <div className="p-4 flex gap-4">
                {user.badges.map((badge) => (
                  <div key={badge.id} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-1 mx-auto">
                      <Award size={24} className="text-amber-600" />
                    </div>
                    <div className="text-xs font-medium">{badge.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {new Date(badge.issuedOn).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
