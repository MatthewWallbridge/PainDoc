const STEPS = [
  { key: 'info',   label: 'Details'   },
  { key: 'odi',    label: 'Back Pain' },
  { key: 'hads',   label: 'Mood'      },
  { key: 'result', label: 'Done'      },
];
const IDX: Record<string, number> = { info: 0, odi: 1, hads: 2, result: 3 };

export default function StepIndicator({ current }: { current: string }) {
  const cur = IDX[current] ?? 0;
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, i) => {
        const done   = i < cur;
        const active = i === cur;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${done   ? 'bg-[#0B5E47] text-white'
                : active ? 'bg-[#0B5E47] text-white ring-4 ring-[#E6F3EE]'
                :          'bg-[#E8EDEC] text-[#9BADA9]'}`}>
                {done
                  ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  : i + 1}
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap tracking-wide transition-colors
                ${active ? 'text-[#0B5E47]' : done ? 'text-[#6B7E7A]' : 'text-[#BDCBC8]'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 sm:w-14 h-0.5 mb-4 mx-1 rounded-full transition-all duration-500 ${i < cur ? 'bg-[#0B5E47]' : 'bg-[#E2E8E6]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
