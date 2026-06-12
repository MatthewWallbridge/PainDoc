import { useState, useCallback } from 'react';
import { Wand2, AlertCircle } from 'lucide-react';
import ApiKeyInput from './ApiKeyInput';
import PatientFields from './PatientFields';
import VoiceRecorder from './VoiceRecorder';
import SOAPNote from './SOAPNote';
import NoteHistory from './NoteHistory';
import { generateSOAP } from '../lib/claude';
import type { NoteEntry, SOAPNote as SOAPNoteType } from '../../lib/types';

const today = new Date().toISOString().split('T')[0];

function loadHistory(): NoteEntry[] {
  try {
    const raw = localStorage.getItem('paindoc_history');
    const all: NoteEntry[] = raw ? JSON.parse(raw) : [];
    return all.filter(n => n.savedAt?.startsWith(today));
  } catch { return []; }
}

function saveHistory(notes: NoteEntry[]) {
  try { localStorage.setItem('paindoc_history', JSON.stringify(notes)); } catch {}
}

export default function NotesApp() {
  const [apiKey, setApiKey]   = useState(() => localStorage.getItem('paindoc_api_key') || '');
  const [patient, setPatient] = useState({ name: '', dob: '', visitDate: today });
  const [transcript, setTranscript] = useState('');
  const [soap, setSoap]   = useState<SOAPNoteType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [history, setHistory] = useState<NoteEntry[]>(loadHistory);

  const handleApiKey  = (val: string) => { setApiKey(val); localStorage.setItem('paindoc_api_key', val); };
  const handlePatient = (key: string, val: string) => setPatient(p => ({ ...p, [key]: val }));

  const handleClear = useCallback(() => {
    setTranscript('');
    setSoap(null);
    setError('');
    setPatient({ name: '', dob: '', visitDate: today });
  }, []);

  const handleGenerate = async () => {
    setError('');
    if (!apiKey.trim())     { setError('Please enter your Anthropic API key.'); return; }
    if (!transcript.trim()) { setError('No notes to process — dictate or type something first.'); return; }
    setLoading(true);
    setSoap(null);
    try {
      const result = await generateSOAP({ apiKey: apiKey.trim(), rawText: transcript, patientName: patient.name, dob: patient.dob, visitDate: patient.visitDate });
      setSoap(result);
      const note: NoteEntry = { id: Date.now().toString(), savedAt: new Date().toISOString(), patientName: patient.name, dob: patient.dob, visitDate: patient.visitDate, soap: result };
      const updated = [note, ...history];
      setHistory(updated);
      saveHistory(updated);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    const updated = history.filter(n => n.id !== id);
    setHistory(updated);
    saveHistory(updated);
  };

  return (
    <div className="py-6 flex flex-col items-center">
      <ApiKeyInput value={apiKey} onChange={handleApiKey} />
      <PatientFields values={patient} onChange={handlePatient} />
      <VoiceRecorder transcript={transcript} onTranscriptChange={setTranscript} onClear={handleClear} />

      {error && (
        <div className="w-full max-w-2xl mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="w-full max-w-2xl flex gap-3 mb-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 py-3 bg-[#0B5E47] text-white rounded-xl font-semibold text-sm hover:bg-[#085041] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Structuring notes…</>
            : <><Wand2 size={16} /> Generate SOAP Note</>}
        </button>
        {(soap || transcript) && (
          <button
            onClick={handleClear}
            className="px-5 py-3 rounded-xl border-2 border-[#E2E8E6] text-[#6B7E7A] text-sm font-semibold hover:bg-[#F4F3EF] transition"
          >
            New patient
          </button>
        )}
      </div>

      {soap && <SOAPNote soap={soap} patientName={patient.name} dob={patient.dob} visitDate={patient.visitDate} />}

      {history.length > 0 && (
        <>
          <div className="w-full max-w-2xl border-t border-[#E2E8E6] my-5" />
          <NoteHistory notes={history} onDelete={handleDeleteNote} onClearAll={() => { setHistory([]); saveHistory([]); }} />
        </>
      )}
    </div>
  );
}
