import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminLoginPage() {
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [busy,     setBusy]     = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) {
      setError(err.message || 'Sign-in failed. Check your details and try again.');
    } else {
      navigate('/admin', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-[#F0FDFA] font-sans flex flex-col">
      <div className="bg-white border-b border-gray-200" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0891B2] flex items-center justify-center shadow-[0_2px_10px_rgba(8,145,178,0.06)]">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-900">Pain Doc Rotorua</p>
          </div>
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">← Patient portal</Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0891B2] flex items-center justify-center mx-auto mb-5 shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#134E4A] mb-1">Clinician sign in</h1>
            <p className="text-[#64748B] text-sm">Access patient submissions and the admin portal.</p>
          </div>

          <form onSubmit={signIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#CCFBF1] bg-white text-[#134E4A] text-sm focus:outline-none focus:border-[#0891B2] focus:ring-4 focus:ring-[#ECFEFF] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#CCFBF1] bg-white text-[#134E4A] text-sm focus:outline-none focus:border-[#0891B2] focus:ring-4 focus:ring-[#ECFEFF] transition"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-4 bg-[#0891B2] text-white rounded-xl font-bold text-sm hover:bg-[#0E7490] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(8,145,178,0.06)] mt-2"
            >
              {busy && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
