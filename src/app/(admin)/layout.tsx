'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const mockUser = {
  firstname: 'Admin',
  lastname: 'User',
  email: 'admin@example.com',
  role: 'admin',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="page-wrapper">
      <Navbar user={mockUser} siteName="MoodleX" />
      <div className="drawers">
        <div className="main-inner">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
