/* eslint-disable react-refresh/only-export-components */
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import type { PatientRecord } from '../lib/types';
import {
  ODI_QUESTIONS,
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  SECTION_A_QUESTIONS,
  odiCategory,
  phq9Category,
  gad7Category,
} from '../lib/assessments';

const C = {
  ink: '#134e4a',
  sub: '#64748b',
  faint: '#94a3b8',
  line: '#ccfbf1',
  panel: '#f0fdfa',
  brand: '#0891b2',
  green: '#047857',
  yellow: '#b45309',
  orange: '#c2410c',
  red: '#b91c1c',
  rose: '#be123c',
};

function catColor(color: string): string {
  return (C as Record<string, string>)[color] || C.sub;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontSize: 10,
    color: C.ink,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.brand },
  subtitle: { fontSize: 9, color: C.brand, marginTop: 2 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    paddingBottom: 12,
    marginBottom: 20,
  },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  metaCell: { width: '50%', marginBottom: 8 },
  metaLabel: { fontSize: 7.5, color: C.faint, textTransform: 'uppercase', letterSpacing: 0.5 },
  metaValue: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginTop: 1 },
  scoreRow: { flexDirection: 'row', gap: 12, marginBottom: 26 },
  scoreCard: {
    flex: 1,
    backgroundColor: C.panel,
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: C.line,
  },
  scoreLabel: { fontSize: 7.5, color: C.faint, textTransform: 'uppercase', letterSpacing: 0.5 },
  scoreValue: { fontSize: 22, fontFamily: 'Helvetica-Bold', marginTop: 4 },
  scoreCat: { fontSize: 9, marginTop: 6, fontFamily: 'Helvetica-Bold' },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 8, marginTop: 10 },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    paddingVertical: 6,
  },
  qCell: { width: '38%', color: C.sub, paddingRight: 8 },
  aCell: { width: '54%', color: C.ink },
  sCell: { width: '8%', textAlign: 'right', color: C.faint, fontFamily: 'Helvetica-Bold' },
  tag: { fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  bodyMapImg: { width: '100%', maxHeight: 220, objectFit: 'contain', marginBottom: 16 },
  sectionAItem: { borderBottomWidth: 1, borderBottomColor: C.line, paddingVertical: 6 },
  sectionAQuestion: { fontSize: 8, color: C.faint, marginBottom: 2 },
  sectionAAnswer: { fontSize: 9.5, color: C.ink, marginBottom: 1 },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 44,
    right: 44,
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 8,
    fontSize: 7.5,
    color: C.faint,
    textAlign: 'center',
  },
});

function PatientPdfDocument({ record, generatedAt }: { record: PatientRecord; generatedAt: string }) {
  const odiCat = odiCategory(record.odiScore);
  const phq9Cat = phq9Category(record.phq9);
  const gad7Cat = gad7Category(record.gad7);

  return (
    <Document
      title={`Pain Doc Rotorua — Assessment — ${record.name}`}
      author="Pain Doc Rotorua"
      subject="Section A, ODI, PHQ-9 & GAD-7 questionnaire results"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Patient Assessment Report</Text>
            <Text style={styles.subtitle}>
              Pain Doc Rotorua · Section A · Oswestry Disability Index · PHQ-9 · GAD-7
            </Text>
          </View>
          <Text style={{ fontSize: 8, color: C.faint }}>Generated {generatedAt}</Text>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Patient name</Text>
            <Text style={styles.metaValue}>{record.name || '—'}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Date of birth</Text>
            <Text style={styles.metaValue}>{record.dob || '—'}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Assessment date</Text>
            <Text style={styles.metaValue}>{record.date || '—'}</Text>
          </View>
        </View>

        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>ODI</Text>
            <Text style={styles.scoreValue}>{record.odiScore}%</Text>
            <Text style={[styles.scoreCat, { color: catColor(odiCat.color) }]}>{odiCat.label}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>PHQ-9</Text>
            <Text style={styles.scoreValue}>
              {record.phq9}<Text style={{ fontSize: 10, color: C.faint }}> /27</Text>
            </Text>
            <Text style={[styles.scoreCat, { color: catColor(phq9Cat.color) }]}>{phq9Cat.label}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>GAD-7</Text>
            <Text style={styles.scoreValue}>
              {record.gad7}<Text style={{ fontSize: 10, color: C.faint }}> /21</Text>
            </Text>
            <Text style={[styles.scoreCat, { color: catColor(gad7Cat.color) }]}>{gad7Cat.label}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Section A — Pain history</Text>
        {record.bodyMapImage && <Image src={record.bodyMapImage} style={styles.bodyMapImg} />}
        <View>
          {SECTION_A_QUESTIONS.map(q => {
            const rows = q.fields
              .map(f => ({ field: f, val: record.sectionAAnswers[f.id] }))
              .filter(r => r.val);
            if (!rows.length) return null;
            return (
              <View key={q.id} style={styles.sectionAItem} wrap={false}>
                <Text style={styles.sectionAQuestion}>{q.number}. {q.title}</Text>
                {rows.map(r => (
                  <Text key={r.field.id} style={styles.sectionAAnswer}>
                    {q.fields.length > 1 ? `${r.field.label}: ${r.val}` : r.val}
                  </Text>
                ))}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Oswestry Disability Index responses</Text>
        <View>
          {ODI_QUESTIONS.map(q => {
            const val = record.odiAnswers[q.id];
            return (
              <View key={q.id} style={styles.row} wrap={false}>
                <Text style={styles.qCell}>{q.text}</Text>
                <Text style={styles.aCell}>{val !== undefined ? q.opts[val] : 'Not answered'}</Text>
                <Text style={styles.sCell}>{val !== undefined ? val : '—'}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>PHQ-9 responses</Text>
        <View>
          {PHQ9_QUESTIONS.map(q => {
            const val = record.phq9Answers[q.id];
            return (
              <View key={q.id} style={styles.row} wrap={false}>
                <Text style={styles.qCell}>{q.text}</Text>
                <Text style={styles.aCell}>{val !== undefined ? q.opts[val] : 'Not answered'}</Text>
                <Text style={styles.sCell}>{val !== undefined ? val : '—'}</Text>
              </View>
            );
          })}
        </View>

        {record.phq9Difficulty && (
          <Text style={{ fontSize: 9, color: C.sub, marginTop: 4 }}>
            Functional difficulty from the above (PHQ-9): {record.phq9Difficulty}
          </Text>
        )}

        <Text style={styles.sectionTitle}>GAD-7 responses</Text>
        <View>
          {GAD7_QUESTIONS.map(q => {
            const val = record.gad7Answers[q.id];
            return (
              <View key={q.id} style={styles.row} wrap={false}>
                <Text style={styles.qCell}>{q.text}</Text>
                <Text style={styles.aCell}>{val !== undefined ? q.opts[val] : 'Not answered'}</Text>
                <Text style={styles.sCell}>{val !== undefined ? val : '—'}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.footer} fixed>
          © Dr. Ian Wallbridge. These tools do not substitute for the informed opinion of a licensed physician. All scores should be re-checked.{'\n'}
          Questionnaire v1 — July 2026 · Developed by Dr Ian Wallbridge
        </Text>
      </Page>
    </Document>
  );
}

function buildFileName(record: PatientRecord): string {
  const slug =
    (record.name || 'patient')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'patient';
  const date = (record.date || '').replace(/[^0-9-]/g, '') || 'report';
  return `${slug}-assessment-${date}.pdf`;
}

export async function downloadPatientPdf(record: PatientRecord): Promise<string> {
  const generatedAt = new Date().toLocaleString();
  const blob = await pdf(
    <PatientPdfDocument record={record} generatedAt={generatedAt} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const name = buildFileName(record);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return name;
}
