import { useState, useCallback } from 'react'
import { Wand2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import ApiKeyInput from './ApiKeyInput'
import PatientFields from './PatientFields'
import VoiceRecorder from './VoiceRecorder'
import SOAPNote from './SOAPNote'
import NoteHistory from './NoteHistory'
import { generateSOAP } from '../claude'

const today = new Date().toISOString().split('T')[0]

function loadHistory() {
  try {
    const raw = localStorage.getItem('paindoc_history')
    const all = raw ? JSON.parse(raw) : []
    return all.filter(n => n.savedAt?.startsWith(today))
  } catch { return [] }
}

function saveHistory(notes) {
  try { localStorage.setItem('paindoc_history', JSON.stringify(notes)) } catch {}
}

// Inject styles needed by notes components (scoped to avoid clashing with Tailwind)
const notesStyles = `
  .notes-root { --bg: #f5f4f0; --surface: #ffffff; --surface2: #f9f8f5; --border: rgba(0,0,0,0.09); --border-md: rgba(0,0,0,0.15); --text: #1a1a18; --text-muted: #6b6a65; --text-hint: #a09f9a; --accent: #0F6E56; --accent-hover: #085041; --accent-light: #E1F5EE; --accent-text: #085041; --red: #A32D2D; --red-light: #FCEBEB; --amber-light: #FAEEDA; --amber-text: #633806; --radius: 10px; --radius-sm: 6px; }
  @media (prefers-color-scheme: dark) {
    .notes-root { --bg: #1a1a18; --surface: #242422; --surface2: #2c2c2a; --border: rgba(255,255,255,0.08); --border-md: rgba(255,255,255,0.14); --text: #eeecea; --text-muted: #9e9d98; --text-hint: #6b6a65; --accent-light: #04342C; --accent-text: #9FE1CB; --red-light: #501313; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.6); opacity: 0; } }
`

export default function NotesApp() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('paindoc_api_key') || '')
  const [patient, setPatient] = useState({ name: '', dob: '', visitDate: today })
  const [transcript, setTranscript] = useState('')
  const [soap, setSoap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState(loadHistory)

  const handlePatient = (key, val) => setPatient(p => ({ ...p, [key]: val }))

  const handleApiKey = (val) => {
    setApiKey(val)
    localStorage.setItem('paindoc_api_key', val)
  }

  const handleClear = useCallback(() => {
    setTranscript('')
    setSoap(null)
    setError('')
    setPatient({ name: '', dob: '', visitDate: today })
  }, [])

  const handleGenerate = async () => {
    setError('')
    if (!apiKey.trim()) { setError('Please enter your Anthropic API key.'); return }
    if (!transcript.trim()) { setError('No notes to process — dictate or type something first.'); return }
    setLoading(true)
    setSoap(null)
    try {
      const result = await generateSOAP({
        apiKey: apiKey.trim(),
        rawText: transcript,
        patientName: patient.name,
        dob: patient.dob,
        visitDate: patient.visitDate,
      })
      setSoap(result)
      const note = {
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
        patientName: patient.name,
        dob: patient.dob,
        visitDate: patient.visitDate,
        soap: result,
      }
      const updated = [note, ...history]
      setHistory(updated)
      saveHistory(updated)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = (id) => {
    const updated = history.filter(n => n.id !== id)
    setHistory(updated)
    saveHistory(updated)
  }

  const s = {
    page: { padding: '1.5rem 0' },
    backRow: {
      display: 'flex', alignItems: 'center', gap: 8,
      marginBottom: '1.5rem',
    },
    backBtn: {
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: '0.82rem', color: 'var(--text-muted)',
      background: 'none', border: 'none', cursor: 'pointer',
      fontFamily: 'Georgia, serif', padding: 0,
      textDecoration: 'none',
    },
    heading: {
      fontFamily: 'Georgia, serif', fontSize: '1.4rem',
      color: 'var(--text)', marginBottom: '0.25rem',
    },
    sub: {
      fontSize: '0.75rem', fontFamily: 'Courier New, monospace',
      color: 'var(--text-hint)', letterSpacing: '0.06em',
      marginBottom: '1.75rem',
    },
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    },
    btnRow: { display: 'flex', gap: '0.75rem', width: '100%', maxWidth: 720, marginBottom: '1rem' },
    generateBtn: {
      flex: 1, padding: '0.85rem',
      background: 'var(--accent)', color: '#fff',
      border: 'none', borderRadius: 8,
      fontFamily: 'Georgia, serif', fontSize: '1rem',
      cursor: loading ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s',
    },
    newBtn: {
      padding: '0.85rem 1.1rem', background: 'none',
      border: '1px solid var(--border-md)', borderRadius: 8,
      fontFamily: 'Georgia, serif', fontSize: '0.9rem',
      color: 'var(--text-muted)', cursor: 'pointer', whiteSpace: 'nowrap',
    },
    spinner: {
      width: 16, height: 16,
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    },
    error: {
      width: '100%', maxWidth: 720,
      background: 'var(--red-light)', border: '1px solid var(--red)',
      borderRadius: 8, padding: '0.85rem 1rem',
      fontSize: '0.88rem', color: 'var(--red)',
      marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: 8,
    },
    divider: {
      width: '100%', maxWidth: 720,
      borderTop: '1px solid var(--border)', margin: '1.5rem 0 1.25rem',
    },
  }

  return (
    <div className="notes-root" style={s.page}>
      <style>{notesStyles}</style>
      <Link to="/admin" style={s.backBtn}>
        <ArrowLeft size={14} /> Back to patients
      </Link>
      <h1 style={s.heading}>Clinical Notes</h1>
      <p style={s.sub}>Dictate or type — Claude structures into SOAP format</p>

      <div style={s.container}>
        <ApiKeyInput value={apiKey} onChange={handleApiKey} />
        <PatientFields values={patient} onChange={handlePatient} />
        <VoiceRecorder transcript={transcript} onTranscriptChange={setTranscript} onClear={handleClear} />

        {error && (
          <div style={s.error}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        <div style={s.btnRow}>
          <button style={s.generateBtn} onClick={handleGenerate} disabled={loading}>
            {loading ? <><span style={s.spinner} /> Structuring notes…</> : <><Wand2 size={16} /> Generate SOAP Note</>}
          </button>
          {(soap || transcript) && (
            <button style={s.newBtn} onClick={handleClear}>New patient</button>
          )}
        </div>

        {soap && (
          <SOAPNote
            soap={soap}
            patientName={patient.name}
            dob={patient.dob}
            visitDate={patient.visitDate}
          />
        )}

        {history.length > 0 && (
          <>
            <div style={s.divider} />
            <NoteHistory
              notes={history}
              onDelete={handleDeleteNote}
              onClearAll={() => { setHistory([]); saveHistory([]) }}
            />
          </>
        )}
      </div>
    </div>
  )
}
