export interface PatientRecord {
  id: string;
  createdAt: string;
  name: string;
  dob: string;
  date: string;
  odiScore: number;
  odiAnswers: Record<string, number>;
  hads: { a: number; d: number };
  hadsAnswers: Record<string, number>;
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

export interface HADSQuestion {
  id: string;
  type: 'A' | 'D';
  text: string;
  opts: string[];
  scores: number[];
}

export interface ScoreCategory {
  label: string;
  color: string;
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface NoteEntry {
  id: string;
  savedAt: string;
  patientName: string;
  dob: string;
  visitDate: string;
  soap: SOAPNote;
}
