import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminHeader() {
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0891B2] flex items-center justify-center shadow-[0_2px_10px_rgba(8,145,178,0.06)]">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">Pain Doc Rotorua</p>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">Admin Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/notes"
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#0891B2] font-semibold hover:text-[#0E7490] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Clinical Notes
          </Link>
          <span className="hidden sm:block w-px h-4 bg-gray-200" />
          <button
            onClick={signOut}
            className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
