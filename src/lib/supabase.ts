import { createClient } from '@supabase/supabase-js';
import type { PatientRecord } from './types';
import { calcODI, calcHADS } from './assessments';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function fromRow(row: Record<string, unknown>): PatientRecord {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    name: (row.patient_name as string) || '',
    dob: (row.dob as string) || '',
    date: (row.assessment_date as string) || '',
    odiScore: (row.odi_score as number) ?? 0,
    odiAnswers: (row.odi_answers as Record<string, number>) || {},
    hads: {
      a: (row.hads_anxiety as number) ?? 0,
      d: (row.hads_depression as number) ?? 0,
    },
    hadsAnswers: (row.hads_answers as Record<string, number>) || {},
  };
}

export async function loadRecords(): Promise<PatientRecord[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function getRecord(id: string): Promise<PatientRecord | null> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return fromRow(data);
}

export async function deleteRecord(id: string): Promise<void> {
  const { error } = await supabase.from('submissions').delete().eq('id', id);
  if (error) throw error;
}

export async function submitSubmission(params: {
  name: string;
  dob: string;
  date: string;
  odiAnswers: Record<string, number>;
  hadsAnswers: Record<string, number>;
}): Promise<{ error: Error | null; record: Omit<PatientRecord, 'id' | 'createdAt'> | null }> {
  const odiScore = calcODI(params.odiAnswers);
  const { a, d } = calcHADS(params.hadsAnswers);

  const payload = {
    patient_name: params.name,
    dob: params.dob || null,
    assessment_date: params.date || null,
    odi_answers: params.odiAnswers,
    odi_score: odiScore,
    hads_answers: params.hadsAnswers,
    hads_anxiety: a,
    hads_depression: d,
  };

  const { error } = await supabase.from('submissions').insert(payload);
  if (error) return { error: new Error(error.message), record: null };

  return {
    error: null,
    record: {
      name: params.name,
      dob: params.dob,
      date: params.date,
      odiScore,
      odiAnswers: params.odiAnswers,
      hads: { a, d },
      hadsAnswers: params.hadsAnswers,
    },
  };
}
