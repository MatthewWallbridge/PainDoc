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
    <div className="bg-[#F0FDFA] rounded-2xl p-4 border border-[#CCFBF1]">
      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-bold text-[#134E4A] leading-none mb-2">{value}</p>
      {badge && <div className="mb-1">{badge}</div>}
      {sub && <p className="text-xs text-[#94A3B8]">{sub}</p>}
    </div>
  );
}
