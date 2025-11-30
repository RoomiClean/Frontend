/**
 * 사업자 번호 검증 요청 타입
 */
export interface ValidateBusinessVerificationRequest {
  businessNumber: string;
  ceoName: string;
  startDate: string;
}

/**
 * 사업자 정보 등록 요청 타입
 */
export interface RegisterBusinessVerificationRequest {
  businessNumber: string;
  businessName: string;
  businessType: string;
  ceoName: string;
  startDate: string;
}
