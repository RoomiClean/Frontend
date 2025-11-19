'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { useForm } from 'react-hook-form';
import { Input } from '@/app/_components/atoms/Input';
import { Textarea } from '@/app/_components/atoms/Textarea';
import { Dropdown } from '@/app/_components/atoms/DropDown';
import Button from '@/app/_components/atoms/Button';
import {
  BodyDefault,
  BodySmall,
  Caption,
  TitleDefault,
  TitleH4,
  TitleSmall,
  DisplayH1,
} from '@/app/_components/atoms/Typography';
import StepIndicator from '@/app/_components/molecules/StepIndicator';
import { EMAIL_DOMAINS, PROVINCES, DISTRICTS } from '@/constants/business.constants';

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

export default function SignUpStep2Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberType = searchParams.get('type');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
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
    },
    mode: 'onChange',
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const [success, setSuccess] = useState<Record<string, boolean>>({});
  const [verificationTimer, setVerificationTimer] = useState(0);
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [showBusinessDetail, setShowBusinessDetail] = useState(false);

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

  useEffect(() => {
    if (confirmPassword && password) {
      if (password !== confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: '비밀번호가 일치하지 않습니다',
        });
      } else {
        clearErrors('confirmPassword');
        setSuccess(prev => ({ ...prev, confirmPassword: true }));
      }
    }
  }, [password, confirmPassword, setError, clearErrors]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setValue(field, value);
    clearErrors(field);
  };

  const handleDomainChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomDomain(true);
      setValue('emailDomain', '');
    } else {
      setIsCustomDomain(false);
      setValue('emailDomain', value);
    }
  };

  const validateEmail = async () => {
    const email = watch('email');
    const emailDomain = watch('emailDomain');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullEmail = `${email}@${emailDomain}`;

    if (!email) {
      setError('email', { type: 'manual', message: '이메일을 입력해주세요' });
      return false;
    }

    if (!emailRegex.test(fullEmail)) {
      setError('email', { type: 'manual', message: '올바른 이메일 형식이 아닙니다' });
      return false;
    }

    // Simulate duplicate check
    if (email === 'test') {
      setError('email', { type: 'manual', message: '중복된 아이디입니다' });
      return false;
    }

    setSuccess(prev => ({ ...prev, email: true }));
    return true;
  };

  const sendVerificationCode = async () => {
    const phone = watch('phone');
    if (!phone) {
      setError('phone', { type: 'manual', message: '전화번호를 입력해주세요' });
      return;
    }

    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError('phone', { type: 'manual', message: '올바른 전화번호 형식이 아닙니다' });
      return;
    }

    setVerificationTimer(180); // 3 minutes
    setSuccess(prev => ({ ...prev, phone: true }));
  };

  const verifyCode = async () => {
    const verificationCode = watch('verificationCode');
    if (!verificationCode) {
      setError('verificationCode', { type: 'manual', message: '인증번호를 입력해주세요' });
      return;
    }

    if (verificationCode !== '1234') {
      setError('verificationCode', {
        type: 'manual',
        message: '인증번호가 일치하지 않습니다',
      });
      return;
    }

    setSuccess(prev => ({ ...prev, verificationCode: true }));
  };

  const onSubmit = async (data: FormData) => {
    const isEmailValid = await validateEmail();
    if (!isEmailValid) return;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegex.test(data.password)) {
      setError('password', {
        type: 'manual',
        message: '비밀번호 조합이 일치하지 않습니다',
      });
      return;
    }

    const fieldsToValidate: Array<keyof FormData> = ['name'];

    if (memberType === 'cleaner') {
      fieldsToValidate.push('province', 'district');
    } else if (memberType === 'host') {
      fieldsToValidate.push(
        'companyName',
        'businessType',
        'representativeName',
        'establishmentDate',
      );

      if (!data.businessAgreement) {
        alert('사업자 정보 제공 동의를 해주세요');
        return;
      }
    }

    for (const field of fieldsToValidate) {
      if (!data[field]) {
        setError(field, {
          type: 'required',
          message: '필수 항목입니다',
        });
        return;
      }
    }

    if (memberType === 'host') {
      if (!data.businessNumber1 || !data.businessNumber2 || !data.businessNumber3) {
        setError('businessNumber1', {
          type: 'manual',
          message: '사업자 등록번호를 입력해주세요',
        });
        return;
      }
    }

    router.push('/signup/step3?type=' + memberType);
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
                      {...register('email')}
                      error={!!errors.email?.message}
                    />
                  </div>
                  <span className="flex items-center text-neutral-600">@</span>
                  {isCustomDomain ? (
                    <div className="flex-none [&>div]:!w-[140px]">
                      <Input placeholder="직접 입력" {...register('emailDomain')} />
                    </div>
                  ) : (
                    <div className="flex-none [&>div]:!w-[140px]">
                      <Dropdown
                        options={EMAIL_DOMAINS}
                        value={watch('emailDomain')}
                        onChange={handleDomainChange}
                      />
                    </div>
                  )}
                  <Button
                    variant="primary"
                    onClick={validateEmail}
                    className="!w-[81px] py-3 flex-shrink-0"
                  >
                    중복확인
                  </Button>
                </div>
                {errors.email?.message && (
                  <Caption className="text-red-500">{errors.email.message}</Caption>
                )}
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
                  {...register('password')}
                  error={!!errors.password?.message}
                />
                <Caption className="text-neutral-500">
                  영문 대문자, 소문자, 숫자, 특수문자(@$!%*?&) 포함, 8~16자
                </Caption>
                {errors.password?.message && (
                  <Caption className="text-red-500">{errors.password.message}</Caption>
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
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword?.message}
                />
                {errors.confirmPassword?.message && (
                  <Caption className="text-red-500">{errors.confirmPassword.message}</Caption>
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
                  {...register('name')}
                  error={!!errors.name?.message}
                />
                {errors.name?.message && (
                  <Caption className="text-red-500">{errors.name.message}</Caption>
                )}
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
                      {...register('phone')}
                      error={!!errors.phone?.message}
                      onChange={e => {
                        const value = e.target.value.replace(/-/g, '');
                        setValue('phone', value);
                      }}
                      onKeyDown={e => {
                        if (e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <Button variant="primary" onClick={sendVerificationCode} className="!w-32">
                    {verificationTimer > 0 ? '인증번호 재전송' : '인증번호 받기'}
                  </Button>
                </div>
                {errors.phone?.message && (
                  <Caption className="text-red-500">{errors.phone.message}</Caption>
                )}
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
                      {...register('verificationCode')}
                      error={!!errors.verificationCode?.message}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 text-red-500 font-mono">
                      {formatTimer(verificationTimer)}
                    </div>
                    <Button variant="primary" onClick={verifyCode} className="w-32">
                      인증번호 확인
                    </Button>
                  </div>
                  {errors.verificationCode?.message && (
                    <Caption className="text-red-500">{errors.verificationCode.message}</Caption>
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
                    options={PROVINCES}
                    value={watch('province')}
                    onChange={value => handleInputChange('province', value)}
                    placeholder="시/도"
                    error={!!errors.province?.message}
                  />
                  {errors.province?.message && (
                    <Caption className="text-red-500">{errors.province.message}</Caption>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Dropdown
                    options={DISTRICTS}
                    value={watch('district')}
                    onChange={value => handleInputChange('district', value)}
                    placeholder="시/구/군"
                    error={!!errors.district?.message}
                  />
                  {errors.district?.message && (
                    <Caption className="text-red-500">{errors.district.message}</Caption>
                  )}
                </div>
              </div>

              {/* 자기소개 */}
              <div className="space-y-4">
                <TitleDefault>자기소개</TitleDefault>
                <Textarea
                  placeholder="본인의 자기소개를 입력해주세요"
                  value={watch('introduction')}
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
                    {...register('companyName')}
                    error={!!errors.companyName?.message}
                  />
                  {errors.companyName?.message && (
                    <Caption className="text-red-500">{errors.companyName.message}</Caption>
                  )}
                </div>

                {/* 업종 */}
                <div className="space-y-2">
                  <TitleDefault>
                    업종 <span className="text-red-500">*</span>
                  </TitleDefault>
                  <Input
                    placeholder="사업자 등록증에 등록된 종목을 입력해주세요"
                    {...register('businessType')}
                    error={!!errors.businessType?.message}
                  />
                  {errors.businessType?.message && (
                    <Caption className="text-red-500">{errors.businessType.message}</Caption>
                  )}
                </div>

                {/* 대표자명 */}
                <div className="space-y-2">
                  <TitleDefault>
                    대표자명 <span className="text-red-500">*</span>
                  </TitleDefault>
                  <Input
                    placeholder="대표자명을 입력해주세요"
                    {...register('representativeName')}
                    error={!!errors.representativeName?.message}
                  />
                  {errors.representativeName?.message && (
                    <Caption className="text-red-500">{errors.representativeName.message}</Caption>
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
                    {...register('establishmentDate')}
                    error={!!errors.establishmentDate?.message}
                  />
                  {errors.establishmentDate?.message && (
                    <Caption className="text-red-500">{errors.establishmentDate.message}</Caption>
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
                      {...register('businessNumber1')}
                      maxLength={3}
                      className="flex-1"
                      error={!!errors.businessNumber1?.message}
                    />
                    <span className="text-neutral-600">-</span>
                    <Input
                      placeholder="00"
                      {...register('businessNumber2')}
                      maxLength={2}
                      className="flex-1"
                      error={!!errors.businessNumber1?.message}
                    />
                    <span className="text-neutral-600">-</span>
                    <Input
                      placeholder="000000"
                      {...register('businessNumber3')}
                      maxLength={6}
                      className="flex-1"
                      error={!!errors.businessNumber1?.message}
                    />
                  </div>
                  {errors.businessNumber1?.message && (
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
                      {...register('businessAgreement')}
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
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[400px]">
          <Button type="submit" variant="secondary" className="w-full">
            다음 단계
          </Button>
        </form>
      </div>
    </div>
  );
}
