const s: Record<string, React.CSSProperties> = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', width: '100%', maxWidth: 720, marginBottom: '1rem' },
  label: { fontSize: '0.68rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-hint)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' },
  fieldLabel: { fontSize: '0.68rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 },
  input: { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: 'var(--text)', outline: 'none' },
};

interface PatientValues { name: string; dob: string; visitDate: string; }

export default function PatientFields({ values, onChange }: { values: PatientValues; onChange: (key: string, val: string) => void }) {
  const field = (key: keyof PatientValues, label: string, type = 'text', placeholder = '') => (
    <div>
      <div style={s.fieldLabel}>{label}</div>
      <input style={s.input} type={type} placeholder={placeholder} value={values[key]} onChange={e => onChange(key, e.target.value)} />
    </div>
  );

  return (
    <div style={s.card}>
      <div style={s.label}><span style={s.dot} />Patient Details</div>
      <div style={s.grid}>
        {field('name', 'Patient Name', 'text', 'Full name')}
        {field('dob', 'Date of Birth', 'date')}
        {field('visitDate', 'Visit Date', 'date')}
      </div>
    </div>
  );
}
