export default function Avatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  const initials = name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const sz = size === 'lg' ? 'w-12 h-12 text-base' : 'w-9 h-9 text-sm';
  return (
    <div className={`${sz} rounded-full bg-[#0B5E47] text-white flex items-center justify-center font-semibold tracking-wide flex-shrink-0`}>
      {initials || '?'}
    </div>
  );
}
