import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { API_BASE_URL, API_TIMEOUT, API_HEADERS } from '@/constants/develop.constants';

// Presigned URL 생성 (인증 불필요)
export const generatePresignedUrls = async (data: {
  type: 'ACCOMMODATION' | 'AUTO_CLEANING_RULE_REQUEST' | 'CLEANING_REQUEST' | 'SIGNUP';
  file_count: number; // 1-10
  file_types: string[]; // ['image/jpeg', 'image/png', 'image/gif']
}) => {
  // 인증 없이 요청하기 위해 별도의 axios 인스턴스 사용
  // API는 camelCase 형식을 기대하므로 변환 없이 그대로 전송
  const response = await axios.post(
    `${API_BASE_URL}/api/s3/signup/presigned-urls`,
    {
      type: data.type,
      file_count: data.file_count,
      file_types: data.file_types,
    },
    {
      headers: {
        ...API_HEADERS,
        // Authorization 헤더 제거
      },
      timeout: API_TIMEOUT,
    },
  );

  // 응답을 camelCase로 변환
  if (response.data) {
    response.data = camelcaseKeys(response.data, { deep: true });
  }

  return response.data;
};

// 파일을 S3에 업로드
export const uploadFileToS3 = async (uploadUrl: string, file: File, contentType: string) => {
  console.log('S3 업로드 프록시 시작:', {
    uploadUrl,
    contentType,
    fileSize: file.size,
    fileName: file.name,
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadUrl', uploadUrl);
  formData.append('contentType', contentType);

  const response = await fetch('/api/s3/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result?.success) {
    console.error('S3 업로드 프록시 실패:', {
      status: response.status,
      result,
    });
    throw new Error(result?.message || '파일 업로드에 실패했습니다.');
  }

  console.log('S3 업로드 프록시 성공');
  return result;
};
