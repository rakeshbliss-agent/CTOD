export type FieldType = 'text' | 'number' | 'percentage' | 'date' | 'location' | 'categorical';
export type AutomationMode = 'AI Curated' | 'AI + Human' | 'Human Only';
export type ReviewStatus = 'Pending' | 'Accepted' | 'Edited' | 'Rejected';

export interface FieldConfig {
  id: string;
  section: string;
  name: string;
  type: FieldType;
  required: boolean;
  automationMode: AutomationMode;
}

export interface ExtractedField extends FieldConfig {
  extractedValue: string;
  correctedValue?: string;
  confidence: number;
  evidence: string;
  pageRef: string;
  reviewStatus: ReviewStatus;
  comment?: string;
}

export interface Project {
  id: string;
  name: string;
  indication: string;
  templateName: string;
  pdfCount: number;
  status: 'Draft' | 'Configured' | 'Extraction Complete' | 'In Review' | 'Published';
  createdAt: string;
  fields: FieldConfig[];
  extractedFields: ExtractedField[];
}
