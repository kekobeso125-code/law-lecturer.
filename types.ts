
export enum AppStep {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  RAW_TEXT = 'RAW_TEXT',
  FORMATTED_TEXT = 'FORMATTED_TEXT',
  PDF_EXPORT = 'PDF_EXPORT'
}

export interface ProcessingState {
  isUploading: boolean;
  isIsolating: boolean;
  isTranscribing: boolean;
  progress: number;
}

export interface LectureData {
  file: File | null;
  subjectName: string; // الحقل الجديد
  rawText: string;
  rawChunks: string[];
  formattedText: string;
}
