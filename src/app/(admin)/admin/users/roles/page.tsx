import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Pencil, Shield } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  shortname: string;
  description: string;
  users: number;
  archetype: string;
}

const demoRoles: Role[] = [
  { id: '1', name: 'Manager', shortname: 'manager', description: 'Managers can access course and modify them, they usually do not participate in courses.', users: 3, archetype: 'manager' },
  { id: '2', name: 'Course creator', shortname: 'coursecreator', description: 'Course creators can create new courses.', users: 5, archetype: 'coursecreator' },
  { id: '3', name: 'Teacher', shortname: 'editingteacher', description: 'Teachers can do anything within a course, including changing the activities and grading students.', users: 24, archetype: 'editingteacher' },
  { id: '4', name: 'Non-editing teacher', shortname: 'teacher', description: 'Non-editing teachers can teach in courses and grade students, but may not alter activities.', users: 12, archetype: 'teacher' },
  { id: '5', name: 'Student', shortname: 'student', description: 'Students generally have fewer privileges within a course.', users: 458, archetype: 'student' },
  { id: '6', name: 'Guest', shortname: 'guest', description: 'Guests have minimal privileges and usually cannot enter text anywhere.', users: 0, archetype: 'guest' },
  { id: '7', name: 'Authenticated user', shortname: 'user', description: 'All logged in users.', users: 502, archetype: 'user' },
];

const archetypeColors: Record<string, string> = {
  manager: 'bg-purple-50 text-purple-700',
  coursecreator: 'bg-indigo-50 text-indigo-700',
  editingteacher: 'bg-orange-50 text-orange-700',
  teacher: 'bg-amber-50 text-amber-700',
  student: 'bg-blue-50 text-blue-700',
  guest: 'bg-gray-50 text-gray-600',
  user: 'bg-green-50 text-green-700',
};

export default function DefineRolesPage() {
  return (
    <>
      <PageHeader
        title="Define roles"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Permissions' },
        ]}
        actions={
          <button className="btn btn-primary text-sm flex items-center gap-1">
            <Shield size={16} /> Add a new role
          </button>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Roles define what users can do throughout the site and in specific contexts. Each role consists of a set of capability permissions.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Role name</th>
                  <th className="py-2 px-3 text-left font-semibold">Short name</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Description</th>
                  <th className="py-2 px-3 text-center font-semibold">Users</th>
                  <th className="py-2 px-3 w-16 text-right font-semibold">Edit</th>
                </tr>
              </thead>
              <tbody>
                {demoRoles.map((role) => (
                  <tr key={role.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded font-medium ${archetypeColors[role.archetype] || 'bg-gray-50 text-gray-600'}`}>
                        {role.name}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] font-mono text-xs">{role.shortname}</td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell max-w-xs truncate">{role.description}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-[var(--text-link)] cursor-pointer hover:underline">{role.users}</span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button className="btn-icon" title="Edit role">
                        <Pencil size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-[var(--text-muted)]">
            Changes to role definitions affect all users who are assigned that role.
          </div>
        </div>
      </div>
    </>
  );
}
