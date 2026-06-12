export default function MetricCard({
  label,
  value,
  sub,
  badge,
}: {
  label: string;
  value: string;
  sub?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="bg-[#F4F3EF] rounded-2xl p-4 border border-[#E2E8E6]">
      <p className="text-[10px] font-bold text-[#BDCBC8] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-bold text-[#1A2623] leading-none mb-2">{value}</p>
      {badge && <div className="mb-1">{badge}</div>}
      {sub && <p className="text-xs text-[#9BADA9]">{sub}</p>}
    </div>
  );
}
