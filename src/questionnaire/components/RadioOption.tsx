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
      className={`w-full text-left px-3.5 py-2.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-2.5 group cursor-pointer
        ${selected
          ? 'border-[#0891B2] bg-[#0891B2] text-white shadow-[0_2px_10px_rgba(8,145,178,0.25)]'
          : 'border-[#CCFBF1] bg-white hover:border-[#A5F3FC] hover:bg-[#ECFEFF] text-[#134E4A]'
        }`}
    >
      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
        ${selected ? 'border-white bg-white' : 'border-[#CBD5E1] group-hover:border-[#0891B2]'}`}>
        {selected && <span className="w-2 h-2 rounded-full bg-[#0891B2] block" />}
      </span>
      <span className="flex-1 text-sm leading-snug">{label}</span>
      <span className={`text-xs font-mono flex-shrink-0 ${selected ? 'text-white/50' : 'text-[#94A3B8]'}`}>{score}</span>
    </button>
  );
}
