import { Link, useLocation, Navigate } from 'react-router-dom';
import type { PatientRecord } from '../lib/types';
import ResultView from './components/ResultView';
import StepIndicator from './components/StepIndicator';

interface LocationState {
  record: Omit<PatientRecord, 'id' | 'createdAt'>;
}

export default function ThankYouPage() {
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!state?.record) return <Navigate to="/" replace />;

  const { record } = state;
  const firstName  = (record.name || 'there').split(' ')[0];

  return (
    <div className="min-h-screen bg-[#F4F3EF] font-sans">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E2E8E6]" style={{ boxShadow: '0 1px 8px rgba(11,94,71,0.07)' }}>
        <div className="h-1 bg-[#0B5E47]" />
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-9 h-9 rounded-xl bg-[#0B5E47] flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#1A2623] leading-none">Pain Doc Rotorua</p>
              <p className="text-[11px] text-[#9BADA9] mt-0.5 tracking-wide font-medium">Patient Assessment Portal</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="max-w-lg mx-auto">
          <StepIndicator current="result" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#E6F3EE] flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[#0B5E47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1A2623] mb-2">Thank you, {firstName}</h2>
            <p className="text-[#6B7E7A] text-sm leading-relaxed max-w-sm mx-auto">
              Your responses have been saved securely. Your physician will review them before your appointment. Here's a summary of your answers.
            </p>
          </div>

          <ResultView record={record as PatientRecord} />

          <Link
            to="/"
            className="mt-6 w-full py-3 rounded-xl border-2 border-[#E2E8E6] text-[#6B7E7A] text-sm font-semibold hover:bg-[#F4F3EF] hover:border-[#C5D4D0] transition flex items-center justify-center"
          >
            Return to home
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-10">
        <div className="border-t border-[#E8EDEC] pt-6">
          <p className="text-xs text-[#BDCBC8] text-center leading-relaxed">
            © Dr. Ian Wallbridge — Pain Doc Rotorua
            <span className="mx-2">·</span>
            These tools do not substitute for the informed opinion of a licensed physician.
          </p>
        </div>
      </div>
    </div>
  );
}
