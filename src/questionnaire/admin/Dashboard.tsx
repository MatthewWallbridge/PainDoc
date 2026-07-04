import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { loadRecords, deleteRecord } from '../../lib/supabase';
import { odiCategory, phq9Category, gad7Category } from '../../lib/assessments';
import type { PatientRecord } from '../../lib/types';
import ScoreBadge from '../components/ScoreBadge';
import Avatar from '../components/Avatar';
import AdminHeader from './AdminHeader';
import ApiKeyInput from '../../clinical-notes/components/ApiKeyInput';

type SortKey = 'name' | 'date' | 'odiScore' | 'phq9' | 'gad7';
type SortDir = 'asc' | 'desc';

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="text-gray-300 ml-1">↕</span>;
  return <span className="text-[#0891B2] ml-1">{dir === 'asc' ? '↑' : '↓'}</span>;
}

function Th({ label, field, sortKey, sortDir, onSort }: {
  label: string;
  field: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (f: SortKey) => void;
}) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 hover:bg-gray-50 select-none transition-colors whitespace-nowrap"
      onClick={() => onSort(field)}
    >
      {label}<SortIcon active={sortKey === field} dir={sortDir} />
    </th>
  );
}

export default function Dashboard() {
  const [records,       setRecords]       = useState<PatientRecord[] | null>(null);
  const [search,        setSearch]        = useState('');
  const [sortKey,       setSortKey]       = useState<SortKey>('date');
  const [sortDir,       setSortDir]       = useState<SortDir>('desc');
  const [deletePending, setDeletePending] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loadError,     setLoadError]     = useState<string | null>(null);
  const [apiKey,        setApiKey]        = useState(() => localStorage.getItem('paindoc_api_key') || '');

  function handleApiKey(val: string) {
    setApiKey(val);
    localStorage.setItem('paindoc_api_key', val);
  }

  function refresh() {
    setRecords(null);
    setLoadError(null);
    loadRecords()
      .then(setRecords)
      .catch(() => { setLoadError('Could not load records.'); setRecords([]); });
  }

  useEffect(() => {
    let active = true;
    loadRecords()
      .then(r  => { if (active) setRecords(r); })
      .catch(() => { if (active) { setLoadError('Could not load records.'); setRecords([]); } });
    return () => { active = false; };
  }, []);

  function handleSort(field: SortKey) {
    if (sortKey === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(field); setSortDir('desc'); }
  }

  async function handleDelete(id: string) {
    setDeleteLoading(true);
    try {
      await deleteRecord(id);
      setRecords(prev => (prev || []).filter(r => r.id !== id));
      setDeletePending(null);
    } catch {
      alert('Could not delete record. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  }

  const displayed = useMemo(() => {
    const filtered = (records || []).filter(r =>
      (r.name || '').toLowerCase().includes(search.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'name':       return dir * (a.name || '').localeCompare(b.name || '');
        case 'date':       return dir * (a.date || '').localeCompare(b.date || '');
        case 'odiScore':   return dir * (a.odiScore - b.odiScore);
        case 'phq9':       return dir * (a.phq9 - b.phq9);
        case 'gad7':       return dir * (a.gad7 - b.gad7);
        default: return 0;
      }
    });
  }, [records, search, sortKey, sortDir]);

  const thProps = { sortKey, sortDir, onSort: handleSort };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AdminHeader />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Submissions</h1>
            <p className="text-gray-500 text-sm mt-1">
              {loadError
                ? <span className="text-red-500">{loadError}</span>
                : records === null
                  ? 'Loading…'
                  : `${records.length} total record${records.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-4 self-start sm:self-auto">
            <button
              onClick={async () => {
                const { downloadPreamblePdf } = await import('../../pdf/PreamblePdf');
                await downloadPreamblePdf();
              }}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
              title="The 'Before Your First Consultation' letter — send this out with the questionnaire link"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Preamble letter (PDF)
            </button>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.13-1.13M20 15a9 9 0 01-14.13 1.13" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* API key — set once here, shared by Clinical Notes and pre-consultation letters */}
        <div className="mb-6">
          <ApiKeyInput value={apiKey} onChange={handleApiKey} />
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20 transition"
          />
        </div>

        {/* Loading */}
        {records === null && (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#0891B2]/20 border-t-[#0891B2] rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {records !== null && displayed.length === 0 && (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              {records.length === 0
                ? 'No submissions yet. Submit a patient questionnaire to get started.'
                : 'No results match your search.'}
            </p>
          </div>
        )}

        {/* Table — desktop */}
        {records !== null && displayed.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_10px_rgba(8,145,178,0.06)] overflow-hidden">
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <Th label="Patient"    field="name"       {...thProps} />
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Date of Birth</th>
                    <Th label="Assessed"   field="date"       {...thProps} />
                    <Th label="ODI"    field="odiScore" {...thProps} />
                    <Th label="PHQ-9"  field="phq9"     {...thProps} />
                    <Th label="GAD-7"  field="gad7"     {...thProps} />
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayed.map(record => {
                    const odiCat  = odiCategory(record.odiScore);
                    const phq9Cat = phq9Category(record.phq9);
                    const gad7Cat = gad7Category(record.gad7);
                    const isPending = deletePending === record.id;
                    return (
                      <tr key={record.id} className={`hover:bg-gray-50 transition-colors ${isPending ? 'bg-red-50' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={record.name} />
                            <span className="text-sm font-semibold text-gray-900">{record.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{record.dob || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{record.date || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <ScoreBadge color={odiCat.color}>ODI {record.odiScore}%</ScoreBadge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <ScoreBadge color={phq9Cat.color}>{record.phq9} — {phq9Cat.label}</ScoreBadge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <ScoreBadge color={gad7Cat.color}>{record.gad7} — {gad7Cat.label}</ScoreBadge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs text-gray-600">Delete this record?</span>
                              <button onClick={() => setDeletePending(null)} className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors">Cancel</button>
                              <button
                                onClick={() => handleDelete(record.id)}
                                disabled={deleteLoading}
                                className="text-xs text-red-600 hover:text-red-700 font-bold transition-colors disabled:opacity-50"
                              >
                                {deleteLoading ? 'Deleting…' : 'Confirm'}
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-3">
                              <Link
                                to={`/admin/submissions/${record.id}`}
                                className="text-xs font-semibold text-[#0891B2] hover:text-[#0E7490] transition-colors"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => setDeletePending(record.id)}
                                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="lg:hidden divide-y divide-gray-100">
              {displayed.map(record => {
                const odiCat  = odiCategory(record.odiScore);
                const phq9Cat = phq9Category(record.phq9);
                const gad7Cat = gad7Category(record.gad7);
                const isPending = deletePending === record.id;
                return (
                  <div key={record.id} className={`p-4 ${isPending ? 'bg-red-50' : ''}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar name={record.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{record.name}</p>
                        <p className="text-xs text-gray-400">{record.date || '—'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <ScoreBadge color={odiCat.color}>ODI {record.odiScore}%</ScoreBadge>
                      <ScoreBadge color={phq9Cat.color}>PHQ-9 {record.phq9}</ScoreBadge>
                      <ScoreBadge color={gad7Cat.color}>GAD-7 {record.gad7}</ScoreBadge>
                    </div>
                    {isPending ? (
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-600">Delete this record?</span>
                        <button onClick={() => setDeletePending(null)} className="text-gray-500 font-medium">Cancel</button>
                        <button onClick={() => handleDelete(record.id)} disabled={deleteLoading} className="text-red-600 font-bold disabled:opacity-50">{deleteLoading ? 'Deleting…' : 'Confirm'}</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Link to={`/admin/submissions/${record.id}`} className="text-xs font-semibold text-[#0891B2]">View details →</Link>
                        <button onClick={() => setDeletePending(record.id)} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Delete</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
