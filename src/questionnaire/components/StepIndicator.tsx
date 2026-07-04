const STEPS = [
  { key: 'info',     label: 'Details'   },
  { key: 'sectionA', label: 'Your Pain' },
  { key: 'odi',      label: 'Back Pain' },
  { key: 'sectionB', label: 'Mood'      },
  { key: 'result',   label: 'Done'      },
];
const IDX: Record<string, number> = { info: 0, sectionA: 1, odi: 2, sectionB: 3, result: 4 };

export default function StepIndicator({ current }: { current: string }) {
  const cur = IDX[current] ?? 0;
  return (
    <div className="flex items-center justify-center mb-6">
      {STEPS.map((step, i) => {
        const done   = i < cur;
        const active = i === cur;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${done   ? 'bg-[#0891B2] text-white shadow-[0_2px_6px_rgba(8,145,178,0.35)]'
                : active ? 'bg-[#0891B2] text-white ring-4 ring-[#ECFEFF] shadow-[0_2px_6px_rgba(8,145,178,0.35)]'
                :          'bg-[#E8F1F6] text-[#94A3B8]'}`}>
                {done
                  ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  : i + 1}
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap tracking-wide transition-colors duration-200
                ${active ? 'text-[#0891B2]' : done ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 sm:w-12 h-0.5 mb-4 mx-1 rounded-full transition-all duration-500 ${i < cur ? 'bg-[#0891B2]' : 'bg-[#CCFBF1]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
