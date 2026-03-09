'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Globe,
  FolderOpen,
} from 'lucide-react';
import { useDrawerStore } from '@/store/drawer';

interface NavbarProps {
  user?: {
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    avatar?: string;
  };
  siteName?: string;
}

const primaryNavItems = [
  { key: 'home', label: 'Home', href: '/home' },
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'mycourses', label: 'My courses', href: '/my/courses' },
  { key: 'siteadmin', label: 'Site administration', href: '/admin', adminOnly: true },
];

export default function Navbar({ user, siteName = 'MoodleX' }: NavbarProps) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { toggleLeft, toggleMobileMenu } = useDrawerStore();

  // Close user menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitials = user
    ? `${user.firstname[0]}${user.lastname[0]}`.toUpperCase()
    : 'G';

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="navbar-moodle">
      {/* Left section: Logo */}
      <div className="flex items-center">
        <Link href="/" className="navbar-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/moodleX.png"
            alt={siteName}
            className="h-12 w-auto"
          />
        </Link>
      </div>

      {/* Center section: Primary navigation */}
      <ul className="navbar-nav primary-nav flex-1 hidden md:flex">
        {primaryNavItems.map((item) => {
          if ('adminOnly' in item && item.adminOnly && !isAdmin) return null;

          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <li key={item.key}>
              <Link
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right section: Edit mode, Search, Notifications, Messages, User */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Edit mode toggle */}
        <EditModeToggle />

        <div className="w-px h-6 bg-[var(--border-color)] mx-1 hidden sm:block" />

        {/* Search toggle */}
        <button
          className="btn-icon"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Toggle search input"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <Link href="/notifications" className="btn-icon relative">
          <Bell size={18} />
          <span className="badge-moodle absolute -top-0.5 -right-0.5">3</span>
        </Link>

        {/* Messages */}
        <Link href="/message" className="btn-icon relative">
          <MessageSquare size={18} />
        </Link>

        {/* User menu */}
        <div className="user-menu" ref={userMenuRef}>
          <button
            className="user-menu-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="user-avatar">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                userInitials
              )}
            </div>
            <ChevronDown size={14} className="text-[var(--text-secondary)] hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="dropdown-menu">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-[var(--border-color)]">
                    <div className="font-semibold text-sm">
                      {user.firstname} {user.lastname}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {user.email}
                    </div>
                  </div>
                  <Link href="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <Link href="/user/edit" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <User size={16} />
                    Profile
                  </Link>
                  <Link href="/grades" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <GraduationCap size={16} />
                    Grades
                  </Link>
                  <Link href="/calendar" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <Calendar size={16} />
                    Calendar
                  </Link>
                  <Link href="/user/files" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FolderOpen size={16} />
                    Private files
                  </Link>
                  <div className="dropdown-divider" />
                  <Link href="/user/preferences" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <Settings size={16} />
                    Preferences
                  </Link>
                  <Link href="/user/preferences" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <Globe size={16} />
                    Language
                  </Link>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item text-[var(--moodle-danger)]"
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut({ callbackUrl: '/login' });
                    }}
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="dropdown-item">
                    <LogOut size={16} />
                    Log in
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed top-[var(--navbar-height)] left-0 right-0 bg-white border-b border-[var(--border-color)] p-3 z-[1035] shadow-md">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              className="form-control flex-1"
              placeholder="Search courses, activities, users..."
              autoFocus
            />
            <button className="btn btn-primary">
              <Search size={16} />
              Search
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setSearchOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function EditModeToggle() {
  const { editMode, toggleEditMode } = useDrawerStore();

  return (
    <div className="flex items-center gap-2 px-2 hidden sm:flex">
      <span className="text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap">
        Edit mode
      </span>
      <button
        role="switch"
        aria-checked={editMode}
        onClick={toggleEditMode}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors border-none cursor-pointer flex-shrink-0 ${
          editMode ? 'bg-[var(--moodle-primary)]' : 'bg-[var(--moodle-secondary)]'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
            editMode ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
