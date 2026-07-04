import { createClient } from '@supabase/supabase-js';
import type { PatientRecord } from './types';
import { calcODI, calcScale } from './assessments';

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
    bodyMapImage: (row.body_map_image as string) || null,
    sectionAAnswers: (row.section_a_answers as Record<string, string>) || {},
    odiScore: (row.odi_score as number) ?? 0,
    odiAnswers: (row.odi_answers as Record<string, number>) || {},
    phq9: (row.phq9_score as number) ?? 0,
    phq9Answers: (row.phq9_answers as Record<string, number>) || {},
    phq9Difficulty: (row.phq9_difficulty as string) || '',
    gad7: (row.gad7_score as number) ?? 0,
    gad7Answers: (row.gad7_answers as Record<string, number>) || {},
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
  bodyMapImage: string | null;
  sectionAAnswers: Record<string, string>;
  odiAnswers: Record<string, number>;
  phq9Answers: Record<string, number>;
  phq9Difficulty: string;
  gad7Answers: Record<string, number>;
}): Promise<{ error: Error | null; record: Omit<PatientRecord, 'id' | 'createdAt'> | null }> {
  const odiScore = calcODI(params.odiAnswers);
  const phq9 = calcScale(params.phq9Answers);
  const gad7 = calcScale(params.gad7Answers);

  const payload = {
    patient_name: params.name,
    dob: params.dob || null,
    assessment_date: params.date || null,
    body_map_image: params.bodyMapImage,
    section_a_answers: params.sectionAAnswers,
    odi_answers: params.odiAnswers,
    odi_score: odiScore,
    phq9_answers: params.phq9Answers,
    phq9_score: phq9,
    phq9_difficulty: params.phq9Difficulty || null,
    gad7_answers: params.gad7Answers,
    gad7_score: gad7,
  };

  const { error } = await supabase.from('submissions').insert(payload);
  if (error) return { error: new Error(error.message), record: null };

  return {
    error: null,
    record: {
      name: params.name,
      dob: params.dob,
      date: params.date,
      bodyMapImage: params.bodyMapImage,
      sectionAAnswers: params.sectionAAnswers,
      odiScore,
      odiAnswers: params.odiAnswers,
      phq9,
      phq9Answers: params.phq9Answers,
      phq9Difficulty: params.phq9Difficulty,
      gad7,
      gad7Answers: params.gad7Answers,
    },
  };
}
