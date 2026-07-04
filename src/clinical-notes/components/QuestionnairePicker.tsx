import { useMemo, useState } from 'react';
import { FileText, Search, X } from 'lucide-react';
import { loadRecords } from '../../lib/supabase';
import type { PatientRecord } from '../../lib/types';

export default function QuestionnairePicker({
  selected,
  onSelect,
}: {
  selected: PatientRecord | null;
  onSelect: (record: PatientRecord | null) => void;
}) {
  const [records, setRecords] = useState<PatientRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState('');

  async function openPicker() {
    setOpen(true);
    setSearch('');
    if (records) return;
    setLoading(true);
    setError(null);
    try {
      setRecords(await loadRecords());
    } catch {
      setError('Could not load submissions — make sure you are logged in via the admin portal (Staff Login).');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    if (!records) return [];
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(r => (r.name || '').toLowerCase().includes(q));
  }, [records, search]);

  return (
    <div className="w-full max-w-2xl mb-4 bg-white rounded-2xl border border-[#CCFBF1] p-5 shadow-[0_2px_10px_rgba(8,145,178,0.06)]">
      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Pre-Consultation Questionnaire</p>

      {selected ? (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#ECFEFF] border border-[#A5F3FC]">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText size={15} className="text-[#0E7490] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0E7490] truncate">{selected.name}</p>
              <p className="text-[11px] text-[#0E7490]">
                Completed {selected.date || '—'} · ODI {selected.odiScore}% · PHQ-9 {selected.phq9} · GAD-7 {selected.gad7}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelect(null)}
            className="p-1.5 rounded-lg text-[#0E7490] hover:text-red-400 hover:bg-red-50 transition flex-shrink-0"
            title="Detach questionnaire"
          >
            <X size={15} />
          </button>
        </div>
      ) : !open ? (
        <button
          onClick={openPicker}
          className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-[#CBD5E1] text-[#64748B] text-sm font-semibold hover:border-[#0891B2] hover:text-[#0891B2] hover:bg-[#ECFEFF] transition"
        >
          Attach the patient's questionnaire (recommended — it is the spine of the history)
        </button>
      ) : (
        <div>
          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-[#0891B2]/20 border-t-[#0891B2] rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-xs text-red-500 py-2">{error}</p>}
          {records && records.length === 0 && (
            <p className="text-xs text-[#94A3B8] py-2">
              No questionnaire submissions found. If you expected some, log in via the admin portal (Staff Login) first — submissions are only visible to staff.
            </p>
          )}
          {records && records.length > 0 && (
            <>
              <div className="relative mb-2.5">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by patient name…"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#CCFBF1] bg-white text-sm text-[#134E4A] focus:outline-none focus:border-[#0891B2] focus:ring-4 focus:ring-[#ECFEFF] transition-all duration-200"
                />
              </div>
              {filtered.length === 0 ? (
                <p className="text-xs text-[#94A3B8] py-2">No patients match "{search}".</p>
              ) : (
                <div className="max-h-56 overflow-y-auto divide-y divide-[#E8F1F6] border border-[#CCFBF1] rounded-xl">
                  {filtered.map(r => (
                    <button
                      key={r.id}
                      onClick={() => { onSelect(r); setOpen(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#ECFEFF] transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-[#134E4A] truncate">{r.name}</span>
                      <span className="text-[11px] text-[#94A3B8] flex-shrink-0">{r.date || '—'} · ODI {r.odiScore}%</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          <button onClick={() => setOpen(false)} className="mt-3 text-xs text-[#94A3B8] hover:text-[#64748B] transition">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
