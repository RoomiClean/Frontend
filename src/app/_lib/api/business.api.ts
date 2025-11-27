import apiInstance from '../instance';
import type { RegisterBusinessVerificationRequest } from '../types/business.types';
import type { ApiResponse } from '../api-response.types';

// 사업자 정보 등록
export const registerBusinessVerification = async (
  data: RegisterBusinessVerificationRequest,
): Promise<ApiResponse> => {
  const response = await apiInstance.post('/api/v1/business-verifications', data);
  return response.data;
};
