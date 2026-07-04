/* eslint-disable react-refresh/only-export-components */
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import {
  PREAMBLE_LETTERHEAD,
  PREAMBLE_TITLE,
  PREAMBLE_PARAGRAPHS,
  PREAMBLE_SIGNOFF,
  PREAMBLE_VERSION,
} from '../lib/preamble';

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 56,
    fontSize: 10.5,
    color: '#134e4a',
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  letterheadName: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#0891b2' },
  letterheadLine: { fontSize: 8.5, color: '#64748b', marginTop: 1.5 },
  headerBlock: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccfbf1',
    paddingBottom: 12,
    marginBottom: 22,
  },
  title: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 14 },
  paragraph: { marginBottom: 10 },
  signName: { fontFamily: 'Helvetica-Bold', marginTop: 16 },
  signRole: { color: '#64748b' },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 56,
    right: 56,
    borderTopWidth: 1,
    borderTopColor: '#ccfbf1',
    paddingTop: 8,
    fontSize: 7.5,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

function PreamblePdfDocument() {
  return (
    <Document title={`Pain Doc Rotorua — ${PREAMBLE_TITLE}`} author="Pain Doc Rotorua">
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBlock}>
          <Text style={styles.letterheadName}>{PREAMBLE_LETTERHEAD.name}</Text>
          <Text style={styles.letterheadLine}>{PREAMBLE_LETTERHEAD.qualifications}</Text>
          <Text style={styles.letterheadLine}>{PREAMBLE_LETTERHEAD.role}</Text>
          <Text style={styles.letterheadLine}>{PREAMBLE_LETTERHEAD.contact}</Text>
        </View>

        <Text style={styles.title}>{PREAMBLE_TITLE}</Text>

        {PREAMBLE_PARAGRAPHS.map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}

        <Text style={styles.signName}>{PREAMBLE_SIGNOFF.name}</Text>
        <Text style={styles.signRole}>{PREAMBLE_SIGNOFF.role}</Text>

        <Text style={styles.footer} fixed>{PREAMBLE_VERSION}</Text>
      </Page>
    </Document>
  );
}

export async function downloadPreamblePdf(): Promise<void> {
  const blob = await pdf(<PreamblePdfDocument />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'before-your-first-consultation.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
