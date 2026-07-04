export interface PatientRecord {
  id: string;
  createdAt: string;
  name: string;
  dob: string;
  date: string;
  bodyMapImage: string | null;
  sectionAAnswers: Record<string, string>;
  odiScore: number;
  odiAnswers: Record<string, number>;
  phq9: number;
  phq9Answers: Record<string, number>;
  phq9Difficulty: string;
  gad7: number;
  gad7Answers: Record<string, number>;
}

export interface PatientInfo {
  name: string;
  dob: string;
  date: string;
}

export interface ODIQuestion {
  id: string;
  text: string;
  subtitle?: string;
  opts: string[];
  optional?: boolean;
}

export interface ScaleQuestion {
  id: string;
  text: string;
  opts: string[];
}

export type SectionAFieldType = 'text' | 'textarea' | 'number' | 'chips';

export interface SectionAField {
  id: string;
  label: string;
  subtitle?: string;
  type: SectionAFieldType;
  placeholder?: string;
  options?: string[];
  optional?: boolean;
}

export interface SectionAQuestion {
  id: string;
  number: number;
  title: string;
  fields: SectionAField[];
}

export interface ScoreCategory {
  label: string;
  color: string;
}

export interface MSKLetter {
  recipients: string;
  diagnosis: string;
  analysis: string;
  history: string;
  investigations: string;
  examination: string;
  treatment: string;
  exercise: string;
  plan: string;
}

export interface NoteEntry {
  id: string;
  savedAt: string;
  patientName: string;
  dob: string;
  visitDate: string;
  letter: MSKLetter;
}
