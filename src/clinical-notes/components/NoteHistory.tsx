import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Copy, Check, Trash2 } from 'lucide-react';
import type { NoteEntry } from '../../lib/types';
import { SECTIONS } from './MSKLetter';

function NoteCard({ note, onDelete }: { note: NoteEntry; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const recipients = note.letter.recipients ? `${note.letter.recipients}\n\n` : '';
    const text = SECTIONS.map((s, i) => `${i + 1}. ${s.label}\n${note.letter[s.key] || '—'}`).join('\n\n');
    const header = `MSK LETTER${note.patientName ? ' — ' + note.patientName : ''}${note.dob ? ' · DOB: ' + note.dob : ''}${note.visitDate ? ' · ' + note.visitDate : ''}\n\n`;
    navigator.clipboard.writeText(header + recipients + text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const timeStr = new Date(note.savedAt).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date(note.savedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });

  return (
    <div className="bg-white rounded-2xl border border-[#CCFBF1] shadow-[0_2px_10px_rgba(8,145,178,0.06)] overflow-hidden mb-3">
      <div className="px-5 py-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#F8FAFC] transition" onClick={() => setExpanded(v => !v)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#134E4A] truncate" style={{ fontFamily: 'Georgia, serif' }}>
            {note.patientName || 'Unknown patient'}
          </p>
          <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
            {dateStr} · {timeStr}{note.visitDate ? ` · Seen: ${note.visitDate}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#A5F3FC] bg-[#ECFEFF] text-[#0E7490] text-xs font-semibold hover:bg-[#CFFAFE] transition"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}{copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(note.id); }}
            className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-red-400 hover:bg-red-50 transition"
          >
            <Trash2 size={14} />
          </button>
          <span className="text-[#CBD5E1]">{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-4 pt-1 border-t border-[#E8F1F6] space-y-3">
          {note.letter.recipients && (
            <div>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Recipients</p>
              <p className="text-sm text-[#134E4A] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif' }}>
                {note.letter.recipients}
              </p>
            </div>
          )}
          {SECTIONS.map(sec => (
            <div key={sec.key}>
              <p className="text-[10px] font-bold text-[#0891B2] uppercase tracking-widest mb-1">{sec.label}</p>
              <p className="text-sm text-[#134E4A] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif' }}>
                {note.letter[sec.key] || '—'}
              </p>
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

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#94A3B8]" />
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Today's Notes ({notes.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(v => !v)}
            className="text-xs text-[#94A3B8] hover:text-[#64748B] flex items-center gap-1 transition"
          >
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}{open ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={onClearAll}
            className="text-xs text-[#94A3B8] hover:text-red-400 border border-[#CCFBF1] px-2.5 py-1 rounded-lg transition"
          >
            Clear all
          </button>
        </div>
      </div>
      {open && notes.map(note => <NoteCard key={note.id} note={note} onDelete={onDelete} />)}
    </div>
  );
}
