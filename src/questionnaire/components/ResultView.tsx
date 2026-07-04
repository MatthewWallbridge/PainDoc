import type { PatientRecord } from '../../lib/types';
import { ODI_QUESTIONS, PHQ9_QUESTIONS, GAD7_QUESTIONS, SECTION_A_QUESTIONS, odiCategory, phq9Category, gad7Category } from '../../lib/assessments';
import MetricCard from './MetricCard';
import ScoreBadge from './ScoreBadge';

function ScaleResponses({ title, questions, answers }: { title: string; questions: typeof PHQ9_QUESTIONS; answers: Record<string, number> }) {
  return (
    <div className="bg-white rounded-2xl border border-[#CCFBF1] shadow-[0_2px_10px_rgba(8,145,178,0.06)] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E8F1F6]">
        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{title} responses</p>
      </div>
      <div className="divide-y divide-[#E8F1F6]">
        {questions.map(q => {
          const val = answers[q.id];
          return (
            <div key={q.id} className="px-5 py-3 flex items-start justify-between gap-4">
              <p className="text-sm text-[#64748B] flex-1">{q.text}</p>
              <p className="text-sm text-[#134E4A] text-right flex-shrink-0">
                {val !== undefined ? q.opts[val] : <span className="text-[#CBD5E1]">Not answered</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionAResponses({ record }: { record: PatientRecord | Omit<PatientRecord, 'id' | 'createdAt'> }) {
  return (
    <div className="bg-white rounded-2xl border border-[#CCFBF1] shadow-[0_2px_10px_rgba(8,145,178,0.06)] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E8F1F6]">
        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Section A — Pain history</p>
      </div>

      {record.bodyMapImage && (
        <div className="p-5 border-b border-[#E8F1F6]">
          <img src={record.bodyMapImage} alt="Patient body map" className="w-full rounded-xl border border-[#CCFBF1]" />
        </div>
      )}

      <div className="divide-y divide-[#E8F1F6]">
        {SECTION_A_QUESTIONS.map(q => (
          <div key={q.id} className="px-5 py-3">
            <p className="text-xs font-semibold text-[#94A3B8] mb-1.5">{q.number}. {q.title}</p>
            <div className="space-y-1">
              {q.fields.map(f => {
                const val = record.sectionAAnswers[f.id];
                if (!val) return null;
                return (
                  <p key={f.id} className="text-sm text-[#134E4A]">
                    {q.fields.length > 1 && <span className="text-[#94A3B8]">{f.label}: </span>}
                    {val}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultView({ record }: { record: PatientRecord | Omit<PatientRecord, 'id' | 'createdAt'> }) {
  const rec = record as PatientRecord;
  const odiCat  = odiCategory(rec.odiScore);
  const phq9Cat = phq9Category(rec.phq9);
  const gad7Cat = gad7Category(rec.gad7);

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <MetricCard label="ODI"    value={`${rec.odiScore}%`} badge={<ScoreBadge color={odiCat.color}>{odiCat.label}</ScoreBadge>} />
        <MetricCard label="PHQ-9"  value={`${rec.phq9}`} sub="/27" badge={<ScoreBadge color={phq9Cat.color}>{phq9Cat.label}</ScoreBadge>} />
        <MetricCard label="GAD-7"  value={`${rec.gad7}`} sub="/21" badge={<ScoreBadge color={gad7Cat.color}>{gad7Cat.label}</ScoreBadge>} />
      </div>

      <div className="mb-4">
        <SectionAResponses record={record} />
      </div>

      <div className="bg-white rounded-2xl border border-[#CCFBF1] shadow-[0_2px_10px_rgba(8,145,178,0.06)] overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-[#E8F1F6] flex items-center justify-between">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">ODI responses</p>
          <p className="text-xs text-[#94A3B8]">Score {rec.odiScore}%</p>
        </div>
        <div className="divide-y divide-[#E8F1F6]">
          {ODI_QUESTIONS.map(q => (
            <div key={q.id} className="px-5 py-3 flex items-start justify-between gap-4">
              <p className="text-sm text-[#64748B] flex-shrink-0 w-28">{q.text}</p>
              <p className="text-sm text-[#134E4A] text-right">
                {rec.odiAnswers[q.id] !== undefined
                  ? q.opts[rec.odiAnswers[q.id]]
                  : <span className="text-[#CBD5E1]">Not answered</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <ScaleResponses title="PHQ-9" questions={PHQ9_QUESTIONS} answers={rec.phq9Answers} />
        {rec.phq9Difficulty && (
          <p className="text-xs text-[#64748B] px-1 -mt-2">
            Functional difficulty from the above: <span className="font-semibold text-[#134E4A]">{rec.phq9Difficulty}</span>
          </p>
        )}
        <ScaleResponses title="GAD-7" questions={GAD7_QUESTIONS} answers={rec.gad7Answers} />
      </div>
    </>
  );
}
