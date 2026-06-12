import { useState } from 'react';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

const s: Record<string, React.CSSProperties> = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', width: '100%', maxWidth: 720, marginBottom: '1rem' },
  label: { fontSize: '0.68rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-hint)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' },
  row: { display: 'flex', gap: 8, alignItems: 'center' },
  input: { flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.85rem', fontFamily: 'Courier New, monospace', fontSize: '0.82rem', color: 'var(--text)', outline: 'none' },
  toggle: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center' },
  hint: { fontSize: '0.72rem', color: 'var(--text-hint)', marginTop: '0.4rem', fontFamily: 'Courier New, monospace' },
};

export default function ApiKeyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div style={s.card}>
      <div style={s.label}><span style={s.dot} /><KeyRound size={12} />API Key</div>
      <div style={s.row}>
        <input style={s.input} type={show ? 'text' : 'password'} placeholder="sk-ant-..." value={value} onChange={e => onChange(e.target.value)} autoComplete="off" spellCheck={false} />
        <button style={s.toggle} onClick={() => setShow(v => !v)}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <div style={s.hint}>Stored in memory only — not saved to disk.</div>
    </div>
  );
}
