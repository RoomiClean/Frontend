import apiInstance from '../intance';

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
export const signupHost = async (data: {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'ROLE_HOST' | 'ROLE_CLEANER';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthdate: string; // YYYY-MM-DD
  image?: string;
}) => {
  const response = await apiInstance.post('/api/v1/auth/signup/host', data);
  return response.data;
};

// 청소자 회원가입
export const signupCleaner = async (data: {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'ROLE_HOST' | 'ROLE_CLEANER';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthdate: string; // YYYY-MM-DD
  image?: string;
  service_city: string;
  service_district: string;
  introduction?: string;
  bank_name: string;
  account_holder: string;
  account_number: string;
  is_privacy_consent_agreement: boolean;
  is_service_policy_agreement: boolean;
  is_privacy_policy_agreement: boolean;
  is_location_policy_agreement: boolean;
  is_marketing_policy_agreement: boolean;
  ip_address?: string;
}) => {
  const response = await apiInstance.post('/api/v1/auth/signup/cleaner', data);
  return response.data;
};
