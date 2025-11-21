import apiInstance from '../intance';
import type { RegisterBusinessVerificationRequest } from '../types/business.types';

// 사업자 정보 등록
export const registerBusinessVerification = async (data: RegisterBusinessVerificationRequest) => {
  const response = await apiInstance.post('/api/v1/business-verifications', data);
  return response.data;
};
