'use client';

import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { CheckCircle, Circle, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SetupStep {
  number: number;
  title: string;
  description: string;
  status: 'complete' | 'incomplete' | 'in-progress';
  link?: string;
  linkLabel?: string;
}

const setupSteps: SetupStep[] = [
  {
    number: 1,
    title: 'Enable web services',
    description: 'Web services must be enabled in the advanced features settings before they can be used.',
    status: 'complete',
    link: '/admin/server/webservices',
    linkLabel: 'Advanced features',
  },
  {
    number: 2,
    title: 'Enable protocols',
    description: 'Enable the web service protocols that clients will use to communicate with Moodle (REST, SOAP, XML-RPC).',
    status: 'complete',
    link: '/admin/server/protocols',
    linkLabel: 'Manage protocols',
  },
  {
    number: 3,
    title: 'Create a specific user',
    description: 'Create a specific user for the web service. This user will be used to authenticate API requests.',
    status: 'complete',
    link: '/admin/users/add',
    linkLabel: 'Add a new user',
  },
  {
    number: 4,
    title: 'Check user capability',
    description: 'Check the user has the capability to use the web service protocol(s). Assign the appropriate role if needed.',
    status: 'complete',
    link: '/admin/users/checkpermissions',
    linkLabel: 'Check permissions',
  },
  {
    number: 5,
    title: 'Select a service',
    description: 'Select or create an external service. A service is a set of web service functions grouped together.',
    status: 'incomplete',
    link: '/admin/server/externalservices',
    linkLabel: 'External services',
  },
  {
    number: 6,
    title: 'Add functions',
    description: 'Add the required functions to the service. Each function provides specific API capabilities.',
    status: 'incomplete',
    link: '/admin/server/externalservices',
    linkLabel: 'External services',
  },
  {
    number: 7,
    title: 'Select a specific user',
    description: 'Authorise a specific user to use the service. Only authorised users can call the service functions.',
    status: 'incomplete',
    link: '/admin/server/externalservices',
    linkLabel: 'External services',
  },
  {
    number: 8,
    title: 'Create a token for a user',
    description: 'Create a security token for the user. The token is used to authenticate API requests.',
    status: 'incomplete',
    link: '/admin/server/tokens',
    linkLabel: 'Manage tokens',
  },
];

export default function WebServicesOverviewPage() {
  return (
    <>
      <PageHeader
        title="Web services overview"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Web services' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="mb-6">
            <p className="text-sm text-[var(--text-muted)]">
              Follow the steps below to set up web services. Each step must be completed in order. Steps with a green checkmark are already complete.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link href="/admin/server/protocols" className="btn btn-secondary text-sm flex items-center gap-1">
              Manage protocols <ExternalLink size={12} />
            </Link>
            <Link href="/admin/server/externalservices" className="btn btn-secondary text-sm flex items-center gap-1">
              External services <ExternalLink size={12} />
            </Link>
            <Link href="/admin/server/tokens" className="btn btn-secondary text-sm flex items-center gap-1">
              Manage tokens <ExternalLink size={12} />
            </Link>
          </div>

          {/* Setup wizard checklist */}
          <div className="border border-[var(--border-color)] rounded-lg bg-white overflow-hidden">
            <div className="p-4 bg-[var(--bg-light)] border-b border-[var(--border-color)]">
              <h3 className="text-sm font-semibold">Setup wizard</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {setupSteps.filter(s => s.status === 'complete').length} of {setupSteps.length} steps completed
              </p>
              {/* Progress bar */}
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(setupSteps.filter(s => s.status === 'complete').length / setupSteps.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="divide-y divide-[var(--border-color)]">
              {setupSteps.map(step => (
                <div key={step.number} className="flex items-start gap-4 p-4 hover:bg-[var(--bg-hover)] transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {step.status === 'complete' ? (
                      <CheckCircle size={24} className="text-green-500" />
                    ) : (
                      <Circle size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[var(--text-muted)]">Step {step.number}</span>
                      {step.status === 'complete' && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-700">Done</span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold mt-0.5">{step.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{step.description}</p>
                    {step.link && (
                      <Link href={step.link} className="inline-flex items-center gap-1 text-xs text-[var(--text-link)] hover:underline mt-2">
                        {step.linkLabel} <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
