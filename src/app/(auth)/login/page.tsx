'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid login, please try again');
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex flex-col">
      {/* Minimal navbar for login page - matches Moodle login layout */}
      <nav className="bg-white border-b border-[var(--border-color)] h-[50px] flex items-center px-4">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <BookOpen size={24} className="text-[var(--moodle-primary)]" />
          <span className="font-bold text-lg text-[var(--text-primary)]">MoodleX</span>
        </Link>
      </nav>

      {/* Login form - centered like Moodle */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login card */}
          <div className="bg-white rounded-lg border border-[var(--border-color)] shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold text-center mb-6 text-[var(--text-primary)]">
                Log in
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-[var(--moodle-danger)]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-4">
                  <label htmlFor="username" className="form-label text-sm">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    autoFocus
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label text-sm">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control pr-10"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 btn-icon"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="mb-4 flex items-center gap-2">
                  <input
                    id="rememberme"
                    type="checkbox"
                    className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--moodle-primary)] focus:ring-[var(--moodle-primary)]"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberme" className="text-sm text-[var(--text-primary)]">
                    Remember username
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full py-2"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              {/* Forgot password */}
              <div className="mt-4 text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[var(--text-link)]"
                >
                  Forgotten your username or password?
                </Link>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--border-color)]" />

            {/* Alternative login / signup */}
            <div className="p-6 bg-[var(--bg-light)] rounded-b-lg">
              <div className="text-center">
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  Is this your first time here?
                </p>
                <Link
                  href="/signup"
                  className="btn btn-secondary w-full py-2 inline-flex items-center justify-center"
                >
                  Create new account
                </Link>
              </div>
            </div>
          </div>

          {/* Cookie notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-[var(--text-muted)]">
              Cookies must be enabled in your browser{' '}
              <button className="text-[var(--text-link)] text-xs bg-transparent border-none cursor-pointer">
                Help with Cookies must be enabled in your browser
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-moodle">
        <div className="footer-popover-container">
          <div className="footer-links">
            <Link href="/help">MoodleX Docs for this page</Link>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            You are not logged in.
          </p>
        </div>
      </footer>
    </div>
  );
}
