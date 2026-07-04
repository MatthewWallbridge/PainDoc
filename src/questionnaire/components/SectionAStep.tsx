import { SECTION_A_QUESTIONS, sectionARequiredFieldIds } from '../../lib/assessments';
import StepIndicator from './StepIndicator';
import BodyMap from './BodyMap';
import SectionAField from './SectionAField';

export default function SectionAStep({
  answers,
  setAnswers,
  bodyMapImage,
  setBodyMapImage,
  onBack,
  onNext,
}: {
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  bodyMapImage: string | null;
  setBodyMapImage: (v: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const requiredIds = sectionARequiredFieldIds();

  function setField(id: string, v: string) {
    setAnswers(prev => ({ ...prev, [id]: v }));
  }

  function handleNext() {
    const missing = requiredIds.filter(id => !(answers[id] || '').trim());
    if (missing.length) {
      alert(`Please answer all required questions (${missing.length} remaining).`);
      return;
    }
    onNext();
  }

  return (
    <div className="max-w-lg mx-auto">
      <StepIndicator current="sectionA" />

      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#134E4A] mb-1.5">Section A — Your Pain</h2>
        <p className="text-[#64748B] text-sm leading-relaxed">
          Please answer for how things are around now — short notes are perfect, there's no need to write a lot.
        </p>
      </div>

      <div className="mb-4 bg-white rounded-2xl border border-[#CCFBF1] shadow-[0_2px_10px_rgba(8,145,178,0.06)] p-4">
        <p className="text-sm font-semibold text-[#134E4A] mb-1">Draw on the picture where it hurts</p>
        <p className="text-xs text-[#94A3B8] mb-3">
          Choose a pen for the type of pain, then draw on the body outline. If you can't fill in the rest of this form, this picture alone is still very helpful.
        </p>
        <BodyMap value={bodyMapImage} onChange={setBodyMapImage} />
      </div>

      <div className="space-y-3">
        {SECTION_A_QUESTIONS.map(q => (
          <div key={q.id} className="bg-white rounded-2xl border border-[#CCFBF1] shadow-[0_2px_10px_rgba(8,145,178,0.06)] p-4">
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Question {q.number}</p>
            <p className="text-sm font-semibold text-[#134E4A] mb-2.5">{q.title}</p>
            <div className="space-y-3">
              {q.fields.map(field => (
                <SectionAField
                  key={field.id}
                  field={field}
                  value={answers[field.id] || ''}
                  onChange={v => setField(field.id, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-5 mb-10">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl border-2 border-[#CCFBF1] text-[#64748B] text-sm font-semibold hover:bg-[#F0FDFA] hover:border-[#CBD5E1] transition-all duration-200 cursor-pointer"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 bg-[#0891B2] text-white rounded-xl font-semibold text-sm hover:bg-[#0E7490] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(8,145,178,0.2)] cursor-pointer"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
