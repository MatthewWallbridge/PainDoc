export default function RadioOption({
  label,
  score,
  selected,
  onClick,
}: {
  label: string;
  score: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 flex items-start gap-3 group
        ${selected
          ? 'border-[#0B5E47] bg-[#0B5E47] text-white shadow-sm'
          : 'border-[#E2E8E6] bg-white hover:border-[#B0D8CC] hover:bg-[#F5FAF8] text-[#374845]'
        }`}
    >
      <span className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
        ${selected ? 'border-white bg-white' : 'border-[#C5D4D0] group-hover:border-[#0B5E47]'}`}>
        {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#0B5E47] block" />}
      </span>
      <span className="flex-1 text-sm leading-relaxed">{label}</span>
      <span className={`text-xs font-mono mt-0.5 flex-shrink-0 ${selected ? 'text-white/50' : 'text-[#BDCBC8]'}`}>{score}</span>
    </button>
  );
}
