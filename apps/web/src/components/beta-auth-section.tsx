'use client';

import { useState } from 'react';
import AuthForm from './auth-form';
import AdminPanel from './admin-panel';
import { getToken } from '../lib/api';

export default function BetaAuthSection() {
  // If a token already exists in localStorage (from a previous session),
  // start in admin mode; otherwise show the login/register form.
  const [authed, setAuthed] = useState<{ email: string; roles: string[] } | null>(() => {
    const token = getToken();
    return token ? { email: 'session', roles: ['user'] } : null;
  });

  if (!authed) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Admin Access</h2>
        <p className="text-sm text-slate-400 mb-3">
          Login dengan akun admin (email terdaftar di <code>ADMIN_EMAILS</code>) untuk mengelola
          waitlist — daftar, invite, dan activate.
        </p>
        <AuthForm onAuthed={(email, roles) => setAuthed({ email, roles })} />
      </section>
    );
  }

  return <AdminPanel onLogout={() => setAuthed(null)} />;
}
