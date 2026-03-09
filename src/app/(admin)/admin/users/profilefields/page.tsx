'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';

interface ProfileField {
  id: string;
  name: string;
  shortname: string;
  type: string;
  required: boolean;
  locked: boolean;
  visible: string;
  category: string;
}

const demoFields: ProfileField[] = [
  { id: '1', name: 'Department', shortname: 'department', type: 'Text input', required: false, locked: false, visible: 'Everyone', category: 'Other fields' },
  { id: '2', name: 'Employee ID', shortname: 'employeeid', type: 'Text input', required: true, locked: true, visible: 'Admins only', category: 'Other fields' },
  { id: '3', name: 'T-Shirt Size', shortname: 'tshirtsize', type: 'Dropdown menu', required: false, locked: false, visible: 'Everyone', category: 'Other fields' },
  { id: '4', name: 'Bio', shortname: 'bio', type: 'Text area', required: false, locked: false, visible: 'Everyone', category: 'Other fields' },
  { id: '5', name: 'Agree to Terms', shortname: 'agreetoterms', type: 'Checkbox', required: true, locked: false, visible: 'Not visible', category: 'Other fields' },
];

export default function ProfileFieldsPage() {
  const [fields] = useState<ProfileField[]>(demoFields);

  return (
    <>
      <PageHeader
        title="User profile fields"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Accounts' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button className="btn btn-primary text-sm flex items-center gap-1">
              <Plus size={16} /> Create a new profile field
            </button>
          </div>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Category header */}
          <div className="border border-[var(--border-color)] rounded-lg bg-white mb-4">
            <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-light)] flex items-center justify-between">
              <h2 className="text-sm font-semibold">Other fields</h2>
              <button className="btn btn-secondary text-xs">Create a new profile category</button>
            </div>

            {fields.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-muted)]">
                No custom profile fields have been defined.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="py-2 px-3 text-left w-8"></th>
                    <th className="py-2 px-3 text-left font-semibold">Name</th>
                    <th className="py-2 px-3 text-left font-semibold">Short name</th>
                    <th className="py-2 px-3 text-left font-semibold">Type</th>
                    <th className="py-2 px-3 text-center font-semibold">Required</th>
                    <th className="py-2 px-3 text-center font-semibold">Locked</th>
                    <th className="py-2 px-3 text-left font-semibold">Visible</th>
                    <th className="py-2 px-3 w-24 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field) => (
                    <tr key={field.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                      <td className="py-2 px-3 text-[var(--text-muted)] cursor-grab">
                        <GripVertical size={14} />
                      </td>
                      <td className="py-2 px-3 font-medium">{field.name}</td>
                      <td className="py-2 px-3 text-[var(--text-muted)]">{field.shortname}</td>
                      <td className="py-2 px-3">
                        <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-[var(--bg-light)] border border-[var(--border-color)]">
                          {field.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {field.required ? (
                          <span className="text-green-600 text-xs font-medium">Yes</span>
                        ) : (
                          <span className="text-[var(--text-muted)] text-xs">No</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {field.locked ? (
                          <span className="text-amber-600 text-xs font-medium">Yes</span>
                        ) : (
                          <span className="text-[var(--text-muted)] text-xs">No</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-xs">{field.visible}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="btn-icon" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button className="btn-icon text-red-500" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Field type selector */}
          <div className="border border-[var(--border-color)] rounded-lg bg-white p-4">
            <h3 className="text-sm font-semibold mb-3">Create a new profile field</h3>
            <div className="flex flex-wrap gap-2">
              {['Checkbox', 'Date/Time', 'Dropdown menu', 'Text area', 'Text input'].map((type) => (
                <button key={type} className="btn btn-secondary text-xs">
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
