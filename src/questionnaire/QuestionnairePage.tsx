import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ODI_QUESTIONS, PHQ9_QUESTIONS, GAD7_QUESTIONS, PHQ9_DIFFICULTY_OPTIONS } from '../lib/assessments';
import { PREAMBLE_LETTERHEAD, PREAMBLE_TITLE, PREAMBLE_PARAGRAPHS, PREAMBLE_SIGNOFF } from '../lib/preamble';
import { submitSubmission } from '../lib/supabase';
import StepIndicator from './components/StepIndicator';
import RadioOption from './components/RadioOption';
import SegmentedScale from './components/SegmentedScale';
import SectionAStep from './components/SectionAStep';

function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-1.5 bg-[#ECFEFF] rounded-full overflow-hidden">
      <div className="h-full bg-[#0891B2] rounded-full transition-all duration-500" style={{ width: `${Math.round((value / max) * 100)}%` }} />
    </div>
  );
}

function Field({ label, type, value, setter, placeholder = '' }: { label: string; type: string; value: string; setter: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => setter(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border-2 border-[#CCFBF1] bg-white text-[#134E4A] text-sm focus:outline-none focus:border-[#0891B2] focus:ring-4 focus:ring-[#ECFEFF] transition-all duration-200"
      />
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#CCFBF1] shadow-[0_2px_10px_rgba(8,145,178,0.06)] overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function InfoStep({ onNext }: { onNext: (info: { name: string; dob: string; date: string }) => void }) {
  const [name, setName] = useState('');
  const [dob,  setDob]  = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [downloading, setDownloading] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  async function downloadLetter() {
    setDownloading(true);
    try {
      const { downloadPreamblePdf } = await import('../pdf/PreamblePdf');
      await downloadPreamblePdf();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <StepIndicator current="info" />

      {/* Preamble letter — collapsed by default to reduce scroll */}
      <Card className="mb-5">
        <div className="px-5 py-4 flex items-start justify-between gap-3">
          <button onClick={() => setShowLetter(v => !v)} className="flex-1 text-left cursor-pointer">
            <p className="text-sm font-bold text-[#0891B2]">{PREAMBLE_LETTERHEAD.name}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{showLetter ? 'Hide' : 'Read'} a note before you begin — {PREAMBLE_TITLE.toLowerCase()}</p>
          </button>
          <button
            onClick={downloadLetter}
            disabled={downloading}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-[#A5F3FC] bg-[#ECFEFF] text-[#0E7490] text-xs font-semibold hover:bg-[#CFFAFE] transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            {downloading ? 'Preparing…' : 'Download PDF'}
          </button>
        </div>
        {showLetter && (
          <div className="px-5 pb-5 pt-1 border-t border-[#E8F1F6]">
            <div className="space-y-3 mt-3">
              {PREAMBLE_PARAGRAPHS.map((p, i) => (
                <p key={i} className="text-sm text-[#134E4A] leading-relaxed">{p}</p>
              ))}
            </div>
            <p className="text-sm font-semibold text-[#134E4A] mt-4">{PREAMBLE_SIGNOFF.name}</p>
            <p className="text-xs text-[#94A3B8]">{PREAMBLE_SIGNOFF.role}</p>
          </div>
        )}
      </Card>

      <div className="space-y-3.5">
        <Field label="Full name"     type="text" value={name} setter={setName} placeholder="e.g. Jane Smith" />
        <Field label="Date of birth" type="date" value={dob}  setter={setDob} />
        <Field label="Today's date"  type="date" value={date} setter={setDate} />
      </div>

      <button
        onClick={() => { if (!name.trim()) { alert('Please enter your name.'); return; } onNext({ name, dob, date }); }}
        className="mt-6 w-full py-3.5 bg-[#0891B2] text-white rounded-xl font-semibold text-sm hover:bg-[#0E7490] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(8,145,178,0.25)] flex items-center justify-center gap-2 cursor-pointer"
      >
        Begin questionnaire <span aria-hidden>→</span>
      </button>
    </div>
  );
}

function ScaleStep({
  title,
  description,
  questions,
  answers,
  setAnswers,
  onBack,
  onNext,
  nextLabel = 'Continue →',
  busy = false,
  error = null,
  stepKey,
}: {
  title: string;
  description?: string;
  questions: typeof ODI_QUESTIONS | typeof PHQ9_QUESTIONS;
  answers: Record<string, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  busy?: boolean;
  error?: string | null;
  stepKey: string;
}) {
  const required = questions.filter(q => !('optional' in q && q.optional));
  const answered  = Object.keys(answers).length;

  return (
    <div className="max-w-lg mx-auto">
      <StepIndicator current={stepKey} />

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-[#134E4A]">{title}</h2>
          <span className="text-xs text-[#94A3B8] font-mono bg-[#F0FDFA] px-2.5 py-1 rounded-lg border border-[#CCFBF1]">{answered}/{questions.length}</span>
        </div>
        <ProgressBar value={answered} max={questions.length} />
        {description && <p className="text-[#64748B] text-xs mt-3 leading-relaxed">{description}</p>}
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <Card key={q.id}>
            <div className="px-4 py-3 border-b border-[#E8F1F6] flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">
                  Question {i + 1}
                  {'optional' in q && q.optional && <span className="ml-2 text-[#94A3B8]">· optional</span>}
                </p>
                <p className="text-sm font-semibold text-[#134E4A]">{q.text}</p>
                {'subtitle' in q && q.subtitle && <p className="text-xs text-[#94A3B8] mt-0.5">{q.subtitle}</p>}
              </div>
              {answers[q.id] !== undefined && (
                <div className="w-5 h-5 rounded-full bg-[#ECFEFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-2.5 space-y-1">
              {q.opts.map((opt, j) => (
                <RadioOption
                  key={j}
                  label={opt}
                  score={j}
                  selected={answers[q.id] === j}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: j }))}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}

      <div className="flex gap-3 mt-5 mb-10">
        <button
          onClick={onBack}
          disabled={busy}
          className="px-5 py-3 rounded-xl border-2 border-[#CCFBF1] text-[#64748B] text-sm font-semibold hover:bg-[#F0FDFA] hover:border-[#CBD5E1] transition-all duration-200 disabled:opacity-50 cursor-pointer"
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
          className="flex-1 py-3 bg-[#0891B2] text-white rounded-xl font-semibold text-sm hover:bg-[#0E7490] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(8,145,178,0.2)] cursor-pointer"
        >
          {busy && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
          {busy ? 'Saving…' : nextLabel}
        </button>
      </div>
    </div>
  );
}

type Step = 'info' | 'sectionA' | 'odi' | 'sectionB';

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const [step, setStep]                 = useState<Step>('info');
  const [info, setInfo]                 = useState<{ name: string; dob: string; date: string } | null>(null);
  const [bodyMapImage, setBodyMapImage] = useState<string | null>(null);
  const [sectionAAnswers, setSectionAAnswers] = useState<Record<string, string>>({});
  const [odiAnswers, setOdiAnswers]     = useState<Record<string, number>>({});
  const [phq9Answers, setPhq9Answers]   = useState<Record<string, number>>({});
  const [phq9Difficulty, setPhq9Difficulty] = useState('');
  const [gad7Answers, setGad7Answers]   = useState<Record<string, number>>({});
  const [busy, setBusy]                 = useState(false);
  const [error, setError]               = useState<string | null>(null);

  async function submit() {
    if (!info) return;
    setBusy(true);
    setError(null);
    const { error: err, record } = await submitSubmission({
      name: info.name.trim(),
      dob: info.dob,
      date: info.date,
      bodyMapImage,
      sectionAAnswers,
      odiAnswers,
      phq9Answers,
      phq9Difficulty,
      gad7Answers,
    });
    setBusy(false);
    if (err || !record) {
      setError('Could not save your answers. Please check your connection and try again.');
      return;
    }
    navigate('/thank-you', { state: { record } });
  }

  return (
    <div className="min-h-screen bg-[#F0FDFA] font-sans">
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-10 border-b border-[#CCFBF1]">
        <div className="h-1 bg-[#0891B2]" />
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0891B2] flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(8,145,178,0.3)]">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#134E4A] leading-none">Pain Doc Rotorua</p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5 tracking-wide font-medium">Patient Assessment Portal</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">
        {step === 'info' && (
          <InfoStep onNext={i => { setInfo(i); setStep('sectionA'); }} />
        )}
        {step === 'sectionA' && (
          <SectionAStep
            answers={sectionAAnswers}
            setAnswers={setSectionAAnswers}
            bodyMapImage={bodyMapImage}
            setBodyMapImage={setBodyMapImage}
            onBack={() => setStep('info')}
            onNext={() => setStep('odi')}
          />
        )}
        {step === 'odi' && (
          <ScaleStep
            questions={ODI_QUESTIONS}
            answers={odiAnswers}
            setAnswers={setOdiAnswers}
            title="Oswestry Disability Index"
            onBack={() => setStep('sectionA')}
            onNext={() => setStep('sectionB')}
            nextLabel="Continue to Section B →"
            stepKey="odi"
          />
        )}
        {step === 'sectionB' && (
          <div className="max-w-lg mx-auto">
            <StepIndicator current="sectionB" />
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#134E4A] mb-1.5">Section B — How you have been feeling</h2>
              <p className="text-[#64748B] text-sm leading-relaxed">
                There are no right or wrong answers — your immediate reaction is usually the most accurate.
                Over the last 2 weeks, how often have you been bothered by each problem?
              </p>
            </div>
            <ScaleGroup title="PHQ-9" questions={PHQ9_QUESTIONS} answers={phq9Answers} setAnswers={setPhq9Answers} />

            <Card className="mt-3">
              <div className="px-4 py-3 border-b border-[#E8F1F6]">
                <p className="text-xs font-semibold text-[#134E4A] leading-snug">
                  If you ticked any problems above, how difficult have they made your day-to-day life?
                </p>
              </div>
              <div className="p-3">
                <SegmentedScale
                  opts={PHQ9_DIFFICULTY_OPTIONS}
                  selected={PHQ9_DIFFICULTY_OPTIONS.indexOf(phq9Difficulty)}
                  onSelect={i => setPhq9Difficulty(PHQ9_DIFFICULTY_OPTIONS[i])}
                />
              </div>
            </Card>

            <div className="h-4" />
            <ScaleGroup title="GAD-7" questions={GAD7_QUESTIONS} answers={gad7Answers} setAnswers={setGad7Answers} />

            {error && (
              <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}

            <div className="flex gap-3 mt-5 mb-10">
              <button
                onClick={() => setStep('odi')}
                disabled={busy}
                className="px-5 py-3 rounded-xl border-2 border-[#CCFBF1] text-[#64748B] text-sm font-semibold hover:bg-[#F0FDFA] hover:border-[#CBD5E1] transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                ← Back
              </button>
              <button
                disabled={busy}
                onClick={() => {
                  const missing = [...PHQ9_QUESTIONS, ...GAD7_QUESTIONS].filter(
                    q => (PHQ9_QUESTIONS.includes(q) ? phq9Answers : gad7Answers)[q.id] === undefined
                  );
                  if (missing.length) { alert(`Please answer all questions (${missing.length} remaining).`); return; }
                  submit();
                }}
                className="flex-1 py-3 bg-[#0891B2] text-white rounded-xl font-semibold text-sm hover:bg-[#0E7490] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(8,145,178,0.2)] cursor-pointer"
              >
                {busy && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {busy ? 'Saving…' : 'Submit questionnaire'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-8">
        <div className="border-t border-[#E8F1F6] pt-4">
          <p className="text-xs text-[#94A3B8] text-center leading-relaxed">
            © Dr. Ian Wallbridge — Pain Doc Rotorua
            <span className="mx-2">·</span>
            These tools do not substitute for the informed opinion of a licensed physician.
          </p>
        </div>
      </div>
    </div>
  );
}

function ScaleGroup({
  title,
  questions,
  answers,
  setAnswers,
}: {
  title: string;
  questions: typeof PHQ9_QUESTIONS;
  answers: Record<string, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-[#0891B2] uppercase tracking-widest mb-2.5">{title}</p>
      <div className="space-y-2.5">
        {questions.map((q, i) => (
          <Card key={q.id}>
            <div className="px-4 py-2.5 border-b border-[#E8F1F6]">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Q{i + 1}</p>
              <p className="text-sm font-semibold text-[#134E4A] leading-snug">{q.text}</p>
            </div>
            <div className="p-3">
              <SegmentedScale
                opts={q.opts}
                selected={answers[q.id]}
                onSelect={i => setAnswers(prev => ({ ...prev, [q.id]: i }))}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
