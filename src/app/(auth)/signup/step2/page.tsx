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
  bank: string;
  accountHolder: string;
  accountNumber: string;
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
  bank?: string;
  accountHolder?: string;
  accountNumber?: string;
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
    bank: '',
    accountHolder: '',
    accountNumber: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState<Record<string, boolean>>({});
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [verificationTimer, setVerificationTimer] = useState(0);
  const [showPrivacyDetail, setShowPrivacyDetail] = useState(false);
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    service: false,
    privacy: false,
    location: false,
    marketing: false,
  });

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

  const banks = [
    { value: 'kb', label: '국민은행' },
    { value: 'shinhan', label: '신한은행' },
    { value: 'woori', label: '우리은행' },
    { value: 'hana', label: '하나은행' },
    { value: 'nh', label: '농협은행' },
    { value: 'ibk', label: '기업은행' },
    { value: 'kdb', label: '산업은행' },
    { value: 'keb', label: '외환은행' },
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

  const verifyAccount = () => {
    if (!formData.accountNumber) {
      setErrors(prev => ({ ...prev, accountNumber: '계좌번호를 입력해주세요' }));
      return;
    }

    if (formData.accountNumber.length < 10) {
      setErrors(prev => ({ ...prev, accountNumber: '올바른 계좌번호가 아닙니다' }));
      return;
    }

    setSuccess(prev => ({ ...prev, accountNumber: true }));
    setIsAccountVerified(true);
  };

  const handleAgreementChange = (type: keyof typeof agreements, checked: boolean) => {
    if (type === 'all') {
      setAgreements({
        all: checked,
        service: checked,
        privacy: checked,
        location: checked,
        marketing: checked,
      });
    } else {
      const newAgreements = { ...agreements, [type]: checked };
      newAgreements.all = newAgreements.service && newAgreements.privacy && newAgreements.location;
      setAgreements(newAgreements);
    }
  };

  const handleSubmit = () => {
    // Validate all required fields
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!formData.name) {
      setErrors(prev => ({ ...prev, name: '이름을 입력해주세요' }));
    }

    if (!formData.province) {
      setErrors(prev => ({ ...prev, province: '시/도를 선택해주세요' }));
    }

    if (!formData.district) {
      setErrors(prev => ({ ...prev, district: '시/구/군을 선택해주세요' }));
    }

    if (!agreements.service || !agreements.privacy || !agreements.location) {
      alert('필수 약관에 동의해주세요');
      return;
    }

    if (
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      formData.name &&
      formData.province &&
      formData.district
    ) {
      router.push('/signup/step3');
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
        <div className="flex items-center gap-8">
          <TitleDefault className="text-neutral-500">1. 회원 유형 선택</TitleDefault>
          <TitleDefault className="text-neutral-500">&gt;</TitleDefault>
          <TitleDefault>2. 정보입력</TitleDefault>
          <TitleDefault className="text-neutral-500">&gt;</TitleDefault>
          <TitleDefault className="text-neutral-500">3. 가입완료</TitleDefault>
        </div>

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
                    variant="secondary"
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
                  영문/대소문자/특수문자 중 3가지 이상 조합, 8~16자
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
                  <Button variant="secondary" onClick={sendVerificationCode} className="!w-32">
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
                    <Button variant="primary" onClick={verifyCode} className="w-32">
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

          {/* 은행 정보 */}
          <div className="space-y-4">
            <TitleDefault>은행 정보</TitleDefault>
            <div className="space-y-4">
              <div className="space-y-2">
                <Dropdown
                  options={banks}
                  value={formData.bank}
                  onChange={value => handleInputChange('bank', value)}
                  placeholder="옵션 선택"
                  error={!!errors.bank}
                />
                {errors.bank && <Caption className="text-red-500">{errors.bank}</Caption>}
              </div>

              <div className="space-y-2">
                <TitleDefault>예금주명</TitleDefault>
                <Input
                  placeholder="예금주명을 입력해주세요"
                  value={formData.accountHolder}
                  onChange={e => handleInputChange('accountHolder', e.target.value)}
                  error={!!errors.accountHolder}
                />
                {errors.accountHolder && (
                  <Caption className="text-red-500">{errors.accountHolder}</Caption>
                )}
              </div>

              <div className="space-y-2">
                <TitleDefault>계좌 번호</TitleDefault>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="계좌번호를 입력해주세요(-제외)"
                      value={formData.accountNumber}
                      onChange={e => handleInputChange('accountNumber', e.target.value)}
                      error={!!errors.accountNumber}
                    />
                  </div>
                  <Button variant="primary" onClick={verifyAccount} className="!w-24">
                    계좌 인증
                  </Button>
                </div>
                {errors.accountNumber && (
                  <Caption className="text-red-500">{errors.accountNumber}</Caption>
                )}
                {success.accountNumber && (
                  <Caption className="text-green-500">계좌가 인증되었습니다</Caption>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="privacy-consent"
                    checked={agreements.privacy}
                    onChange={e => handleAgreementChange('privacy', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="privacy-consent" className="text-sm text-neutral-1000">
                    개인정보 수집 및 이용 동의
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrivacyDetail(!showPrivacyDetail)}
                  className="text-sm text-primary-400 underline"
                >
                  보기
                </button>
              </div>
              {showPrivacyDetail && (
                <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                  <BodyDefault className="font-medium mb-3">개인정보 수집 및 이용 동의</BodyDefault>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p>아래와 같은 목적으로 개인정보를 수집 및 이용합니다.</p>
                    <p>
                      <strong>수집 항목:</strong> 은행명, 계좌번호
                    </p>
                    <p>
                      <strong>수집 목적:</strong> 수익 정산
                    </p>
                    <p>
                      <strong>보유 기간:</strong> 정보 삭제 요청 또는 회원 탈퇴 시 파기
                    </p>
                    <p className="text-red-500">
                      동의를 거부할 수 있으나, 동의 거부 시 수익 정산 처리가 어렵습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 약관동의 */}
          <div className="space-y-4">
            <BodyDefault className="font-medium">약관동의</BodyDefault>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="all-agreement"
                  checked={agreements.all}
                  onChange={e => handleAgreementChange('all', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="all-agreement" className="text-sm font-medium text-neutral-1000">
                  아래 내용에 모두 동의합니다
                </label>
              </div>

              <div className="space-y-2 pl-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="service-agreement"
                      checked={agreements.service}
                      onChange={e => handleAgreementChange('service', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="service-agreement" className="text-sm text-neutral-1000">
                      서비스 이용 약관(필수)
                    </label>
                  </div>
                  <button type="button" className="text-sm text-primary-400 underline">
                    보기
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="privacy-agreement"
                      checked={agreements.privacy}
                      onChange={e => handleAgreementChange('privacy', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="privacy-agreement" className="text-sm text-neutral-1000">
                      개인정보 처리방침(필수)
                    </label>
                  </div>
                  <button type="button" className="text-sm text-primary-400 underline">
                    보기
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="location-agreement"
                      checked={agreements.location}
                      onChange={e => handleAgreementChange('location', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="location-agreement" className="text-sm text-neutral-1000">
                      위치정보 이용약관(필수)
                    </label>
                  </div>
                  <button type="button" className="text-sm text-primary-400 underline">
                    보기
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="marketing-agreement"
                      checked={agreements.marketing}
                      onChange={e => handleAgreementChange('marketing', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="marketing-agreement" className="text-sm text-neutral-1000">
                      마케팅 정보 수신(선택)
                    </label>
                  </div>
                  <button type="button" className="text-sm text-primary-400 underline">
                    보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 회원가입 완료 버튼 */}
        <Button variant="primary" onClick={handleSubmit} className="w-full max-w-[400px]">
          회원가입 완료
        </Button>
      </div>
    </div>
  );
}
