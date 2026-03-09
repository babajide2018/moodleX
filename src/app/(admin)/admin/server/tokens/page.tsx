'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Plus, Trash2, Eye, EyeOff, Copy, Search } from 'lucide-react';

interface Token {
  id: number;
  user: string;
  service: string;
  token: string;
  validUntil: string;
  ipRestriction: string;
  lastAccess: string;
  creator: string;
}

const demoTokens: Token[] = [
  { id: 1, user: 'Admin User', service: 'Moodle mobile web service', token: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', validUntil: 'No expiry', ipRestriction: '', lastAccess: '2026-03-09 13:45', creator: 'Admin User' },
  { id: 2, user: 'API Service Account', service: 'Course completion API', token: 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3', validUntil: '2027-01-01 00:00', ipRestriction: '192.168.1.0/24', lastAccess: '2026-03-09 12:30', creator: 'Admin User' },
  { id: 3, user: 'Grade Exporter', service: 'Grade export service', token: 'b2a1c3d4e5f6b2a1c3d4e5f6b2a1c3d4', validUntil: '2026-06-30 23:59', ipRestriction: '10.0.0.5', lastAccess: '2026-03-08 22:15', creator: 'Admin User' },
  { id: 4, user: 'HR Integration', service: 'User sync service', token: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6', validUntil: '2026-12-31 23:59', ipRestriction: '172.16.0.0/16', lastAccess: '2026-03-09 06:00', creator: 'Admin User' },
  { id: 5, user: 'Calendar Bot', service: 'Calendar events API', token: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1', validUntil: 'No expiry', ipRestriction: '', lastAccess: '2026-03-09 14:00', creator: 'Admin User' },
  { id: 6, user: 'John Teacher', service: 'Moodle mobile web service', token: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', validUntil: 'No expiry', ipRestriction: '', lastAccess: '2026-03-07 09:20', creator: 'John Teacher' },
];

function maskToken(token: string): string {
  return token.substring(0, 4) + '****' + token.substring(token.length - 4);
}

export default function ManageTokensPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedTokens, setRevealedTokens] = useState<Set<number>>(new Set());

  const filtered = demoTokens.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return t.user.toLowerCase().includes(q) || t.service.toLowerCase().includes(q);
  });

  const toggleReveal = (id: number) => {
    setRevealedTokens(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Manage tokens"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Web services' },
        ]}
        actions={
          <button className="btn btn-primary text-sm flex items-center gap-1">
            <Plus size={16} /> Create token
          </button>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <input
                type="text"
                className="form-control text-sm"
                style={{ paddingLeft: '2rem' }}
                placeholder="Search by user or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
            <span className="text-sm text-[var(--text-muted)]">{filtered.length} tokens</span>
          </div>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">User</th>
                  <th className="py-2 px-3 text-left font-semibold">Service</th>
                  <th className="py-2 px-3 text-left font-semibold">Token</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Valid until</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">IP restriction</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Last access</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Creator</th>
                  <th className="py-2 px-3 text-center font-semibold w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(token => (
                  <tr key={token.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs flex-shrink-0">
                          {token.user[0]}
                        </div>
                        <span className="text-[var(--text-link)] font-medium text-xs">{token.user}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs">{token.service}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        <code className="text-xs bg-[var(--bg-light)] px-1.5 py-0.5 rounded font-mono">
                          {revealedTokens.has(token.id) ? token.token : maskToken(token.token)}
                        </code>
                        <button className="btn-icon" onClick={() => toggleReveal(token.id)} title={revealedTokens.has(token.id) ? 'Hide' : 'Reveal'}>
                          {revealedTokens.has(token.id) ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                        <button className="btn-icon" title="Copy token">
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs hidden md:table-cell">
                      {token.validUntil === 'No expiry' ? (
                        <span className="text-[var(--text-muted)]">No expiry</span>
                      ) : token.validUntil}
                    </td>
                    <td className="py-2 px-3 text-xs font-mono hidden lg:table-cell">
                      {token.ipRestriction || <span className="text-[var(--text-muted)]">None</span>}
                    </td>
                    <td className="py-2 px-3 text-xs hidden md:table-cell">{token.lastAccess}</td>
                    <td className="py-2 px-3 text-xs hidden lg:table-cell">{token.creator}</td>
                    <td className="py-2 px-3 text-center">
                      <button className="btn-icon text-red-500" title="Delete token">
                        <Trash2 size={14} />
                      </button>
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
