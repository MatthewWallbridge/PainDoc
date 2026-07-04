import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wand2, AlertCircle, KeyRound } from 'lucide-react';
import PatientFields from './PatientFields';
import VoiceRecorder from './VoiceRecorder';
import MSKLetter from './MSKLetter';
import NoteHistory from './NoteHistory';
import QuestionnairePicker from './QuestionnairePicker';
import { generateMSKLetter } from '../lib/claude';
import { questionnaireToText } from '../../lib/questionnaireText';
import type { NoteEntry, MSKLetter as MSKLetterType, PatientRecord } from '../../lib/types';

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
  const [submission, setSubmission] = useState<PatientRecord | null>(null);
  const [transcript, setTranscript] = useState('');
  const [letter, setLetter] = useState<MSKLetterType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [history, setHistory] = useState<NoteEntry[]>(loadHistory);

  // The API key is set once on the admin dashboard; pick up changes made there
  // (another tab, or after signing in) without needing a page reload here.
  useEffect(() => {
    const refresh = () => setApiKey(localStorage.getItem('paindoc_api_key') || '');
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const handlePatient = (key: string, val: string) => setPatient(p => ({ ...p, [key]: val }));

  const handleClear = useCallback(() => {
    setTranscript('');
    setLetter(null);
    setError('');
    setPatient({ name: '', dob: '', visitDate: today });
    setSubmission(null);
  }, []);

  const handleSelectSubmission = (record: PatientRecord | null) => {
    setSubmission(record);
    if (record) {
      setPatient(p => ({ ...p, name: record.name || p.name, dob: record.dob || p.dob }));
    }
  };

  const handleGenerate = async () => {
    setError('');
    if (!apiKey.trim())     { setError('Please enter your Anthropic API key.'); return; }
    if (!transcript.trim()) { setError('No notes to process — dictate or type something first.'); return; }
    setLoading(true);
    setLetter(null);
    try {
      const result = await generateMSKLetter({
        apiKey: apiKey.trim(),
        rawText: transcript,
        patientName: patient.name,
        dob: patient.dob,
        visitDate: patient.visitDate,
        questionnaireText: submission ? questionnaireToText(submission) : undefined,
      });
      setLetter(result);
      const note: NoteEntry = { id: Date.now().toString(), savedAt: new Date().toISOString(), patientName: patient.name, dob: patient.dob, visitDate: patient.visitDate, letter: result };
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
      {!apiKey && (
        <div className="w-full max-w-2xl mb-4 px-4 py-3 rounded-xl bg-[#ECFEFF] border border-[#A5F3FC] text-sm text-[#0E7490] flex items-center gap-2.5">
          <KeyRound size={15} className="flex-shrink-0" />
          <span className="flex-1">No Anthropic API key set for this browser.</span>
          <Link to="/admin" className="font-semibold underline hover:no-underline whitespace-nowrap">
            Set it in the admin dashboard →
          </Link>
        </div>
      )}
      <PatientFields values={patient} onChange={handlePatient} />
      <QuestionnairePicker selected={submission} onSelect={handleSelectSubmission} />
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
          className="flex-1 py-3 bg-[#0891B2] text-white rounded-xl font-semibold text-sm hover:bg-[#0E7490] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(8,145,178,0.06)]"
        >
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Structuring notes…</>
            : <><Wand2 size={16} /> Generate MSK Letter</>}
        </button>
        {(letter || transcript) && (
          <button
            onClick={handleClear}
            className="px-5 py-3 rounded-xl border-2 border-[#CCFBF1] text-[#64748B] text-sm font-semibold hover:bg-[#F0FDFA] transition"
          >
            New patient
          </button>
        )}
      </div>

      {letter && <MSKLetter letter={letter} patientName={patient.name} dob={patient.dob} visitDate={patient.visitDate} />}

      {history.length > 0 && (
        <>
          <div className="w-full max-w-2xl border-t border-[#CCFBF1] my-5" />
          <NoteHistory notes={history} onDelete={handleDeleteNote} onClearAll={() => { setHistory([]); saveHistory([]); }} />
        </>
      )}
    </div>
  );
}
