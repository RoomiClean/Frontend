// S3 관련 타입 정의

export type S3FileType =
  | 'ACCOMMODATION'
  | 'AUTO_CLEANING_RULE_REQUEST'
  | 'CLEANING_REQUEST'
  | 'SIGNUP';

export interface GeneratePresignedUrlsRequest {
  type: S3FileType;
  fileCount: number; // 1-10
  fileTypes: string[]; // ['image/jpeg', 'image/png', 'image/gif']
}
