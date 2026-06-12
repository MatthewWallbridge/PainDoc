/* eslint-disable react-refresh/only-export-components */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import type { PatientRecord } from '../lib/types';
import {
  ODI_QUESTIONS,
  HADS_QUESTIONS,
  odiCategory,
  hadsCategory,
} from '../lib/assessments';

const C = {
  ink: '#0f172a',
  sub: '#64748b',
  faint: '#94a3b8',
  line: '#e2e8f0',
  panel: '#f8fafc',
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
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.green },
  subtitle: { fontSize: 9, color: C.green, marginTop: 2 },
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
  const hadsCatA = hadsCategory(record.hads.a);
  const hadsCatD = hadsCategory(record.hads.d);

  return (
    <Document
      title={`Pain Doc Rotorua — Assessment — ${record.name}`}
      author="Pain Doc Rotorua"
      subject="ODI & HADS questionnaire results"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Patient Assessment Report</Text>
            <Text style={styles.subtitle}>
              Pain Doc Rotorua · Oswestry Disability Index · Hospital Anxiety & Depression Scale
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
            <Text style={styles.scoreLabel}>HADS Anxiety</Text>
            <Text style={styles.scoreValue}>
              {record.hads.a}<Text style={{ fontSize: 10, color: C.faint }}> /21</Text>
            </Text>
            <Text style={[styles.scoreCat, { color: catColor(hadsCatA.color) }]}>{hadsCatA.label}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>HADS Depression</Text>
            <Text style={styles.scoreValue}>
              {record.hads.d}<Text style={{ fontSize: 10, color: C.faint }}> /21</Text>
            </Text>
            <Text style={[styles.scoreCat, { color: catColor(hadsCatD.color) }]}>{hadsCatD.label}</Text>
          </View>
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

        <Text style={styles.sectionTitle}>HADS responses</Text>
        <View>
          {HADS_QUESTIONS.map(q => {
            const val = record.hadsAnswers[q.id];
            return (
              <View key={q.id} style={styles.row} wrap={false}>
                <View style={styles.qCell}>
                  <Text style={[styles.tag, { color: q.type === 'A' ? '#7c3aed' : '#2563eb' }]}>
                    {q.type === 'A' ? 'ANXIETY' : 'DEPRESSION'}
                  </Text>
                  <Text style={{ color: C.sub }}>{q.text}</Text>
                </View>
                <Text style={styles.aCell}>{val !== undefined ? q.opts[val] : 'Not answered'}</Text>
                <Text style={styles.sCell}>{val !== undefined ? `+${q.scores[val]}` : '—'}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.footer} fixed>
          © Dr. Ian Wallbridge. These tools do not substitute for the informed opinion of a licensed physician. All scores should be re-checked.
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
