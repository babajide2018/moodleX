'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Plus, Edit2, Trash2, Users, Key, Settings } from 'lucide-react';

interface ExternalService {
  id: number;
  name: string;
  enabled: boolean;
  authorizedUsers: number;
  requiredCapability: string;
  functionsCount: number;
  shortName: string;
  builtIn: boolean;
}

const demoServices: ExternalService[] = [
  { id: 1, name: 'Moodle mobile web service', shortName: 'moodle_mobile_app', enabled: true, authorizedUsers: 245, requiredCapability: 'moodle/webservice:createtoken', functionsCount: 87, builtIn: true },
  { id: 2, name: 'Course completion API', shortName: 'course_completion_api', enabled: true, authorizedUsers: 3, requiredCapability: 'moodle/course:update', functionsCount: 12, builtIn: false },
  { id: 3, name: 'Grade export service', shortName: 'grade_export', enabled: false, authorizedUsers: 1, requiredCapability: 'moodle/grade:export', functionsCount: 5, builtIn: false },
  { id: 4, name: 'User sync service', shortName: 'user_sync', enabled: true, authorizedUsers: 2, requiredCapability: 'moodle/user:create', functionsCount: 8, builtIn: false },
  { id: 5, name: 'Calendar events API', shortName: 'calendar_events', enabled: true, authorizedUsers: 15, requiredCapability: 'moodle/calendar:manageentries', functionsCount: 6, builtIn: false },
];

export default function ExternalServicesPage() {
  const [services, setServices] = useState(demoServices);

  const toggleService = (id: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <>
      <PageHeader
        title="External services"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Web services' },
        ]}
        actions={
          <button className="btn btn-primary text-sm flex items-center gap-1">
            <Plus size={16} /> Add service
          </button>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            External services are groups of web service functions. Users authorised on a service can call any of its functions.
          </p>

          {/* Built-in services */}
          <h3 className="text-sm font-semibold mb-2">Built-in services</h3>
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Service name</th>
                  <th className="py-2 px-3 text-center font-semibold">Enabled</th>
                  <th className="py-2 px-3 text-center font-semibold hidden md:table-cell">Authorised users</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Required capability</th>
                  <th className="py-2 px-3 text-center font-semibold">Functions</th>
                  <th className="py-2 px-3 text-center font-semibold w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.filter(s => s.builtIn).map(service => (
                  <tr key={service.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3">
                      <div className="font-medium text-[var(--text-link)]">{service.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{service.shortName}</div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => toggleService(service.id)}
                        className={`inline-flex items-center text-xs px-2 py-0.5 rounded cursor-pointer ${service.enabled ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                      >
                        {service.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-2 px-3 text-center hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Users size={12} /> {service.authorizedUsers}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden lg:table-cell font-mono">{service.requiredCapability}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-xs font-medium">{service.functionsCount}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="btn-icon" title="Edit"><Edit2 size={14} /></button>
                        <button className="btn-icon" title="Manage functions"><Settings size={14} /></button>
                        <button className="btn-icon" title="Authorised users"><Users size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Custom services */}
          <h3 className="text-sm font-semibold mb-2">Custom services</h3>
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Service name</th>
                  <th className="py-2 px-3 text-center font-semibold">Enabled</th>
                  <th className="py-2 px-3 text-center font-semibold hidden md:table-cell">Authorised users</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Required capability</th>
                  <th className="py-2 px-3 text-center font-semibold">Functions</th>
                  <th className="py-2 px-3 text-center font-semibold w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.filter(s => !s.builtIn).map(service => (
                  <tr key={service.id} className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${!service.enabled ? 'opacity-60' : ''}`}>
                    <td className="py-2 px-3">
                      <div className="font-medium text-[var(--text-link)]">{service.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{service.shortName}</div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => toggleService(service.id)}
                        className={`inline-flex items-center text-xs px-2 py-0.5 rounded cursor-pointer ${service.enabled ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                      >
                        {service.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-2 px-3 text-center hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Users size={12} /> {service.authorizedUsers}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden lg:table-cell font-mono">{service.requiredCapability}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-xs font-medium">{service.functionsCount}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="btn-icon" title="Edit"><Edit2 size={14} /></button>
                        <button className="btn-icon" title="Manage functions"><Settings size={14} /></button>
                        <button className="btn-icon" title="Authorised users"><Users size={14} /></button>
                        <button className="btn-icon text-red-500" title="Delete"><Trash2 size={14} /></button>
                      </div>
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
