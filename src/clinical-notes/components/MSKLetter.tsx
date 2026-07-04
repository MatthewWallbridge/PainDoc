import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import type { MSKLetter as MSKLetterType } from '../../lib/types';

export const SECTIONS: Array<{ key: keyof MSKLetterType; label: string }> = [
  { key: 'diagnosis',      label: 'Diagnosis (MSK problem)' },
  { key: 'analysis',       label: 'Analysis (MSK problem in context)' },
  { key: 'history',        label: 'History' },
  { key: 'investigations', label: 'Investigations' },
  { key: 'examination',    label: 'Examination' },
  { key: 'treatment',      label: 'Treatment' },
  { key: 'exercise',       label: 'Exercise' },
  { key: 'plan',           label: 'Plan' },
];

export default function MSKLetter({ letter, patientName, dob, visitDate, title = 'MSK Letter' }: { letter: MSKLetterType; patientName: string; dob: string; visitDate: string; title?: string }) {
  const [edits, setEdits] = useState(letter);
  const [copied, setCopied] = useState(false);

  const fullText = () => {
    const recipients = edits.recipients ? `${edits.recipients}\n\n` : '';
    const text = SECTIONS.map((s, i) => `${i + 1}. ${s.label}\n${edits[s.key] || '—'}`).join('\n\n');
    const header = `${title.toUpperCase()}${patientName ? ' — ' + patientName : ''}${dob ? ' · DOB: ' + dob : ''}${visitDate ? ' · ' + visitDate : ''}\n\n`;
    return header + recipients + text;
  };

  const copyAll = () => {
    navigator.clipboard.writeText(fullText()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const downloadTxt = () => {
    const slug = (patientName || 'patient').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'patient';
    const blob = new Blob([fullText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}${visitDate ? '-' + visitDate : ''}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const label = patientName || 'Consultation';
  const meta  = [dob ? `DOB: ${dob}` : null, visitDate].filter(Boolean).join(' · ');

  return (
    <div className="w-full max-w-2xl mb-4 bg-white rounded-2xl border border-[#CCFBF1] shadow-[0_2px_10px_rgba(8,145,178,0.06)] overflow-hidden" style={{ animation: 'fadeIn 0.25s ease' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>

      {/* Card header */}
      <div className="px-5 py-4 border-b border-[#ECFEFF] bg-[#ECFEFF] flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#0E7490] uppercase tracking-widest">{title} — {label}</p>
          {meta && <p className="text-[11px] text-[#0E7490] mt-0.5">{meta}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadTxt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#A5F3FC] text-[#0E7490] text-xs font-semibold hover:bg-[#CFFAFE] transition"
          >
            <Download size={12} />
            Download
          </button>
          <button
            onClick={copyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#A5F3FC] text-[#0E7490] text-xs font-semibold hover:bg-[#CFFAFE] transition"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy all'}
          </button>
        </div>
      </div>

      {/* Recipients */}
      <div className="border-b border-[#E8F1F6]">
        <div className="px-5 pt-4 pb-1">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Recipients</span>
        </div>
        <textarea
          value={edits.recipients || ''}
          onChange={e => setEdits(prev => ({ ...prev, recipients: e.target.value }))}
          rows={3}
          placeholder="Dr [Name] (GP — address completed by reception)&#10;CC: physiotherapist&#10;CC: patient"
          className="w-full px-5 pb-4 pt-2 text-sm text-[#134E4A] leading-relaxed bg-transparent resize-y focus:outline-none focus:bg-[#F8FAFC] rounded-none transition-colors placeholder:text-[#CBD5E1]"
          style={{ fontFamily: 'Georgia, serif' }}
        />
      </div>

      {/* Sections */}
      {SECTIONS.map((sec, i) => (
        <div key={sec.key} className={i < SECTIONS.length - 1 ? 'border-b border-[#E8F1F6]' : ''}>
          <div className="px-5 pt-4 pb-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-[#0891B2] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="text-[10px] font-bold text-[#0891B2] uppercase tracking-widest">{sec.label}</span>
            </span>
          </div>
          <textarea
            value={edits[sec.key] || ''}
            onChange={e => setEdits(prev => ({ ...prev, [sec.key]: e.target.value }))}
            rows={sec.key === 'history' ? 8 : 4}
            className="w-full px-5 pb-4 pt-2 text-sm text-[#134E4A] leading-relaxed bg-transparent resize-y focus:outline-none focus:bg-[#F8FAFC] rounded-none transition-colors placeholder:text-[#CBD5E1]"
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>
      ))}
    </div>
  );
}
