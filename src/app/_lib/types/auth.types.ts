// Auth 관련 타입 정의

export interface SignupHostRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'ROLE_HOST' | 'ROLE_CLEANER';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthdate: string; // YYYY-MM-DD
  image?: string;
  isServicePolicyAgreement: boolean;
  isPrivacyPolicyAgreement: boolean;
  isLocationPolicyAgreement: boolean;
  isAccommodationInfoAgreement: boolean;
  isRealEstateInfoAgreement: boolean;
  isMarketingPolicyAgreement: boolean;
  isPrivacyThirdPartyAgreement: boolean;
  ipAddress?: string;
}

export interface SignupCleanerRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'ROLE_HOST' | 'ROLE_CLEANER';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthdate: string; // YYYY-MM-DD
  image?: string;
  serviceCity: string;
  serviceDistrict: string;
  introduction?: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  isPrivacyConsentAgreement: boolean;
  isServicePolicyAgreement: boolean;
  isPrivacyPolicyAgreement: boolean;
  isLocationPolicyAgreement: boolean;
  isMarketingPolicyAgreement: boolean;
  ipAddress?: string;
}
