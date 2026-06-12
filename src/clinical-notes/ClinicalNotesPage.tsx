import NotesApp from './components/NotesApp';

export default function ClinicalNotesPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg, #f5f4f0)' }}>
      {/* Standalone header for Clinical Notes — separate from questionnaire admin */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#0F6E56] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold leading-none" style={{ fontFamily: 'Georgia, serif', color: '#1a1a18' }}>
              Pain Doc Rotorua
            </p>
            <p className="text-[10px] font-mono tracking-widest uppercase mt-0.5" style={{ color: '#a09f9a' }}>
              Clinical Notes
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6">
        <NotesApp />
      </div>
    </div>
  );
}
