/**
 * 청소 요청 폼 데이터 타입 정의
 */
export interface RequestFormData {
  // 기본 규칙 설정
  accommodationId: string;
  requestDate: string;
  requestStartTime: string;
  requestEndTime: string;
  cleaningType: 'basic' | 'basic-laundry';
  laundryItems: Record<string, number>;
  // 자동 요청 관련
  isAutomatic: boolean;
  triggerType: 'immediate' | 'hours-after' | 'hours-before';
  triggerHours: string;
  requestPeriodStart: string;
  requestPeriodEnd: string;
  completionTimeType: 'auto' | 'fixed';
  completionTime: string;
  // 청소자 조건 필터
  minRating: string;
  minExperience: string;
  minExperienceCustom?: string;
  // 특이사항 입력
  referencePhotos: File[];
  textMemo: string;
  emergencyContact: string;
  // 약관 동의
  serviceAgreement: boolean;
  entryAgreement: boolean;
}

