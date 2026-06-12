import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getRecord, deleteRecord } from '../../lib/supabase';
import type { PatientRecord } from '../../lib/types';
import Avatar from '../components/Avatar';
import ResultView from '../components/ResultView';
import AdminHeader from './AdminHeader';

export default function SubmissionDetail() {
  const { id }       = useParams<{ id: string }>();
  const navigate     = useNavigate();
  const [record,     setRecord]     = useState<PatientRecord | null | undefined>(undefined);
  const [downloading, setDownloading] = useState(false);
  const [pdfError,   setPdfError]   = useState<string | null>(null);
  const [deleting,   setDeleting]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    if (!id) { setRecord(null); return; }
    getRecord(id).then(setRecord);
  }, [id]);

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
          <div className="w-6 h-6 border-2 border-[#0B5E47]/20 border-t-[#0B5E47] rounded-full animate-spin" />
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
          <Link to="/admin" className="text-sm font-semibold text-[#0B5E47] hover:text-[#085041] transition-colors">← Back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF] font-sans">
      <AdminHeader />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7E7A] hover:text-[#1A2623] transition mb-6"
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
            <h1 className="text-xl font-bold text-[#1A2623] truncate">{record.name}</h1>
            <p className="text-sm text-[#9BADA9]">DOB: {record.dob || '—'} · Assessed: {record.date || '—'}</p>
          </div>
          <button
            onClick={downloadPdf}
            disabled={downloading}
            className="flex-shrink-0 px-4 py-2 bg-[#0B5E47] text-white rounded-xl text-xs font-semibold hover:bg-[#085041] active:scale-[0.98] transition disabled:opacity-60 flex items-center gap-2 shadow-sm"
          >
            {downloading
              ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
            {downloading ? 'Preparing…' : 'Download PDF'}
          </button>
        </div>

        {pdfError && <p className="text-xs text-red-500 -mt-3 mb-4">{pdfError}</p>}

        {/* Assessment results */}
        <ResultView record={record} />

        {/* Delete */}
        <div className="mt-8 pt-6 border-t border-[#E2E8E6]">
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
        <div className="border-t border-[#E8EDEC] pt-6">
          <p className="text-xs text-[#BDCBC8] text-center">
            © Dr. Ian Wallbridge — Pain Doc Rotorua
          </p>
        </div>
      </div>
    </div>
  );
}
