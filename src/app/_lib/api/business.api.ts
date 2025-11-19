import apiInstance from '../intance';

// 사업자 정보 등록
export const registerBusinessVerification = async (data: {
  business_name: string;
  business_number: string; // 10자리 숫자
  business_type: string;
  ceo_name: string;
  start_date: string; // YYYYMMDD
}) => {
  const response = await apiInstance.post('/api/v1/business-verifications', data);
  return response.data;
};
