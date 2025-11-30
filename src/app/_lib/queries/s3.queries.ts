import { useMutation } from '@tanstack/react-query';
import {
  generatePresignedUrls,
  generateUploadPresignedUrls,
  uploadFileToS3,
} from '../api/s3.api';
import type {
  GeneratePresignedUrlsRequest,
  GenerateUploadPresignedUrlsRequest,
} from '../types/s3.types';
import type { ApiResponse } from '../api-response.types';

// Presigned URL 생성 뮤테이션 (회원가입용)
export const useGeneratePresignedUrls = () =>
  useMutation<ApiResponse, Error, GeneratePresignedUrlsRequest>({
    mutationFn: (data: GeneratePresignedUrlsRequest) => generatePresignedUrls(data),
    onSuccess: () => {
      console.log('Presigned URL 생성 완료');
    },
    onError: (err: Error) => {
      console.error('Presigned URL 생성 에러:', err);
    },
  });

// 업로드용 Presigned URL 생성 뮤테이션
export const useGenerateUploadPresignedUrls = () =>
  useMutation<ApiResponse, Error, GenerateUploadPresignedUrlsRequest>({
    mutationFn: (data: GenerateUploadPresignedUrlsRequest) =>
      generateUploadPresignedUrls(data),
    onSuccess: () => {
      console.log('업로드용 Presigned URL 생성 완료');
    },
    onError: (err: Error) => {
      console.error('업로드용 Presigned URL 생성 에러:', err);
    },
  });

// 파일 S3 업로드 뮤테이션
export const useUploadFileToS3 = () =>
  useMutation<
    { success: boolean; message: string },
    Error,
    { uploadUrl: string; file: File; contentType: string }
  >({
    mutationFn: ({ uploadUrl, file, contentType }) => uploadFileToS3(uploadUrl, file, contentType),
    onSuccess: () => {
      console.log('S3 파일 업로드 완료');
    },
    onError: (err: Error) => {
      console.error('S3 파일 업로드 에러:', err);
    },
  });
