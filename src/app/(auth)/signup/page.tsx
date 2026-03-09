'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    emailConfirm: '',
    firstname: '',
    lastname: '',
    city: '',
    country: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Registration logic
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex flex-col">
      <nav className="bg-white border-b border-[var(--border-color)] h-[50px] flex items-center px-4">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <BookOpen size={24} className="text-[var(--moodle-primary)]" />
          <span className="font-bold text-lg text-[var(--text-primary)]">Moodle</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-start justify-center p-4 pt-8">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-lg border border-[var(--border-color)] shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
              New Account
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Required fields notice */}
              <p className="text-xs text-[var(--text-muted)] mb-4">
                Fields marked with <span className="text-[var(--moodle-danger)]">*</span> are required.
              </p>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
                  Choose your username and password
                </h3>

                <div>
                  <label className="form-label text-sm">
                    Username <span className="text-[var(--moodle-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.username}
                    onChange={(e) => updateField('username', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label text-sm">
                    Password <span className="text-[var(--moodle-danger)]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control pr-10"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 btn-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    The password must have at least 8 characters, at least 1 digit(s), at least 1 lower case letter(s),
                    at least 1 upper case letter(s), at least 1 non-alphanumeric character(s) such as *, -, or #
                  </p>
                </div>

                <h3 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 pt-2">
                  More details
                </h3>

                <div>
                  <label className="form-label text-sm">
                    Email address <span className="text-[var(--moodle-danger)]">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label text-sm">
                    Email (again) <span className="text-[var(--moodle-danger)]">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.emailConfirm}
                    onChange={(e) => updateField('emailConfirm', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-sm">
                      First name <span className="text-[var(--moodle-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.firstname}
                      onChange={(e) => updateField('firstname', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label text-sm">
                      Surname <span className="text-[var(--moodle-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.lastname}
                      onChange={(e) => updateField('lastname', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-sm">City/town</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label text-sm">
                    Select a country <span className="text-[var(--moodle-danger)]">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    required
                  >
                    <option value="">Select a country...</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="NG">Nigeria</option>
                    <option value="IN">India</option>
                    <option value="BR">Brazil</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary py-2 px-6"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create my new account'}
                </button>
                <Link href="/login" className="btn btn-secondary py-2 px-6">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="footer-moodle">
        <div className="footer-popover-container">
          <p className="text-xs text-[var(--text-muted)]">You are not logged in.</p>
        </div>
      </footer>
    </div>
  );
}
