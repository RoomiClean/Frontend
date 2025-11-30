// 회원가입용 타입
export type S3FileType =
  | 'ACCOMMODATION'
  | 'AUTO_CLEANING_RULE_REQUEST'
  | 'CLEANING_REQUEST'
  | 'SIGNUP';

// 업로드용 타입
export type S3UploadFileType =
  | 'ACCOMMODATION'
  | 'AUTO_CLEANING_RULE_REQUEST'
  | 'CLEANING_REQUEST'
  | 'PROFILE'
  | 'JOB_BEFORE'
  | 'JOB_AFTER'
  | 'ISSUE_REPORT';

// 회원가입용 Presigned URL 요청
export interface GeneratePresignedUrlsRequest {
  type: S3FileType;
  fileCount: number; // 1-10
  fileTypes: string[]; // ['image/jpeg', 'image/png', 'image/gif']
}

// 업로드용 Presigned URL 요청
export interface GenerateUploadPresignedUrlsRequest {
  type: S3UploadFileType;
  file_count: number; // 1-10 (PROFILE은 1만 가능)
  file_types: string[]; // ['image/jpeg', 'image/png', 'image/gif']
}
