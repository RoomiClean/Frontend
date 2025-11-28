// Business 관련 타입 정의

export interface RegisterBusinessVerificationRequest {
  businessName: string;
  businessNumber: string; // 10자리 숫자
  businessType: string;
  ceoName: string;
  startDate: string; // YYYYMMDD
}
