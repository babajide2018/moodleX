'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [searchBy, setSearchBy] = useState<'username' | 'email'>('username');
  const [searchValue, setSearchValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex flex-col">
      <nav className="bg-white border-b border-[var(--border-color)] h-[50px] flex items-center px-4">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <BookOpen size={24} className="text-[var(--moodle-primary)]" />
          <span className="font-bold text-lg text-[var(--text-primary)]">Moodle</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-[var(--border-color)] shadow-sm p-6">
            <h2 className="text-xl font-bold mb-2">Forgotten your username or password?</h2>

            {submitted ? (
              <div>
                <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800 mb-4">
                  If the details you supplied are correct, an email should have been sent to your address.
                  It contains easy instructions to confirm and complete this change.
                </div>
                <Link href="/login" className="btn btn-primary">
                  Continue
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  To reset your password, submit your username or your email address below.
                  If we can find you in the database, an email will be sent to your email address,
                  with instructions how to get access again.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div className="flex gap-4 mb-3">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="searchby"
                          checked={searchBy === 'username'}
                          onChange={() => setSearchBy('username')}
                          className="w-4 h-4"
                        />
                        Search by username
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="searchby"
                          checked={searchBy === 'email'}
                          onChange={() => setSearchBy('email')}
                          className="w-4 h-4"
                        />
                        Search by email address
                      </label>
                    </div>

                    <input
                      type={searchBy === 'email' ? 'email' : 'text'}
                      className="form-control"
                      placeholder={searchBy === 'email' ? 'Email address' : 'Username'}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Search
                  </button>
                </form>
              </>
            )}
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
