import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { SOAPNote as SOAPNoteType } from '../../lib/types';

const SECTIONS: Array<{ key: keyof SOAPNoteType; label: string; short: string }> = [
  { key: 'subjective', label: 'Subjective',  short: 'S' },
  { key: 'objective',  label: 'Objective',   short: 'O' },
  { key: 'assessment', label: 'Assessment',  short: 'A' },
  { key: 'plan',       label: 'Plan',        short: 'P' },
];

export default function SOAPNote({ soap, patientName, dob, visitDate }: { soap: SOAPNoteType; patientName: string; dob: string; visitDate: string }) {
  const [edits, setEdits] = useState(soap);
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    const text = SECTIONS.map(s => `${s.short} — ${s.label}\n${edits[s.key] || '—'}`).join('\n\n');
    const header = `SOAP NOTE${patientName ? ' — ' + patientName : ''}${dob ? ' · DOB: ' + dob : ''}${visitDate ? ' · ' + visitDate : ''}\n\n`;
    navigator.clipboard.writeText(header + text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const label = patientName || 'Consultation';
  const meta  = [dob ? `DOB: ${dob}` : null, visitDate].filter(Boolean).join(' · ');

  return (
    <div className="w-full max-w-2xl mb-4 bg-white rounded-2xl border border-[#E2E8E6] shadow-sm overflow-hidden" style={{ animation: 'fadeIn 0.25s ease' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>

      {/* Card header */}
      <div className="px-5 py-4 border-b border-[#E6F3EE] bg-[#E6F3EE] flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#085041] uppercase tracking-widest">SOAP Note — {label}</p>
          {meta && <p className="text-[11px] text-[#6B9E8A] mt-0.5">{meta}</p>}
        </div>
        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#B0D8CC] text-[#085041] text-xs font-semibold hover:bg-[#D4EDE5] transition"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy all'}
        </button>
      </div>

      {/* Sections */}
      {SECTIONS.map((sec, i) => (
        <div key={sec.key} className={i < SECTIONS.length - 1 ? 'border-b border-[#F0F5F3]' : ''}>
          <div className="px-5 pt-4 pb-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-[#0B5E47] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{sec.short}</span>
              <span className="text-[10px] font-bold text-[#0B5E47] uppercase tracking-widest">{sec.label}</span>
            </span>
          </div>
          <textarea
            value={edits[sec.key] || ''}
            onChange={e => setEdits(prev => ({ ...prev, [sec.key]: e.target.value }))}
            rows={4}
            className="w-full px-5 pb-4 pt-2 text-sm text-[#1A2623] leading-relaxed bg-transparent resize-y focus:outline-none focus:bg-[#F9F8F5] rounded-none transition-colors placeholder:text-[#C5D4D0]"
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>
      ))}
    </div>
  );
}
