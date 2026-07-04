import type { SectionAField as SectionAFieldType } from '../../lib/types';

export default function SectionAField({
  field,
  value,
  onChange,
}: {
  field: SectionAFieldType;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#134E4A] mb-1">
        {field.label}
        {field.optional && <span className="ml-2 text-xs font-normal text-[#94A3B8]">optional</span>}
      </label>
      {field.subtitle && <p className="text-xs text-[#94A3B8] mb-1.5">{field.subtitle}</p>}

      {field.type === 'text' && (
        <input
          type="text"
          value={value}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border-2 border-[#CCFBF1] bg-white text-[#134E4A] text-sm focus:outline-none focus:border-[#0891B2] focus:ring-4 focus:ring-[#ECFEFF] transition"
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          value={value}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl border-2 border-[#CCFBF1] bg-white text-[#134E4A] text-sm focus:outline-none focus:border-[#0891B2] focus:ring-4 focus:ring-[#ECFEFF] transition resize-y"
        />
      )}

      {field.type === 'number' && (
        <input
          type="number"
          min={0}
          max={10}
          value={value}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
          className="w-24 px-4 py-2.5 rounded-xl border-2 border-[#CCFBF1] bg-white text-[#134E4A] text-sm focus:outline-none focus:border-[#0891B2] focus:ring-4 focus:ring-[#ECFEFF] transition"
        />
      )}

      {field.type === 'chips' && (
        <div className="flex flex-wrap gap-2">
          {(field.options || []).map(opt => {
            const tags = value ? value.split(',').filter(Boolean) : [];
            const selected = tags.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const next = selected ? tags.filter(t => t !== opt) : [...tags, opt];
                  onChange(next.join(','));
                }}
                className={`px-3 py-1.5 rounded-lg border-2 text-xs font-semibold transition ${selected ? 'border-[#0891B2] bg-[#0891B2] text-white' : 'border-[#CCFBF1] bg-white text-[#64748B] hover:border-[#A5F3FC]'}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
