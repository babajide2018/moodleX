import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to dashboard (like Moodle when logged in)
  // Will check auth state and redirect to login if not authenticated
  redirect('/home');
}
