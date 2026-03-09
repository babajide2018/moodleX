import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Users, ArrowRight } from 'lucide-react';

interface SystemRole {
  id: string;
  name: string;
  shortname: string;
  description: string;
  assignedUsers: number;
}

const systemRoles: SystemRole[] = [
  { id: '1', name: 'Manager', shortname: 'manager', description: 'Managers can access course and modify them.', assignedUsers: 3 },
  { id: '2', name: 'Course creator', shortname: 'coursecreator', description: 'Course creators can create new courses.', assignedUsers: 5 },
  { id: '3', name: 'Teacher', shortname: 'editingteacher', description: 'Teachers can manage and grade courses.', assignedUsers: 0 },
  { id: '4', name: 'Non-editing teacher', shortname: 'teacher', description: 'Non-editing teachers can grade but not change activities.', assignedUsers: 0 },
  { id: '5', name: 'Student', shortname: 'student', description: 'Students have fewer privileges within a course.', assignedUsers: 0 },
];

export default function AssignSystemRolesPage() {
  return (
    <>
      <PageHeader
        title="Assign system roles"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Permissions' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            System roles apply across the entire site. Users assigned a system role will have those capabilities everywhere.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Role</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Description</th>
                  <th className="py-2 px-3 text-center font-semibold">Users assigned</th>
                  <th className="py-2 px-3 w-32 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {systemRoles.map((role) => (
                  <tr key={role.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-3 px-3">
                      <div className="font-medium">{role.name}</div>
                      <div className="text-xs text-[var(--text-muted)] font-mono">{role.shortname}</div>
                    </td>
                    <td className="py-3 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{role.description}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Users size={14} className="text-[var(--text-muted)]" />
                        <span className="font-medium">{role.assignedUsers}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/users/assignroles/${role.shortname}`}
                        className="text-[var(--text-link)] text-xs hover:underline inline-flex items-center gap-1"
                      >
                        Assign users <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
