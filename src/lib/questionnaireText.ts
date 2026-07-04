import type { PatientRecord } from './types';
import { SECTION_A_QUESTIONS, phq9Category, gad7Category, odiCategory, PHQ9_QUESTIONS } from './assessments';

function ageFromDob(dob: string): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 130 ? age : null;
}

/**
 * De-identified plain-text summary of a questionnaire submission, formatted as
 * source material for the msk-letter prompt. The patient's name is deliberately
 * excluded (the letter never carries it); age is derived from DOB instead.
 */
export function questionnaireToText(record: PatientRecord | Omit<PatientRecord, 'id' | 'createdAt'>): string {
  const lines: string[] = [];

  const age = ageFromDob(record.dob);
  if (age !== null) lines.push(`Patient age: ${age}`);
  lines.push('');
  lines.push('SECTION A (patient\'s own words):');

  for (const q of SECTION_A_QUESTIONS) {
    const answers = q.fields
      .map(f => ({ f, val: (record.sectionAAnswers[f.id] || '').trim() }))
      .filter(a => a.val);
    if (!answers.length) continue;
    if (answers.length === 1 && q.fields.length === 1) {
      lines.push(`${q.number}. ${q.title} — ${answers[0].val}`);
    } else {
      lines.push(`${q.number}. ${q.title}`);
      for (const a of answers) lines.push(`   - ${a.f.label}: ${a.val}`);
    }
  }

  if (record.bodyMapImage) {
    lines.push('');
    lines.push('(The patient also completed a body-map drawing showing pain location/character — attached in the clinical record.)');
  }

  lines.push('');
  lines.push('SECTION B & OUTCOME SCORES (derived scores only):');
  lines.push(`Oswestry Disability Index (ODI): ${record.odiScore}% (${odiCategory(record.odiScore).label})`);
  lines.push(`PHQ-9: ${record.phq9}/27 (${phq9Category(record.phq9).label})`);
  const item9 = record.phq9Answers[PHQ9_QUESTIONS[8].id];
  if (item9 !== undefined && item9 > 0) {
    lines.push(`ALERT — PHQ-9 item 9 (self-harm/suicidal ideation) is POSITIVE (scored ${item9}/3). Surface this to the physician's attention.`);
  }
  if (record.phq9Difficulty) lines.push(`PHQ-9 functional difficulty: ${record.phq9Difficulty}`);
  lines.push(`GAD-7: ${record.gad7}/21 (${gad7Category(record.gad7).label})`);

  return lines.join('\n');
}
