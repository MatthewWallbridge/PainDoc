import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { SOAPNote as SOAPNoteType } from '../../lib/types';

const SECTIONS = [
  { key: 'subjective' as const, label: 'S — Subjective' },
  { key: 'objective'  as const, label: 'O — Objective'  },
  { key: 'assessment' as const, label: 'A — Assessment'  },
  { key: 'plan'       as const, label: 'P — Plan'        },
];

const s: Record<string, React.CSSProperties> = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', width: '100%', maxWidth: 720, marginBottom: '1rem', animation: 'fadeIn 0.25s ease' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--accent-light)' },
  titleBlock: { display: 'flex', flexDirection: 'column', gap: 2 },
  title: { fontSize: '0.7rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-text)', fontWeight: 'bold' },
  subtitle: { fontSize: '0.68rem', fontFamily: 'Courier New, monospace', color: 'var(--accent-text)', opacity: 0.7 },
  copyBtn: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.06em', color: 'var(--accent-text)', background: 'none', border: '1px solid var(--accent)', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', opacity: 0.85, flexShrink: 0 },
  section: { padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' },
  sectionLast: { padding: '1rem 1.25rem' },
  sectionLabel: { fontSize: '0.68rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1D9E75', fontWeight: 'bold', marginBottom: '0.5rem' },
  textarea: { width: '100%', background: 'transparent', border: '1px solid transparent', borderRadius: 4, padding: '0.4rem 0.5rem', fontFamily: 'Georgia, serif', fontSize: '0.92rem', lineHeight: 1.75, color: 'var(--text)', resize: 'vertical', outline: 'none', transition: 'border-color 0.15s, background 0.15s', minHeight: 60 },
};

export default function SOAPNote({ soap, patientName, dob, visitDate }: { soap: SOAPNoteType; patientName: string; dob: string; visitDate: string }) {
  const [edits, setEdits] = useState(soap);
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    const text = SECTIONS.map(s => `${s.label}\n${edits[s.key] || '—'}`).join('\n\n');
    const header = `SOAP NOTE${patientName ? ' — ' + patientName : ''}${dob ? ' · DOB: ' + dob : ''}${visitDate ? ' · ' + visitDate : ''}\n\n`;
    navigator.clipboard.writeText(header + text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const label = patientName || 'Consultation';
  const meta  = [dob ? `DOB: ${dob}` : null, visitDate].filter(Boolean).join(' · ');

  return (
    <>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.titleBlock}>
            <div style={s.title}>SOAP Note — {label}</div>
            {meta && <div style={s.subtitle}>{meta}</div>}
          </div>
          <button style={s.copyBtn} onClick={copyAll}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy all'}
          </button>
        </div>
        {SECTIONS.map((sec, i) => (
          <div key={sec.key} style={i === SECTIONS.length - 1 ? s.sectionLast : s.section}>
            <div style={s.sectionLabel}>{sec.label}</div>
            <textarea
              style={s.textarea}
              value={edits[sec.key] || ''}
              onChange={e => setEdits(prev => ({ ...prev, [sec.key]: e.target.value }))}
              onFocus={e => Object.assign(e.target.style, { borderColor: 'var(--border-md)', background: 'var(--surface2)' })}
              onBlur={e => Object.assign(e.target.style, { borderColor: 'transparent', background: 'transparent' })}
              rows={4}
            />
          </div>
        ))}
      </div>
    </>
  );
}
