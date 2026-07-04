import { Link } from 'react-router-dom';

function ArrowIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

const ASSESSMENTS = [
  {
    tag: 'Section A',
    title: 'Your pain, in your words',
    desc: 'Draw where it hurts, describe it, and tell us what you\'ve tried.',
    meta: '15 questions · body map',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c-4.418 0-8 3.5-8 6s3.582 6 8 6 8-3.5 8-6-3.582-6-8-6zM9 10.5a3 3 0 106 0 3 3 0 00-6 0z" />
      </svg>
    ),
  },
  {
    tag: 'ODI',
    title: 'Oswestry Disability Index',
    desc: 'How back or leg pain affects your everyday activities.',
    meta: '10 questions · ~5 min',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    tag: 'PHQ-9 · GAD-7',
    title: 'How you\'ve been feeling',
    desc: 'Short, validated screens for mood and anxiety.',
    meta: '16 questions · ~5 min',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#CCFBF1]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0891B2] flex items-center justify-center shadow-[0_2px_8px_rgba(8,145,178,0.35)]">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-[#134E4A] text-sm">Pain Doc Rotorua</span>
          </div>
          <Link
            to="/admin/login"
            className="text-sm text-[#64748B] hover:text-[#134E4A] transition-colors duration-200 font-medium"
          >
            Staff Login
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0891B2] py-14 sm:py-16 px-6">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-[#16A34A]/20 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/85 text-xs font-semibold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 flex-shrink-0" />
            Patient Assessment Portal
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-[1.1] tracking-tight">
            Tell us about your pain<br className="hidden sm:block" /> before you arrive
          </h1>

          <p className="text-base sm:text-lg text-white/70 mb-7 max-w-xl mx-auto leading-relaxed">
            A few short questionnaires so your time with your physician is more focused and effective.
            Short notes are perfect — there's no need to write a lot.
          </p>

          <Link
            to="/questionnaire"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-[#0891B2] rounded-xl font-bold text-base hover:bg-cyan-50 active:scale-[0.98] transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
          >
            Start Questionnaire
            <ArrowIcon />
          </Link>

          <p className="mt-4 text-white/45 text-sm">Takes approximately 10–15 minutes · Private and secure</p>
        </div>
      </section>

      {/* ── Assessments ── */}
      <section className="py-12 sm:py-14 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-[#0891B2] uppercase tracking-widest mb-2">What you'll complete</p>
            <p className="text-[#64748B] text-sm max-w-lg mx-auto">
              Internationally recognised tools used by pain specialists worldwide.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {ASSESSMENTS.map(item => (
              <div
                key={item.tag}
                className="p-5 rounded-2xl bg-white border border-[#CCFBF1] shadow-[0_2px_10px_rgba(8,145,178,0.06)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.14)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#ECFEFF] text-[#0891B2] flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#0E7490] bg-[#ECFEFF] px-2 py-1 rounded-md tracking-wide uppercase">{item.tag}</span>
                </div>
                <h3 className="font-bold text-[#134E4A] text-sm mb-1.5">{item.title}</h3>
                <p className="text-[#64748B] text-xs leading-relaxed mb-2.5">{item.desc}</p>
                <p className="text-[11px] font-mono text-[#94A3B8]">{item.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA + Footer ── */}
      <section className="py-12 sm:py-14 px-6 bg-[#134E4A]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to begin?</h2>
          <p className="text-white/60 text-sm mb-7 leading-relaxed">
            Your responses are stored securely and reviewed only by your clinical team.
          </p>
          <Link
            to="/questionnaire"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-[#134E4A] rounded-xl font-bold text-base hover:bg-cyan-50 active:scale-[0.98] transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
          >
            Start Questionnaire
            <ArrowIcon />
          </Link>

          <div className="mt-9 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-white/40 text-xs">© Dr. Ian Wallbridge — Pain Doc Rotorua</p>
            <p className="text-white/30 text-xs text-center sm:text-right max-w-sm">
              These tools do not substitute for the informed opinion of a licensed physician.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
