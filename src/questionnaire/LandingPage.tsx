import { Link } from 'react-router-dom';

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[#0B5E47] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

const PROCESS_STEPS = [
  {
    num: '1',
    title: 'Enter your details',
    desc: 'Your name, date of birth, and today\'s date. This takes less than a minute.',
  },
  {
    num: '2',
    title: 'Back pain assessment',
    desc: 'Ten questions from the Oswestry Disability Index measuring how pain affects daily life.',
  },
  {
    num: '3',
    title: 'Wellbeing assessment',
    desc: 'Fourteen questions from the HADS questionnaire screening for anxiety and depression.',
  },
  {
    num: '4',
    title: 'All done',
    desc: 'Your responses are securely saved. Your physician will review them before your appointment.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B5E47] flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">Pain Doc Rotorua</span>
          </div>
          <Link
            to="/admin/login"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
          >
            Staff Login
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-[#0B5E47] py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/85 text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
            Patient Assessment Portal
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.08] tracking-tight">
            PainDoc Patient<br />Questionnaire
          </h1>

          <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Two validated clinical assessments that help your physician understand your pain and wellbeing before your appointment — so your time together is more focused and more effective.
          </p>

          <Link
            to="/questionnaire"
            className="inline-flex items-center gap-3 px-9 py-4 bg-white text-[#0B5E47] rounded-xl font-bold text-base hover:bg-gray-50 active:scale-[0.98] transition-all shadow-xl"
          >
            Start Questionnaire
            <ArrowIcon />
          </Link>

          <p className="mt-5 text-white/40 text-sm">Takes approximately 10–15 minutes to complete</p>
        </div>
      </section>

      {/* ── What you'll complete ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#0B5E47] uppercase tracking-widest mb-3">The assessments</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What you'll complete</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
              Both questionnaires are internationally recognised tools used by pain specialists and clinicians worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ODI Card */}
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-[#0B5E47]/25 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-[#E6F3EE] flex items-center justify-center mb-6 group-hover:bg-[#0B5E47] transition-colors duration-300">
                <svg className="w-6 h-6 text-[#0B5E47] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#E6F3EE] text-[#085041] text-xs font-bold tracking-wide uppercase mb-4">ODI</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Oswestry Disability Index</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                A ten-question assessment measuring how back or leg pain affects your ability to perform everyday activities — from personal care and lifting to sleeping and travelling.
              </p>
              <ul className="space-y-2.5">
                {['10 questions', 'Covers daily activities affected by pain', 'Takes approximately 5 minutes'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckIcon />{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* HADS Card */}
            <div className="p-8 rounded-2xl border-2 border-gray-100 hover:border-[#0B5E47]/25 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-[#E6F3EE] flex items-center justify-center mb-6 group-hover:bg-[#0B5E47] transition-colors duration-300">
                <svg className="w-6 h-6 text-[#0B5E47] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#E6F3EE] text-[#085041] text-xs font-bold tracking-wide uppercase mb-4">HADS</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hospital Anxiety and Depression Scale</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                A fourteen-question questionnaire screening for symptoms of anxiety and depression, helping your physician understand the emotional impact of chronic pain on your wellbeing.
              </p>
              <ul className="space-y-2.5">
                {['14 questions', 'Screens for anxiety and depression', 'Takes approximately 5–10 minutes'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckIcon />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="py-20 px-6 bg-[#F0F7F4]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#0B5E47] uppercase tracking-widest mb-3">Why complete this</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How this helps your care</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
              Completing these assessments before your appointment allows your physician to prepare a more personalised and effective consultation.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0B5E47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                title: 'Personalised care',
                desc: 'Your physician arrives at your appointment already informed about your pain levels, functional limitations, and emotional wellbeing.',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0B5E47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: 'Clinically validated',
                desc: 'Both the ODI and HADS are internationally recognised, evidence-based tools used in pain medicine practice worldwide.',
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0B5E47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Completely private',
                desc: 'Your responses are stored securely and are only accessible to your clinical team at Pain Doc Rotorua.',
              },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-7 shadow-sm border border-white">
                <div className="w-11 h-11 rounded-xl bg-[#E6F3EE] flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#0B5E47] uppercase tracking-widest mb-3">The process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">Simple, straightforward, and designed to be completed on any device.</p>
          </div>

          <div className="relative">
            <div className="hidden sm:block absolute top-7 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px bg-[#D1E8DF]" />
            <div className="grid sm:grid-cols-4 gap-8">
              {PROCESS_STEPS.map(step => (
                <div key={step.num} className="flex flex-col items-center text-center gap-4">
                  <div className="relative z-10 w-14 h-14 rounded-full bg-white border-2 border-[#0B5E47] flex items-center justify-center font-bold text-xl text-[#0B5E47] shadow-sm">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-[#0B5E47]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to begin?</h2>
          <p className="text-white/65 text-base mb-10 leading-relaxed">
            Complete your assessments now so your physician can prepare the most effective consultation possible.
          </p>
          <Link
            to="/questionnaire"
            className="inline-flex items-center gap-3 px-9 py-4 bg-white text-[#0B5E47] rounded-xl font-bold text-base hover:bg-gray-50 active:scale-[0.98] transition-all shadow-xl"
          >
            Start Questionnaire
            <ArrowIcon />
          </Link>
          <p className="mt-5 text-white/35 text-sm">No account needed · Takes 10–15 minutes · Private and secure</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">© Dr. Ian Wallbridge — Pain Doc Rotorua</p>
          <p className="text-gray-600 text-xs text-center sm:text-right max-w-sm">
            These tools do not substitute for the informed opinion of a licensed physician. All scores should be re-checked.
          </p>
        </div>
      </footer>
    </div>
  );
}
