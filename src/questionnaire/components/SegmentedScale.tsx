export default function SegmentedScale({
  opts,
  selected,
  onSelect,
}: {
  opts: string[];
  selected: number | undefined;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
      {opts.map((opt, i) => {
        const isSelected = selected === i;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(i)}
            className={`px-2 py-2 rounded-lg border-2 text-[11px] sm:text-xs font-semibold text-center leading-tight transition-all duration-200 cursor-pointer
              ${isSelected
                ? 'border-[#0891B2] bg-[#0891B2] text-white shadow-[0_2px_8px_rgba(8,145,178,0.3)]'
                : 'border-[#CCFBF1] bg-white text-[#64748B] hover:border-[#A5F3FC] hover:bg-[#ECFEFF]'
              }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
