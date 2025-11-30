import apiInstance from '../instance';
import type { SignupHostRequest, SignupCleanerRequest } from '../types/auth.types';
import type { ApiResponse } from '../api-response.types';

// 이메일 중복 확인
export const checkEmail = async (email: string): Promise<ApiResponse> => {
  const response = await apiInstance.get('/api/v1/auth/check-email', {
    params: { email },
  });
  return response.data;
};

// SMS 인증번호 전송
export const sendSmsCode = async (phone: string): Promise<ApiResponse> => {
  const response = await apiInstance.post('/api/v1/auth/sms/sending', {
    phone,
  });
  return response.data;
};

// SMS 인증번호 확인
export const verifySmsCode = async (phone: string, code: string): Promise<ApiResponse> => {
  const response = await apiInstance.post('/api/v1/auth/sms/verification', {
    phone,
    code,
  });
  return response.data;
};

// 호스트 회원가입
export const signupHost = async (data: SignupHostRequest): Promise<ApiResponse> => {
  const response = await apiInstance.post('/api/v1/auth/signup/host', data);
  return response.data;
};

// 청소자 회원가입
export const signupCleaner = async (data: SignupCleanerRequest): Promise<ApiResponse> => {
  const response = await apiInstance.post('/api/v1/auth/signup/cleaner', data);
  return response.data;
};

// 이메일 찾기
export const findEmail = async (name: string, phone: string): Promise<ApiResponse<{ email: string }>> => {
  const response = await apiInstance.post('/api/v1/auth/find-email', {
    name,
    phone,
  });
  return response.data;
};

// 비밀번호 재설정 요청
export const forgotPassword = async (
  email: string,
  phone: string,
): Promise<ApiResponse<{ token: string }>> => {
  const response = await apiInstance.post('/api/v1/auth/forgot-password', {
    email,
    phone,
  });
  return response.data;
};

// 비밀번호 재설정 실행
export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse> => {
  const response = await apiInstance.post('/api/v1/auth/reset-password', {
    token,
    newPassword,
  });
  return response.data;
};
