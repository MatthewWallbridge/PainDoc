import type { PatientRecord } from '../../lib/types';
import { ODI_QUESTIONS, HADS_QUESTIONS, odiCategory, hadsCategory } from '../../lib/assessments';
import MetricCard from './MetricCard';
import ScoreBadge from './ScoreBadge';

export default function ResultView({ record }: { record: PatientRecord | Omit<PatientRecord, 'id' | 'createdAt'> }) {
  const rec = record as PatientRecord;
  const odiCat   = odiCategory(rec.odiScore);
  const hadsCatA = hadsCategory(rec.hads.a);
  const hadsCatD = hadsCategory(rec.hads.d);

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <MetricCard label="ODI"        value={`${rec.odiScore}%`} badge={<ScoreBadge color={odiCat.color}>{odiCat.label}</ScoreBadge>} />
        <MetricCard label="Anxiety"    value={`${rec.hads.a}`}    sub="/21" badge={<ScoreBadge color={hadsCatA.color}>{hadsCatA.label}</ScoreBadge>} />
        <MetricCard label="Depression" value={`${rec.hads.d}`}    sub="/21" badge={<ScoreBadge color={hadsCatD.color}>{hadsCatD.label}</ScoreBadge>} />
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8E6] shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-[#F0F5F3] flex items-center justify-between">
          <p className="text-[10px] font-bold text-[#BDCBC8] uppercase tracking-widest">ODI responses</p>
          <p className="text-xs text-[#9BADA9]">Score {rec.odiScore}%</p>
        </div>
        <div className="divide-y divide-[#F0F5F3]">
          {ODI_QUESTIONS.map(q => (
            <div key={q.id} className="px-5 py-3 flex items-start justify-between gap-4">
              <p className="text-sm text-[#6B7E7A] flex-shrink-0 w-28">{q.text}</p>
              <p className="text-sm text-[#1A2623] text-right">
                {rec.odiAnswers[q.id] !== undefined
                  ? q.opts[rec.odiAnswers[q.id]]
                  : <span className="text-[#C5D4D0]">Not answered</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8E6] shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-[#F0F5F3] flex items-center justify-between">
          <p className="text-[10px] font-bold text-[#BDCBC8] uppercase tracking-widest">HADS responses</p>
          <p className="text-xs text-[#9BADA9]">A {rec.hads.a} · D {rec.hads.d}</p>
        </div>
        <div className="divide-y divide-[#F0F5F3]">
          {HADS_QUESTIONS.map(q => {
            const val = rec.hadsAnswers[q.id];
            return (
              <div key={q.id} className="px-5 py-3 flex items-start justify-between gap-4">
                <div className="flex-shrink-0 w-36">
                  <span className={`text-xs font-semibold ${q.type === 'A' ? 'text-violet-500' : 'text-blue-500'}`}>
                    {q.type === 'A' ? 'Anxiety' : 'Depression'}
                  </span>
                  <p className="text-sm text-[#6B7E7A] mt-0.5 leading-snug">{q.text}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#1A2623]">
                    {val !== undefined ? q.opts[val] : <span className="text-[#C5D4D0]">Not answered</span>}
                  </p>
                  {val !== undefined && <p className="text-xs text-[#9BADA9] font-mono">+{q.scores[val]}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
