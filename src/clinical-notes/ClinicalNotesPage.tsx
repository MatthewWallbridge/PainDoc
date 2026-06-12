import NotesApp from './components/NotesApp';

export default function ClinicalNotesPage() {
  return (
    <div className="min-h-screen bg-[#F4F3EF] font-sans">
      <header className="bg-white border-b border-[#E2E8E6] sticky top-0 z-10 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0B5E47] flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1A2623] leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                Clinical Notes
              </p>
              <p className="text-[10px] text-[#9BADA9] font-semibold uppercase tracking-widest mt-0.5">
                Pain Doc Rotorua
              </p>
            </div>
          </div>
          <span className="text-[11px] text-[#9BADA9] font-mono bg-[#F4F3EF] px-3 py-1.5 rounded-full border border-[#E2E8E6]">
            {new Date().toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6">
        <NotesApp />
      </div>
    </div>
  );
}
