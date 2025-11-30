import apiInstance from '../instance';
import type {
  ValidateBusinessVerificationRequest,
  RegisterBusinessVerificationRequest,
} from '../types/business.types';
import type { ApiResponse } from '../api-response.types';

// 사업자 번호 검증 (DB 저장 안함)
export const validateBusinessVerification = async (
  data: ValidateBusinessVerificationRequest,
): Promise<ApiResponse> => {
  const response = await apiInstance.post('/api/v1/business-verifications/validate', data);
  return response.data;
};

// 사업자 정보 등록
export const registerBusinessVerification = async (
  data: RegisterBusinessVerificationRequest,
): Promise<ApiResponse> => {
  const response = await apiInstance.post('/api/v1/business-verifications', data);
  return response.data;
};
