'use client';

import { Users } from 'lucide-react';

interface OnlineUser {
  id: string;
  firstName: string;
  lastName: string;
  lastActive: string;
}

const mockUsers: OnlineUser[] = [
  { id: '1', firstName: 'Alice', lastName: 'Johnson', lastActive: '1 min ago' },
  { id: '2', firstName: 'Bob', lastName: 'Smith', lastActive: '2 min ago' },
  { id: '3', firstName: 'Carol', lastName: 'Williams', lastActive: '3 min ago' },
  { id: '4', firstName: 'David', lastName: 'Brown', lastActive: '4 min ago' },
];

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

const avatarColors = ['#4e6e9c', '#57a89a', '#7b62a8', '#ce5f5f', '#e8a54b', '#63a563'];

function getAvatarColor(id: string): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
}

export default function OnlineUsers() {
  return (
    <div className="border border-[var(--border-color)] rounded mb-4">
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)]">
        <h6 className="text-sm font-semibold m-0">Online users</h6>
      </div>
      <div className="p-3">
        <p className="text-xs text-[var(--text-muted)] mb-3 flex items-center gap-1">
          <Users size={12} />
          {mockUsers.length} online users (last 5 minutes)
        </p>

        <div className="space-y-2">
          {mockUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              {/* Avatar with initials */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                  style={{ backgroundColor: getAvatarColor(user.id) }}
                >
                  {getInitials(user.firstName, user.lastName)}
                </div>
                {/* Green online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--text-secondary)] m-0 truncate">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                {user.lastActive}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
