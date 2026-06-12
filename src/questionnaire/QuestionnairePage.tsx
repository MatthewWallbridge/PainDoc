import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ODI_QUESTIONS, HADS_QUESTIONS } from '../lib/assessments';
import { submitSubmission } from '../lib/supabase';
import StepIndicator from './components/StepIndicator';
import RadioOption from './components/RadioOption';

function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-2 bg-[#E6F3EE] rounded-full overflow-hidden">
      <div className="h-full bg-[#0B5E47] rounded-full transition-all duration-500" style={{ width: `${Math.round((value / max) * 100)}%` }} />
    </div>
  );
}

function Field({ label, type, value, setter, placeholder = '' }: { label: string; type: string; value: string; setter: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#6B7E7A] uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => setter(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8E6] bg-white text-[#1A2623] text-sm focus:outline-none focus:border-[#0B5E47] focus:ring-4 focus:ring-[#E6F3EE] transition"
      />
    </div>
  );
}

function InfoStep({ onNext }: { onNext: (info: { name: string; dob: string; date: string }) => void }) {
  const [name, setName] = useState('');
  const [dob,  setDob]  = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div className="max-w-lg mx-auto">
      <StepIndicator current="info" />

      <div className="mb-7">
        <h2 className="text-2xl font-bold text-[#1A2623] mb-2">Welcome</h2>
        <p className="text-[#6B7E7A] text-sm leading-relaxed">
          Please complete the following questionnaires before your appointment. Your answers will help your physician prepare for your consultation.
        </p>
      </div>

      <div className="mb-6 p-4 rounded-2xl bg-[#E6F3EE] border border-[#B0D8CC]">
        <p className="text-xs font-bold text-[#085041] uppercase tracking-widest mb-1.5">How this works</p>
        <p className="text-sm text-[#085041] leading-relaxed">
          Fill in your details, then complete two short questionnaires — one about your back pain and one about your mood. All answers are private and reviewed only by your clinician.
        </p>
      </div>

      <div className="space-y-4">
        <Field label="Full name"     type="text" value={name} setter={setName} placeholder="e.g. Jane Smith" />
        <Field label="Date of birth" type="date" value={dob}  setter={setDob} />
        <Field label="Today's date"  type="date" value={date} setter={setDate} />
      </div>

      <button
        onClick={() => { if (!name.trim()) { alert('Please enter your name.'); return; } onNext({ name, dob, date }); }}
        className="mt-8 w-full py-4 bg-[#0B5E47] text-white rounded-xl font-semibold text-sm hover:bg-[#085041] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2"
      >
        Begin questionnaire <span aria-hidden>→</span>
      </button>
    </div>
  );
}

function QuestionnaireStep({
  questions,
  answers,
  setAnswers,
  title,
  description,
  onBack,
  onNext,
  nextLabel = 'Continue →',
  type = 'odi',
  busy = false,
  error = null,
  stepKey,
}: {
  questions: typeof ODI_QUESTIONS | typeof HADS_QUESTIONS;
  answers: Record<string, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  title: string;
  description?: string;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  type?: 'odi' | 'hads';
  busy?: boolean;
  error?: string | null;
  stepKey: string;
}) {
  const required = questions.filter(q => !q.optional);
  const answered  = Object.keys(answers).length;

  return (
    <div className="max-w-lg mx-auto">
      <StepIndicator current={stepKey} />

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-[#1A2623]">{title}</h2>
          <span className="text-xs text-[#9BADA9] font-mono bg-[#F4F3EF] px-2.5 py-1 rounded-lg border border-[#E2E8E6]">{answered}/{questions.length}</span>
        </div>
        <ProgressBar value={answered} max={questions.length} />
        {description && <p className="text-[#6B7E7A] text-xs mt-3 leading-relaxed">{description}</p>}
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => {
          const hadsQ = q as typeof HADS_QUESTIONS[number];
          const isHads = type === 'hads';
          return (
            <div key={q.id} className="bg-white rounded-2xl border border-[#E2E8E6] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F5F3] flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-[#BDCBC8] uppercase tracking-widest mb-1">
                    {isHads
                      ? (hadsQ.type === 'A' ? 'Anxiety' : 'Depression')
                      : `Question ${i + 1}`}
                    {q.optional && <span className="ml-2 text-[#D4E3DF]">· optional</span>}
                  </p>
                  <p className="text-sm font-semibold text-[#1A2623]">{q.text}</p>
                  {q.subtitle && <p className="text-xs text-[#9BADA9] mt-0.5">{q.subtitle}</p>}
                </div>
                {answers[q.id] !== undefined && (
                  <div className="w-6 h-6 rounded-full bg-[#E6F3EE] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-[#0B5E47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-3 space-y-1.5">
                {q.opts.map((opt, j) => (
                  <RadioOption
                    key={j}
                    label={opt}
                    score={isHads ? hadsQ.scores[j] : j}
                    selected={answers[q.id] === j}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: j }))}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}

      <div className="flex gap-3 mt-6 mb-10">
        <button
          onClick={onBack}
          disabled={busy}
          className="px-5 py-3 rounded-xl border-2 border-[#E2E8E6] text-[#6B7E7A] text-sm font-semibold hover:bg-[#F4F3EF] hover:border-[#C5D4D0] transition disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          disabled={busy}
          onClick={() => {
            const missing = required.filter(q => answers[q.id] === undefined);
            if (missing.length) { alert(`Please answer all required questions (${missing.length} remaining).`); return; }
            onNext();
          }}
          className="flex-1 py-3 bg-[#0B5E47] text-white rounded-xl font-semibold text-sm hover:bg-[#085041] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {busy && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
          {busy ? 'Saving…' : nextLabel}
        </button>
      </div>
    </div>
  );
}

type Step = 'info' | 'odi' | 'hads';

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const [step, setStep]               = useState<Step>('info');
  const [info, setInfo]               = useState<{ name: string; dob: string; date: string } | null>(null);
  const [odiAnswers, setOdiAnswers]   = useState<Record<string, number>>({});
  const [hadsAnswers, setHadsAnswers] = useState<Record<string, number>>({});
  const [busy, setBusy]               = useState(false);
  const [error, setError]             = useState<string | null>(null);

  async function submit() {
    if (!info) return;
    setBusy(true);
    setError(null);
    const { error: err, record } = await submitSubmission({
      name: info.name.trim(),
      dob: info.dob,
      date: info.date,
      odiAnswers,
      hadsAnswers,
    });
    setBusy(false);
    if (err || !record) {
      setError('Could not save your answers. Please check your connection and try again.');
      return;
    }
    navigate('/thank-you', { state: { record } });
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF] font-sans">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E2E8E6]" style={{ boxShadow: '0 1px 8px rgba(11,94,71,0.07)' }}>
        <div className="h-1 bg-[#0B5E47]" />
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center">
          <Link to="/" className="flex items-center gap-3">
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
        {step === 'info' && (
          <InfoStep onNext={i => { setInfo(i); setStep('odi'); }} />
        )}
        {step === 'odi' && (
          <QuestionnaireStep
            questions={ODI_QUESTIONS}
            answers={odiAnswers}
            setAnswers={setOdiAnswers}
            title="Oswestry Disability Index"
            onBack={() => setStep('info')}
            onNext={() => setStep('hads')}
            nextLabel="Continue to HADS →"
            type="odi"
            stepKey="odi"
          />
        )}
        {step === 'hads' && (
          <QuestionnaireStep
            questions={HADS_QUESTIONS}
            answers={hadsAnswers}
            setAnswers={setHadsAnswers}
            title="Hospital Anxiety and Depression Scale"
            description="Tick the box beside the reply that is closest to how you have been feeling in the past week. Don't take too long — your immediate reaction is best."
            onBack={() => setStep('odi')}
            onNext={submit}
            nextLabel="Submit questionnaire"
            type="hads"
            busy={busy}
            error={error}
            stepKey="hads"
          />
        )}
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
