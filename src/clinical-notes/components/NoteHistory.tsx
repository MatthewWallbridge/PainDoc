import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Copy, Check, Trash2 } from 'lucide-react';
import type { NoteEntry, SOAPNote } from '../../lib/types';

const SECTIONS: Array<{ key: keyof SOAPNote; label: string }> = [
  { key: 'subjective', label: 'S — Subjective' },
  { key: 'objective',  label: 'O — Objective'  },
  { key: 'assessment', label: 'A — Assessment'  },
  { key: 'plan',       label: 'P — Plan'        },
];

function NoteCard({ note, onDelete }: { note: NoteEntry; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = SECTIONS.map(s => `${s.label}\n${note.soap[s.key] || '—'}`).join('\n\n');
    const header = `SOAP NOTE${note.patientName ? ' — ' + note.patientName : ''}${note.dob ? ' · DOB: ' + note.dob : ''}${note.visitDate ? ' · ' + note.visitDate : ''}\n\n`;
    navigator.clipboard.writeText(header + text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const timeStr = new Date(note.savedAt).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date(note.savedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });

  const s: Record<string, React.CSSProperties> = {
    card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '0.6rem' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.1rem', cursor: 'pointer', userSelect: 'none', gap: 12 },
    left: { display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 },
    name: { fontSize: '0.9rem', fontFamily: 'Georgia, serif', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    meta: { fontSize: '0.7rem', fontFamily: 'Courier New, monospace', color: 'var(--text-hint)', letterSpacing: '0.04em' },
    actions: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 },
    copyBtn: { display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', fontFamily: 'Courier New, monospace', color: 'var(--accent-text)', background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 4, padding: '3px 8px', cursor: 'pointer' },
    deleteBtn: { display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: 'var(--text-hint)', cursor: 'pointer', padding: 4 },
    body: { borderTop: '1px solid var(--border)', padding: '1rem 1.1rem' },
    sectionLabel: { fontSize: '0.65rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1D9E75', fontWeight: 'bold', marginBottom: '0.3rem', marginTop: '0.75rem' },
    sectionContent: { fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap' },
  };

  return (
    <div style={s.card}>
      <div style={s.header} onClick={() => setExpanded(v => !v)}>
        <div style={s.left}>
          <div style={s.name}>{note.patientName || 'Unknown patient'}</div>
          <div style={s.meta}>{dateStr} · {timeStr}{note.visitDate ? ` · Seen: ${note.visitDate}` : ''}</div>
        </div>
        <div style={s.actions}>
          <button style={s.copyBtn} onClick={copy}>{copied ? <Check size={11} /> : <Copy size={11} />}{copied ? 'Copied' : 'Copy'}</button>
          <button style={s.deleteBtn} onClick={e => { e.stopPropagation(); onDelete(note.id); }}><Trash2 size={14} /></button>
          <span style={{ color: 'var(--text-hint)', flexShrink: 0 }}>{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
        </div>
      </div>
      {expanded && (
        <div style={s.body}>
          {SECTIONS.map((sec, i) => (
            <div key={sec.key}>
              <div style={{ ...s.sectionLabel, marginTop: i === 0 ? 0 : '0.75rem' }}>{sec.label}</div>
              <div style={s.sectionContent}>{note.soap[sec.key] || '—'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NoteHistory({ notes, onDelete, onClearAll }: { notes: NoteEntry[]; onDelete: (id: string) => void; onClearAll: () => void }) {
  const [open, setOpen] = useState(true);
  if (!notes.length) return null;

  const s: Record<string, React.CSSProperties> = {
    wrapper: { width: '100%', maxWidth: 720, marginBottom: '1rem' },
    headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' },
    label: { fontSize: '0.68rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-hint)', display: 'flex', alignItems: 'center', gap: 6 },
    dot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' },
    clearBtn: { fontSize: '0.68rem', fontFamily: 'Courier New, monospace', color: 'var(--text-hint)', background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', letterSpacing: '0.04em' },
    toggleBtn: { fontSize: '0.68rem', fontFamily: 'Courier New, monospace', color: 'var(--text-hint)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
  };

  return (
    <div style={s.wrapper}>
      <div style={s.headerRow}>
        <div style={s.label}><span style={s.dot} /><Clock size={11} />Today's Notes ({notes.length})</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={s.toggleBtn} onClick={() => setOpen(v => !v)}>{open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}{open ? 'Hide' : 'Show'}</button>
          <button style={s.clearBtn} onClick={onClearAll}>Clear all</button>
        </div>
      </div>
      {open && notes.map(note => <NoteCard key={note.id} note={note} onDelete={onDelete} />)}
    </div>
  );
}
