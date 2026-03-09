'use client';

import { useSession } from 'next-auth/react';
import Navbar from '@/components/layout/Navbar';
import LeftDrawer from '@/components/layout/LeftDrawer';
import RightDrawer from '@/components/layout/RightDrawer';
import DrawerToggles from '@/components/layout/DrawerToggles';
import Footer from '@/components/layout/Footer';
import { useDrawerStore } from '@/store/drawer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { leftOpen, rightOpen } = useDrawerStore();
  const { data: session } = useSession();

  const user = session?.user
    ? {
        firstname: session.user.firstname || session.user.name?.split(' ')[0] || 'User',
        lastname: session.user.lastname || session.user.name?.split(' ').slice(1).join(' ') || '',
        email: session.user.email || '',
        role: session.user.role || 'student',
      }
    : { firstname: 'User', lastname: '', email: '', role: 'student' };

  return (
    <div id="page-wrapper">
      {/* Fixed top navbar */}
      <Navbar user={user} siteName="MoodleX" />

      {/* Left drawer - Course index */}
      <LeftDrawer />

      {/* Right drawer - Blocks */}
      <RightDrawer />

      {/* Main content area - adjusts for open drawers */}
      <div
        className={`drawers ${leftOpen ? 'drawer-open-left' : ''} ${
          rightOpen ? 'drawer-open-right' : ''
        }`}
      >
        <div className="main-inner">
          {/* Drawer toggle buttons */}
          <DrawerToggles />

          {/* Page content */}
          {children}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
