'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/app/_components/atoms/Input';
import { Textarea } from '@/app/_components/atoms/Textarea';
import { Dropdown } from '@/app/_components/atoms/DropDown';
import Button from '@/app/_components/atoms/Button';
import {
  DisplayDefault,
  BodyDefault,
  BodySmall,
  Caption,
  TitleDefault,
  TitleH4,
  TitleSmall,
  DisplayH1,
} from '@/app/_components/atoms/Typography';
import StepIndicator from '@/app/_components/molecules/StepIndicator';

interface FormData {
  email: string;
  emailDomain: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  verificationCode: string;
  province: string;
  district: string;
  introduction: string;
  // 사업자 인증 필드 (host)
  companyName: string;
  businessType: string;
  representativeName: string;
  establishmentDate: string;
  businessNumber1: string;
  businessNumber2: string;
  businessNumber3: string;
  businessAgreement: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
  verificationCode?: string;
  province?: string;
  district?: string;
  introduction?: string;
  companyName?: string;
  businessType?: string;
  representativeName?: string;
  establishmentDate?: string;
  businessNumber?: string;
}

export default function SignUpStep2Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberType = searchParams.get('type');

  const [formData, setFormData] = useState<FormData>({
    email: '',
    emailDomain: 'naver.com',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    verificationCode: '',
    province: '',
    district: '',
    introduction: '',
    companyName: '',
    businessType: '',
    representativeName: '',
    establishmentDate: '',
    businessNumber1: '',
    businessNumber2: '',
    businessNumber3: '',
    businessAgreement: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState<Record<string, boolean>>({});
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationTimer, setVerificationTimer] = useState(0);
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [showBusinessDetail, setShowBusinessDetail] = useState(false);

  const emailDomains = [
    { value: 'naver.com', label: 'naver.com' },
    { value: 'gmail.com', label: 'gmail.com' },
    { value: 'daum.net', label: 'daum.net' },
    { value: 'icloud.com', label: 'icloud.com' },
    { value: 'hanmail.net', label: 'hanmail.net' },
    { value: 'nate.com', label: 'nate.com' },
    { value: 'yahoo.com', label: 'yahoo.com' },
    { value: 'custom', label: '직접 입력' },
  ];

  const provinces = [
    { value: 'seoul', label: '서울특별시' },
    { value: 'gyeonggi', label: '경기도' },
    { value: 'busan', label: '부산광역시' },
    { value: 'incheon', label: '인천광역시' },
    { value: 'daegu', label: '대구광역시' },
    { value: 'daejeon', label: '대전광역시' },
    { value: 'gwangju', label: '광주광역시' },
    { value: 'ulsan', label: '울산광역시' },
    { value: 'sejong', label: '세종특별자치시' },
  ];

  const districts = [
    { value: 'gangnam', label: '강남구' },
    { value: 'gangdong', label: '강동구' },
    { value: 'gangbuk', label: '강북구' },
    { value: 'gangseo', label: '강서구' },
    { value: 'gwanak', label: '관악구' },
    { value: 'gwangjin', label: '광진구' },
    { value: 'guro', label: '구로구' },
    { value: 'geumcheon', label: '금천구' },
    { value: 'nowon', label: '노원구' },
    { value: 'dobong', label: '도봉구' },
    { value: 'dongdaemun', label: '동대문구' },
    { value: 'dongjak', label: '동작구' },
    { value: 'mapo', label: '마포구' },
    { value: 'seodaemun', label: '서대문구' },
    { value: 'seocho', label: '서초구' },
    { value: 'seongdong', label: '성동구' },
    { value: 'seongbuk', label: '성북구' },
    { value: 'songpa', label: '송파구' },
    { value: 'yangcheon', label: '양천구' },
    { value: 'yeongdeungpo', label: '영등포구' },
    { value: 'yongsan', label: '용산구' },
    { value: 'eunpyeong', label: '은평구' },
    { value: 'jongno', label: '종로구' },
    { value: 'jung', label: '중구' },
    { value: 'jungnang', label: '중랑구' },
  ];

  useEffect(() => {
    if (!memberType) {
      router.push('/signup/step1');
    }
  }, [memberType, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (verificationTimer > 0) {
      interval = setInterval(() => {
        setVerificationTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [verificationTimer]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof ValidationErrors]: undefined }));
    }
  };

  const handleDomainChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomDomain(true);
      setFormData(prev => ({ ...prev, emailDomain: '' }));
    } else {
      setIsCustomDomain(false);
      setFormData(prev => ({ ...prev, emailDomain: value }));
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullEmail = `${formData.email}@${formData.emailDomain}`;

    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요' }));
      return false;
    }

    if (!emailRegex.test(fullEmail)) {
      setErrors(prev => ({ ...prev, email: '올바른 이메일 형식이 아닙니다' }));
      return false;
    }

    // Simulate duplicate check
    if (formData.email === 'test') {
      setErrors(prev => ({ ...prev, email: '중복된 아이디입니다' }));
      return false;
    }

    setSuccess(prev => ({ ...prev, email: true }));
    setIsEmailChecked(true);
    return true;
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: '비밀번호를 입력해주세요' }));
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      setErrors(prev => ({ ...prev, password: '비밀번호 조합이 일치하지 않습니다' }));
      return false;
    }

    setSuccess(prev => ({ ...prev, password: true }));
    return true;
  };

  const validateConfirmPassword = () => {
    if (!formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '비밀번호 확인을 입력해주세요' }));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다' }));
      return false;
    }

    setSuccess(prev => ({ ...prev, confirmPassword: true }));
    return true;
  };

  const sendVerificationCode = () => {
    if (!formData.phone) {
      setErrors(prev => ({ ...prev, phone: '전화번호를 입력해주세요' }));
      return;
    }

    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: '올바른 전화번호 형식이 아닙니다' }));
      return;
    }

    setVerificationTimer(180); // 3 minutes
    setSuccess(prev => ({ ...prev, phone: true }));
  };

  const verifyCode = () => {
    if (!formData.verificationCode) {
      setErrors(prev => ({ ...prev, verificationCode: '인증번호를 입력해주세요' }));
      return;
    }

    if (formData.verificationCode !== '1234') {
      setErrors(prev => ({ ...prev, verificationCode: '인증번호가 일치하지 않습니다' }));
      return;
    }

    setSuccess(prev => ({ ...prev, verificationCode: true }));
    setIsPhoneVerified(true);
  };

  const handleSubmit = () => {
    // Validate all required fields
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!formData.name) {
      setErrors(prev => ({ ...prev, name: '이름을 입력해주세요' }));
    }

    if (memberType === 'cleaner') {
      // cleaner 타입의 경우
      if (!formData.province) {
        setErrors(prev => ({ ...prev, province: '시/도를 선택해주세요' }));
      }

      if (!formData.district) {
        setErrors(prev => ({ ...prev, district: '시/구/군을 선택해주세요' }));
      }

      if (
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid &&
        formData.name &&
        formData.province &&
        formData.district
      ) {
        router.push('/signup/step3?type=' + memberType);
      }
    } else if (memberType === 'host') {
      // host 타입의 경우
      if (!formData.companyName) {
        setErrors(prev => ({ ...prev, companyName: '상호명을 입력해주세요' }));
      }

      if (!formData.businessType) {
        setErrors(prev => ({ ...prev, businessType: '업종을 입력해주세요' }));
      }

      if (!formData.representativeName) {
        setErrors(prev => ({ ...prev, representativeName: '대표자명을 입력해주세요' }));
      }

      if (!formData.establishmentDate) {
        setErrors(prev => ({ ...prev, establishmentDate: '개업일자를 선택해주세요' }));
      }

      if (!formData.businessNumber1 || !formData.businessNumber2 || !formData.businessNumber3) {
        setErrors(prev => ({ ...prev, businessNumber: '사업자 등록번호를 입력해주세요' }));
      }

      if (!formData.businessAgreement) {
        alert('사업자 정보 제공 동의를 해주세요');
        return;
      }

      if (
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid &&
        formData.name &&
        formData.companyName &&
        formData.businessType &&
        formData.representativeName &&
        formData.establishmentDate &&
        formData.businessNumber1 &&
        formData.businessNumber2 &&
        formData.businessNumber3 &&
        formData.businessAgreement
      ) {
        router.push('/signup/step3?type=' + memberType);
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100dvh-68px)] py-8">
      <div className="flex flex-col items-center gap-16 w-full max-w-[472px] px-4 mx-auto">
        <DisplayH1>회원가입</DisplayH1>

        {/* Step 표시 */}
        <StepIndicator currentStep={2} />

        <div className="w-full space-y-8">
          {/* 기본정보 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <TitleH4>기본정보</TitleH4>
              <div className="flex items-center gap-1">
                <span className="text-red-500">*</span>
                <TitleSmall>필수입력사항</TitleSmall>
              </div>
            </div>

            <div className="space-y-4">
              {/* 아이디 */}
              <div className="space-y-2">
                <TitleDefault>
                  아이디 <span className="text-red-500">*</span>
                </TitleDefault>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="이메일 입력"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      error={!!errors.email}
                    />
                  </div>
                  <span className="flex items-center text-neutral-600">@</span>
                  {isCustomDomain ? (
                    <div className="flex-none [&>div]:!w-[140px]">
                      <Input
                        placeholder="직접 입력"
                        value={formData.emailDomain}
                        onChange={e => handleInputChange('emailDomain', e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="flex-none [&>div]:!w-[140px]">
                      <Dropdown
                        options={emailDomains}
                        value={formData.emailDomain}
                        onChange={handleDomainChange}
                      />
                    </div>
                  )}
                  <Button
                    variant="tertiary"
                    onClick={validateEmail}
                    className="!w-[81px] py-3 flex-shrink-0"
                  >
                    중복확인
                  </Button>
                </div>
                {errors.email && <Caption className="text-red-500">{errors.email}</Caption>}
                {success.email && (
                  <Caption className="text-green-500">사용가능한 아이디입니다</Caption>
                )}
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2">
                <TitleDefault>
                  비밀번호 <span className="text-red-500">*</span>
                </TitleDefault>
                <Input
                  placeholder="비밀번호를 입력해주세요"
                  type="password"
                  invisible
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  error={!!errors.password}
                />
                <Caption className="text-neutral-500">
                  영문 대문자, 소문자, 숫자, 특수문자(@$!%*?&) 포함, 8~16자
                </Caption>
                {errors.password && <Caption className="text-red-500">{errors.password}</Caption>}
                {success.password && (
                  <Caption className="text-green-500">비밀번호 조합이 일치합니다</Caption>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <TitleDefault>
                  비밀번호 확인 <span className="text-red-500">*</span>
                </TitleDefault>
                <Input
                  placeholder="비밀번호를 다시 입력해주세요"
                  type="password"
                  invisible
                  value={formData.confirmPassword}
                  onChange={e => handleInputChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <Caption className="text-red-500">{errors.confirmPassword}</Caption>
                )}
                {success.confirmPassword && (
                  <Caption className="text-green-500">비밀번호가 일치합니다</Caption>
                )}
              </div>

              {/* 이름 */}
              <div className="space-y-2">
                <TitleDefault>
                  이름 <span className="text-red-500">*</span>
                </TitleDefault>
                <Input
                  placeholder="이름을 입력해주세요"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                />
                {errors.name && <Caption className="text-red-500">{errors.name}</Caption>}
              </div>

              {/* 전화번호 */}
              <div className="space-y-2">
                <TitleDefault>
                  전화번호 <span className="text-red-500">*</span>
                </TitleDefault>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="휴대폰 번호를 입력해주세요 (-제외)"
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      error={!!errors.phone}
                    />
                  </div>
                  <Button variant="tertiary" onClick={sendVerificationCode} className="!w-32">
                    {verificationTimer > 0 ? '인증번호 재전송' : '인증번호 받기'}
                  </Button>
                </div>
                {errors.phone && <Caption className="text-red-500">{errors.phone}</Caption>}
                {success.phone && (
                  <Caption className="text-green-500">인증번호가 전송되었습니다</Caption>
                )}
              </div>

              {/* 인증번호 */}
              {verificationTimer > 0 && (
                <div className="space-y-2">
                  <BodySmall className="text-neutral-1000">인증번호</BodySmall>
                  <div className="flex gap-2">
                    <Input
                      placeholder="4자리 숫자 입력"
                      value={formData.verificationCode}
                      onChange={e => handleInputChange('verificationCode', e.target.value)}
                      error={!!errors.verificationCode}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 text-red-500 font-mono">
                      {formatTimer(verificationTimer)}
                    </div>
                    <Button variant="tertiary" onClick={verifyCode} className="w-32">
                      인증번호 확인
                    </Button>
                  </div>
                  {errors.verificationCode && (
                    <Caption className="text-red-500">{errors.verificationCode}</Caption>
                  )}
                  {success.verificationCode && (
                    <Caption className="text-green-500">인증되었습니다</Caption>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* cleaner 타입일 때만 서비스 가능 지역과 자기소개 표시 */}
          {memberType === 'cleaner' && (
            <>
              {/* 서비스 가능 지역 */}
              <div className="space-y-4">
                <TitleDefault>서비스 가능 지역</TitleDefault>
                <div className="flex-1 space-y-2">
                  <Dropdown
                    options={provinces}
                    value={formData.province}
                    onChange={value => handleInputChange('province', value)}
                    placeholder="시/도"
                    error={!!errors.province}
                  />
                  {errors.province && <Caption className="text-red-500">{errors.province}</Caption>}
                </div>
                <div className="flex-1 space-y-2">
                  <Dropdown
                    options={districts}
                    value={formData.district}
                    onChange={value => handleInputChange('district', value)}
                    placeholder="시/구/군"
                    error={!!errors.district}
                  />
                  {errors.district && <Caption className="text-red-500">{errors.district}</Caption>}
                </div>
              </div>

              {/* 자기소개 */}
              <div className="space-y-4">
                <TitleDefault>자기소개</TitleDefault>
                <Textarea
                  placeholder="본인의 자기소개를 입력해주세요"
                  value={formData.introduction}
                  onChange={e => handleInputChange('introduction', e.target.value)}
                  maxLength={500}
                  showCharCount
                />
              </div>
            </>
          )}

          {/* host 타입일 때 사업자 인증 섹션 표시 */}
          {memberType === 'host' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <TitleH4>사업자 인증</TitleH4>
                <div className="flex items-center gap-1">
                  <span className="text-red-500">*</span>
                  <TitleSmall>필수입력사항</TitleSmall>
                </div>
              </div>

              <div className="space-y-4">
                {/* 상호명 */}
                <div className="space-y-2">
                  <TitleDefault>
                    상호명 <span className="text-red-500">*</span>
                  </TitleDefault>
                  <Input
                    placeholder="상호명을 입력해주세요"
                    value={formData.companyName}
                    onChange={e => handleInputChange('companyName', e.target.value)}
                    error={!!errors.companyName}
                  />
                  {errors.companyName && (
                    <Caption className="text-red-500">{errors.companyName}</Caption>
                  )}
                </div>

                {/* 업종 */}
                <div className="space-y-2">
                  <TitleDefault>
                    업종 <span className="text-red-500">*</span>
                  </TitleDefault>
                  <Input
                    placeholder="사업자 등록증에 등록된 종목을 입력해주세요"
                    value={formData.businessType}
                    onChange={e => handleInputChange('businessType', e.target.value)}
                    error={!!errors.businessType}
                  />
                  {errors.businessType && (
                    <Caption className="text-red-500">{errors.businessType}</Caption>
                  )}
                </div>

                {/* 대표자명 */}
                <div className="space-y-2">
                  <TitleDefault>
                    대표자명 <span className="text-red-500">*</span>
                  </TitleDefault>
                  <Input
                    placeholder="대표자명을 입력해주세요"
                    value={formData.representativeName}
                    onChange={e => handleInputChange('representativeName', e.target.value)}
                    error={!!errors.representativeName}
                  />
                  {errors.representativeName && (
                    <Caption className="text-red-500">{errors.representativeName}</Caption>
                  )}
                </div>

                {/* 개업일자 */}
                <div className="space-y-2">
                  <TitleDefault>
                    개업일자 <span className="text-red-500">*</span>
                  </TitleDefault>
                  <Input
                    type="date"
                    placeholder="개업일자를 선택해주세요"
                    value={formData.establishmentDate}
                    onChange={e => handleInputChange('establishmentDate', e.target.value)}
                    error={!!errors.establishmentDate}
                  />
                  {errors.establishmentDate && (
                    <Caption className="text-red-500">{errors.establishmentDate}</Caption>
                  )}
                </div>

                {/* 사업자 등록번호 */}
                <div className="space-y-2">
                  <TitleDefault>
                    사업자 등록번호 <span className="text-red-500">*</span>
                  </TitleDefault>
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="000"
                      value={formData.businessNumber1}
                      onChange={e => handleInputChange('businessNumber1', e.target.value)}
                      maxLength={3}
                      className="flex-1"
                      error={!!errors.businessNumber}
                    />
                    <span className="text-neutral-600">-</span>
                    <Input
                      placeholder="00"
                      value={formData.businessNumber2}
                      onChange={e => handleInputChange('businessNumber2', e.target.value)}
                      maxLength={2}
                      className="flex-1"
                      error={!!errors.businessNumber}
                    />
                    <span className="text-neutral-600">-</span>
                    <Input
                      placeholder="000000"
                      value={formData.businessNumber3}
                      onChange={e => handleInputChange('businessNumber3', e.target.value)}
                      maxLength={6}
                      className="flex-1"
                      error={!!errors.businessNumber}
                    />
                  </div>
                  {errors.businessNumber && (
                    <Caption className="text-red-500">
                      입력한 사업자 정보가 유효하지 않습니다
                    </Caption>
                  )}
                </div>

                {/* 동의 체크박스 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="business-consent"
                      checked={formData.businessAgreement}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, businessAgreement: e.target.checked }))
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor="business-consent" className="text-sm text-neutral-1000">
                      상호명, 사업자명, 사업자 등록번호 정보 제공 동의
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBusinessDetail(!showBusinessDetail)}
                    className="text-sm text-primary-400 underline"
                  >
                    보기
                  </button>
                </div>
                {showBusinessDetail && (
                  <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                    <BodyDefault className="font-medium mb-3">사업자 정보 제공 동의</BodyDefault>
                    <div className="space-y-2 text-sm text-neutral-600">
                      <p>아래와 같은 목적으로 사업자 정보를 수집 및 이용합니다.</p>
                      <p>
                        <strong>수집 항목:</strong> 상호명, 업종, 대표자명, 개업일자, 사업자
                        등록번호
                      </p>
                      <p>
                        <strong>수집 목적:</strong> 사업자 인증 및 서비스 이용
                      </p>
                      <p>
                        <strong>보유 기간:</strong> 정보 삭제 요청 또는 회원 탈퇴 시 파기
                      </p>
                      <p className="text-red-500">
                        동의를 거부할 수 있으나, 동의 거부 시 사업자 인증 처리가 어렵습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 다음 단계 버튼 */}
        <Button variant="secondary" onClick={handleSubmit} className="w-full max-w-[400px]">
          다음 단계
        </Button>
      </div>
    </div>
  );
}
