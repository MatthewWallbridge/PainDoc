const COLOR_MAP: Record<string, string> = {
  green:  'bg-emerald-50 text-emerald-700 ring-emerald-200',
  yellow: 'bg-amber-50  text-amber-700   ring-amber-200',
  orange: 'bg-orange-50 text-orange-700  ring-orange-200',
  red:    'bg-red-50    text-red-700     ring-red-200',
  rose:   'bg-rose-50   text-rose-700    ring-rose-200',
  blue:   'bg-blue-50   text-blue-700    ring-blue-200',
  slate:  'bg-slate-100 text-slate-600   ring-slate-200',
};

export default function ScoreBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ${COLOR_MAP[color] || COLOR_MAP.slate}`}>
      {children}
    </span>
  );
}
