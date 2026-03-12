import { ExtractedField, FieldConfig } from './types';

export const defaultFields: FieldConfig[] = [
  { id: 'f1', section: 'Study', name: 'Study Title', type: 'text', required: true, automationMode: 'AI Curated' },
  { id: 'f2', section: 'Demography', name: 'Country', type: 'location', required: true, automationMode: 'AI + Human' },
  { id: 'f3', section: 'Treatment Arms', name: 'Dose', type: 'text', required: true, automationMode: 'AI + Human' },
  { id: 'f4', section: 'Outcomes', name: 'ORR', type: 'percentage', required: true, automationMode: 'Human Only' },
];

export function buildMockExtraction(fields: FieldConfig[]): ExtractedField[] {
  return fields.map((field, index) => ({
    ...field,
    extractedValue: sampleValue(field.name),
    correctedValue: '',
    confidence: sampleConfidence(field.automationMode, index),
    evidence: sampleEvidence(field.name),
    pageRef: `Page ${index + 2}`,
    reviewStatus: 'Pending',
    comment: '',
  }));
}

function sampleValue(name: string): string {
  const values: Record<string, string> = {
    'Study Title': 'Phase II open-label study in metastatic NSCLC',
    Country: 'United States; Canada',
    Dose: 'Pembrolizumab 200 mg Q3W',
    ORR: '43%'
  };
  return values[name] ?? 'Sample extracted value';
}

function sampleEvidence(name: string): string {
  const evidence: Record<string, string> = {
    'Study Title': 'This phase II, multicenter, open-label trial evaluated efficacy and safety in metastatic NSCLC.',
    Country: 'Patients were enrolled across 18 sites in the United States and Canada.',
    Dose: 'Participants received pembrolizumab 200 mg every 3 weeks until progression.',
    ORR: 'The objective response rate was 43% in the efficacy-evaluable population.'
  };
  return evidence[name] ?? 'Evidence snippet from PDF text or table.';
}

function sampleConfidence(mode: string, index: number): number {
  if (mode === 'AI Curated') return 94 - index;
  if (mode === 'AI + Human') return 82 - index;
  return 61 - index;
}
