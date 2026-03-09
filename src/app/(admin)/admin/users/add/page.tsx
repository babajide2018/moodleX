'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Eye, EyeOff, HelpCircle } from 'lucide-react';

export default function AddUserPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    role: 'student',
    city: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to create user
    alert('User creation not yet connected to API.');
  };

  return (
    <>
      <PageHeader
        title="Add a new user"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Accounts' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="border border-[var(--border-color)] rounded-lg p-6 space-y-5 bg-white">
              <h2 className="text-base font-semibold border-b border-[var(--border-color)] pb-3">General</h2>

              {/* Username */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label htmlFor="username" className="text-sm font-medium pt-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-control text-sm"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. jsmith"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label htmlFor="password" className="text-sm font-medium pt-2">
                  New password <span className="text-red-500">*</span>
                </label>
                <div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control text-sm"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                    <HelpCircle size={12} />
                    Password must have at least 8 characters, 1 digit, 1 upper, 1 lower, and 1 special character.
                  </p>
                </div>
              </div>

              <h2 className="text-base font-semibold border-b border-[var(--border-color)] pb-3 pt-2">Personal details</h2>

              {/* First name */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label htmlFor="firstname" className="text-sm font-medium pt-2">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  className="form-control text-sm"
                  required
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>

              {/* Surname */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label htmlFor="lastname" className="text-sm font-medium pt-2">
                  Surname <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  className="form-control text-sm"
                  required
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label htmlFor="email" className="text-sm font-medium pt-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control text-sm"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <h2 className="text-base font-semibold border-b border-[var(--border-color)] pb-3 pt-2">System role</h2>

              {/* Role */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label htmlFor="role" className="text-sm font-medium pt-2">
                  System role
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-control text-sm"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Non-editing teacher</option>
                  <option value="editingteacher">Teacher</option>
                  <option value="coursecreator">Course creator</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <h2 className="text-base font-semibold border-b border-[var(--border-color)] pb-3 pt-2">Location</h2>

              {/* City */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label htmlFor="city" className="text-sm font-medium pt-2">City/town</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="form-control text-sm"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              {/* Country */}
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label htmlFor="country" className="text-sm font-medium pt-2">Country</label>
                <select
                  id="country"
                  name="country"
                  className="form-control text-sm"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Select a country...</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="NG">Nigeria</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                  <option value="ZA">South Africa</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button type="submit" className="btn btn-primary text-sm">Create user</button>
              <button
                type="button"
                className="btn btn-secondary text-sm"
                onClick={() => router.push('/admin/users/browse')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
