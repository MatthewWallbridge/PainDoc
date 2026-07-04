import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { getRecord, deleteRecord } from '../../lib/supabase';
import { questionnaireToText } from '../../lib/questionnaireText';
import { generatePreConsultLetter } from '../../clinical-notes/lib/claude';
import type { PatientRecord, MSKLetter as MSKLetterType } from '../../lib/types';
import Avatar from '../components/Avatar';
import ResultView from '../components/ResultView';
import MSKLetter from '../../clinical-notes/components/MSKLetter';
import AdminHeader from './AdminHeader';

export default function SubmissionDetail() {
  const { id }       = useParams<{ id: string }>();
  const navigate     = useNavigate();
  const [record,     setRecord]     = useState<PatientRecord | null | undefined>(undefined);
  const [downloading, setDownloading] = useState(false);
  const [pdfError,   setPdfError]   = useState<string | null>(null);
  const [deleting,   setDeleting]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [apiKey,     setApiKey]     = useState(() => localStorage.getItem('paindoc_api_key') || '');
  const [letter,     setLetter]     = useState<MSKLetterType | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError,   setGenError]   = useState<string | null>(null);

  async function generateLetter() {
    if (!record) return;
    if (!apiKey.trim()) { setGenError('No Anthropic API key set — add one on the admin dashboard first.'); return; }
    setGenerating(true);
    setGenError(null);
    setLetter(null);
    try {
      const result = await generatePreConsultLetter({
        apiKey: apiKey.trim(),
        questionnaireText: questionnaireToText(record),
        dob: record.dob,
        date: record.date,
      });
      setLetter(result);
    } catch (e) {
      setGenError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    if (!id) { setRecord(null); return; }
    getRecord(id).then(setRecord);
  }, [id]);

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

  async function downloadPdf() {
    if (!record) return;
    setDownloading(true);
    setPdfError(null);
    try {
      const { downloadPatientPdf } = await import('../../pdf/PatientPdf');
      await downloadPatientPdf(record);
    } catch (e) {
      console.error(e);
      setPdfError('Could not generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteRecord(id);
      navigate('/admin');
    } catch {
      alert('Could not delete this record. Please try again.');
      setDeleting(false);
      setConfirmDel(false);
    }
  }

  if (record === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <AdminHeader />
        <div className="flex justify-center items-center py-24">
          <div className="w-6 h-6 border-2 border-[#0891B2]/20 border-t-[#0891B2] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (record === null) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <AdminHeader />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-gray-500 text-sm mb-4">Record not found.</p>
          <Link to="/admin" className="text-sm font-semibold text-[#0891B2] hover:text-[#0E7490] transition-colors">← Back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FDFA] font-sans">
      <AdminHeader />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#134E4A] transition mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to patients
        </Link>

        {/* Patient header */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={record.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[#134E4A] truncate">{record.name}</h1>
            <p className="text-sm text-[#94A3B8]">DOB: {record.dob || '—'} · Assessed: {record.date || '—'}</p>
          </div>
          <button
            onClick={downloadPdf}
            disabled={downloading}
            className="flex-shrink-0 px-4 py-2 bg-[#0891B2] text-white rounded-xl text-xs font-semibold hover:bg-[#0E7490] active:scale-[0.98] transition disabled:opacity-60 flex items-center gap-2 shadow-[0_2px_10px_rgba(8,145,178,0.06)]"
          >
            {downloading
              ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
            {downloading ? 'Preparing…' : 'Download PDF'}
          </button>
        </div>

        {pdfError && <p className="text-xs text-red-500 -mt-3 mb-4">{pdfError}</p>}

        {/* Pre-consultation MSK letter */}
        <div className="mb-6 bg-white rounded-2xl border border-[#CCFBF1] shadow-[0_2px_10px_rgba(8,145,178,0.06)] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#134E4A]">Pre-consultation MSK letter</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Drafts the letter skeleton from this questionnaire, ready to refine after the consultation.
              </p>
            </div>
            <button
              onClick={generateLetter}
              disabled={generating}
              className="flex-shrink-0 px-4 py-2 bg-[#0891B2] text-white rounded-xl text-xs font-semibold hover:bg-[#0E7490] active:scale-[0.98] transition disabled:opacity-60 flex items-center gap-2 shadow-[0_2px_10px_rgba(8,145,178,0.06)]"
            >
              {generating && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {generating ? 'Drafting…' : letter ? 'Regenerate' : 'Generate letter'}
            </button>
          </div>
          {!apiKey && (
            <p className="text-xs text-[#0E7490] mt-3 flex items-center gap-1.5">
              <KeyRound size={12} className="flex-shrink-0" />
              No API key set —
              <Link to="/admin" className="font-semibold underline hover:no-underline">add one on the dashboard</Link>
            </p>
          )}
          {genError && <p className="text-xs text-red-500 mt-3">{genError}</p>}
        </div>

        {letter && (
          <div className="mb-6 flex justify-center">
            <MSKLetter
              letter={letter}
              patientName={record.name}
              dob={record.dob}
              visitDate={record.date}
              title="Pre-Consultation Letter"
            />
          </div>
        )}

        {/* Assessment results */}
        <ResultView record={record} />

        {/* Delete */}
        <div className="mt-8 pt-6 border-t border-[#CCFBF1]">
          {confirmDel ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600 flex-1">Delete this submission permanently?</p>
              <button onClick={() => setConfirmDel(false)} className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">Cancel</button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDel(true)}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Delete this submission
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-10">
        <div className="border-t border-[#E8F1F6] pt-6">
          <p className="text-xs text-[#94A3B8] text-center">
            © Dr. Ian Wallbridge — Pain Doc Rotorua
          </p>
        </div>
      </div>
    </div>
  );
}
