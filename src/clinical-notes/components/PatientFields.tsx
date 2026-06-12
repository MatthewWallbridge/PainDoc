interface PatientValues { name: string; dob: string; visitDate: string; }

export default function PatientFields({ values, onChange }: { values: PatientValues; onChange: (key: string, val: string) => void }) {
  const field = (key: keyof PatientValues, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-[10px] font-bold text-[#9BADA9] uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={values[key]}
        onChange={e => onChange(key, e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8E6] bg-[#F4F3EF] text-[#1A2623] text-sm focus:outline-none focus:border-[#0B5E47] focus:ring-2 focus:ring-[#0B5E47]/10 transition"
      />
    </div>
  );

  return (
    <div className="w-full max-w-2xl mb-4 bg-white rounded-2xl border border-[#E2E8E6] p-5 shadow-sm">
      <p className="text-[10px] font-bold text-[#9BADA9] uppercase tracking-widest mb-4">Patient Details</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {field('name',      'Patient Name', 'text', 'Full name')}
        {field('dob',       'Date of Birth', 'date')}
        {field('visitDate', 'Visit Date',    'date')}
      </div>
    </div>
  );
}
