import apiInstance from '../intance';
import type { SignupHostRequest, SignupCleanerRequest } from '../types/auth.types';

// 이메일 중복 확인
export const checkEmail = async (email: string) => {
  const response = await apiInstance.get('/api/v1/auth/check-email', {
    params: { email },
  });
  return response.data;
};

// SMS 인증번호 전송
export const sendSmsCode = async (phone: string) => {
  const response = await apiInstance.post('/api/v1/auth/sms/sending', {
    phone,
  });
  return response.data;
};

// SMS 인증번호 확인
export const verifySmsCode = async (phone: string, code: string) => {
  const response = await apiInstance.post('/api/v1/auth/sms/verification', {
    phone,
    code,
  });
  return response.data;
};

// 호스트 회원가입
export const signupHost = async (data: SignupHostRequest) => {
  const response = await apiInstance.post('/api/v1/auth/signup/host', data);
  return response.data;
};

// 청소자 회원가입
export const signupCleaner = async (data: SignupCleanerRequest) => {
  const response = await apiInstance.post('/api/v1/auth/signup/cleaner', data);
  return response.data;
};
