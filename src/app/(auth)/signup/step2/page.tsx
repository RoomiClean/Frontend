'use client';
import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
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
import { EMAIL_DOMAINS, PROVINCES, DISTRICTS } from '@/constants/business.constants';
import { useFileUpload } from '@/hooks/useFileUpload';
import { BiSolidCamera } from 'react-icons/bi';
import { checkEmail, sendSmsCode, verifySmsCode } from '@/app/_lib/api/auth.api';
import { generatePresignedUrls, uploadFileToS3 } from '@/app/_lib/api/s3.api';
import { registerBusinessVerification } from '@/app/_lib/api/business.api';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
const HANGUL_REGEX = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/g;
const VERIFICATION_DURATION = 180;

interface FormData {
  email: string;
  emailDomain: string;
  password: string;
  confirmPassword: string;
  name: string;
  gender: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
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
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      emailDomain: 'naver.com',
      password: '',
      confirmPassword: '',
      name: '',
      gender: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
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
  const passwordRegister = register('password', {
    validate: (value: string) => {
      if (!value) return true; // 빈 값은 required로 처리
      if (!PASSWORD_REGEX.test(value)) {
        return '비밀번호 조합이 일치하지 않습니다';
      }
      return true;
    },
  });
  const confirmPasswordRegister = register('confirmPassword', {
    validate: (value: string) => {
      if (!value) return true; // 빈 값은 required로 처리
      const currentPassword = getValues('password');
      if (currentPassword && value !== currentPassword) {
        return '비밀번호가 일치하지 않습니다';
      }
      return true;
    },
  });
  const preventHangulInput = (
    event: ChangeEvent<HTMLInputElement>,
    originalHandler?: (event: ChangeEvent<HTMLInputElement>) => void,
  ) => {
    const sanitizedValue = event.target.value.replace(HANGUL_REGEX, '');
    if (sanitizedValue !== event.target.value) {
      event.target.value = sanitizedValue;
    }
    originalHandler?.(event);
  };

  const [success, setSuccess] = useState<Record<string, boolean>>({});
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationTimer, setVerificationTimer] = useState(0);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [showBusinessDetail, setShowBusinessDetail] = useState(false);
  const [openBusinessConsentModal, setOpenBusinessConsentModal] = useState(false);
  const [profilePhotoError, setProfilePhotoError] = useState<string | null>(null);
  const businessAgreementValue = watch('businessAgreement');

  const {
    files: profilePhotos,
    uploadFile: handleProfilePhotoUpload,
    removeFile: removeProfilePhoto,
    clearFiles: clearProfilePhoto,
  } = useFileUpload({
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png'],
    onError: message => {
      setProfilePhotoError(message);
      alert(message);
    },
  });

  const profilePhotoPreview = useMemo(() => {
    if (!profilePhotos[0]) return null;
    return URL.createObjectURL(profilePhotos[0]);
  }, [profilePhotos]);

  useEffect(() => {
    return () => {
      if (profilePhotoPreview) {
        URL.revokeObjectURL(profilePhotoPreview);
      }
    };
  }, [profilePhotoPreview]);

  const genderValue = watch('gender');
  const birthYearValue = watch('birthYear');
  const birthMonthValue = watch('birthMonth');
  const birthDayValue = watch('birthDay');
  const birthDateErrorMessage =
    errors.birthYear?.message || errors.birthMonth?.message || errors.birthDay?.message;

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, index) => {
      const year = currentYear - index;
      return { value: String(year), label: `${year}년` };
    });
  }, []);

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        return { value: String(month).padStart(2, '0'), label: `${month}월` };
      }),
    [],
  );

  const dayOptions = useMemo(() => {
    const year = Number(birthYearValue);
    const month = Number(birthMonthValue);
    const lastDay = year && month ? new Date(year, month, 0).getDate() : 31;

    return Array.from({ length: lastDay }, (_, index) => {
      const day = index + 1;
      return { value: String(day).padStart(2, '0'), label: `${day}일` };
    });
  }, [birthYearValue, birthMonthValue]);

  useEffect(() => {
    if (!memberType) {
      router.push('/signup/step1');
    }
  }, [memberType, router]);

  useEffect(() => {
    if (verificationTimer <= 0) return;

    const interval = setInterval(() => {
      setVerificationTimer(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [verificationTimer]);

  // success 상태를 errors 기반으로 계산
  useEffect(() => {
    setSuccess(prev => ({
      ...prev,
      password: !!password && !errors.password?.message,
      confirmPassword: !!confirmPassword && !errors.confirmPassword?.message,
    }));
  }, [password, confirmPassword, errors.password?.message, errors.confirmPassword?.message]);

  // password가 변경될 때 confirmPassword 재검증
  useEffect(() => {
    if (confirmPassword) {
      trigger('confirmPassword');
    }
  }, [password, trigger]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setValue(field as any, value);
    clearErrors(field as any);
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
      setSuccess(prev => ({ ...prev, email: false }));
      return false;
    }

    if (!emailRegex.test(fullEmail)) {
      setError('email', { type: 'manual', message: '올바른 이메일 형식이 아닙니다' });
      setSuccess(prev => ({ ...prev, email: false }));
      return false;
    }

    try {
      await checkEmail(fullEmail);
      clearErrors('email');
      setSuccess(prev => ({ ...prev, email: true }));
      setIsEmailChecked(true);
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '이메일 중복 확인에 실패했습니다';
      setError('email', { type: 'manual', message: errorMessage });
      setSuccess(prev => ({ ...prev, email: false }));
      setIsEmailChecked(false);
      return false;
    }
  };

  const sendVerificationCode = async () => {
    const phone = watch('phone');
    if (!phone) {
      setError('phone', { type: 'manual', message: '전화번호를 입력해주세요' });
      setSuccess(prev => ({ ...prev, phone: false }));
      return;
    }

    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError('phone', { type: 'manual', message: '올바른 전화번호 형식이 아닙니다' });
      setSuccess(prev => ({ ...prev, phone: false }));
      return;
    }

    try {
      await sendSmsCode(phone);
      setVerificationTimer(VERIFICATION_DURATION); // 3 minutes
      setIsVerificationRequested(true);
      clearErrors('phone');
      setSuccess(prev => ({ ...prev, phone: true }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '인증번호 전송에 실패했습니다';
      setError('phone', { type: 'manual', message: errorMessage });
      setSuccess(prev => ({ ...prev, phone: false }));
    }
  };

  const verifyCode = async () => {
    const verificationCode = watch('verificationCode');
    const phone = watch('phone');
    if (!verificationCode) {
      setError('verificationCode', { type: 'manual', message: '인증번호를 입력해주세요' });
      setSuccess(prev => ({ ...prev, verificationCode: false }));
      return;
    }

    try {
      await verifySmsCode(phone, verificationCode);
      clearErrors('verificationCode');
      setSuccess(prev => ({ ...prev, verificationCode: true }));
      setIsPhoneVerified(true);
      setVerificationTimer(0);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '인증번호가 일치하지 않습니다';
      setError('verificationCode', {
        type: 'manual',
        message: errorMessage,
      });
      setSuccess(prev => ({ ...prev, verificationCode: false }));
    }
  };

  const onSubmit = async (data: FormData) => {
    const isEmailValid = await validateEmail();
    if (!isEmailValid) return;

    if (!isEmailChecked) {
      alert('이메일 중복 확인을 해주세요');
      return;
    }

    if (!isPhoneVerified) {
      alert('전화번호 인증을 완료해주세요');
      return;
    }

    if (!PASSWORD_REGEX.test(data.password)) {
      setError('password', {
        type: 'manual',
        message: '비밀번호 조합이 일치하지 않습니다',
      });
      return;
    }

    const fieldsToValidate: Array<keyof FormData> = [
      'name',
      'gender',
      'birthYear',
      'birthMonth',
      'birthDay',
    ];

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
        setError(field as any, {
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

    if (profilePhotos.length === 0) {
      setProfilePhotoError('프로필 사진을 등록해주세요');
      return;
    }

    try {
      // 프로필 사진 업로드
      const profilePhoto = profilePhotos[0];
      const presignedUrlResponse = await generatePresignedUrls({
        type: 'SIGNUP',
        fileCount: 1,
        fileTypes: [profilePhoto.type],
      });

      console.log('Presigned URL 응답:', presignedUrlResponse);

      // API 응답 구조: { statusCode, success, message, data: { urls: [...] }, timestamp }
      // camelcaseKeys 변환 후: { statusCode, success, message, data: { urls: [{ uploadUrl, fileUrl, contentType }] } }
      const urls = presignedUrlResponse?.data?.urls;
      if (!urls || !urls[0]) {
        console.error('Presigned URL 응답 구조:', presignedUrlResponse);
        throw new Error('Presigned URL 생성에 실패했습니다');
      }

      // camelcaseKeys 변환으로 upload_url → uploadUrl, file_url → fileUrl, content_type → contentType
      const { uploadUrl, fileUrl, contentType } = urls[0];
      console.log('추출된 URL 정보:', { uploadUrl, fileUrl, contentType });

      if (!uploadUrl || !fileUrl || !contentType) {
        console.error('URL 정보 누락:', { uploadUrl, fileUrl, contentType });
        throw new Error('Presigned URL 정보가 올바르지 않습니다');
      }

      await uploadFileToS3(uploadUrl, profilePhoto, contentType);

      const email = watch('email');
      const emailDomain = watch('emailDomain');
      const fullEmail = `${email}@${emailDomain}`;
      const birthdate = `${data.birthYear}-${data.birthMonth}-${data.birthDay}`;
      const gender =
        data.gender === 'male' ? 'MALE' : data.gender === 'female' ? 'FEMALE' : 'OTHER';

      if (memberType === 'host') {
        // 사업자 검증
        const businessNumber = `${data.businessNumber1}${data.businessNumber2}${data.businessNumber3}`;
        const establishmentDate = data.establishmentDate.replace(/-/g, ''); // YYYYMMDD 형식

        const businessVerificationResponse = await registerBusinessVerification({
          businessName: data.companyName,
          businessNumber: businessNumber,
          businessType: data.businessType,
          ceoName: data.representativeName,
          startDate: establishmentDate,
        });

        // 호스트 회원가입은 step3에서 숙소 정보와 함께 처리
        // 여기서는 기본 정보만 저장
        sessionStorage.setItem(
          'signupData',
          JSON.stringify({
            email: fullEmail,
            password: data.password,
            name: data.name,
            phone: data.phone,
            role: 'ROLE_HOST',
            gender: gender as 'MALE' | 'FEMALE' | 'OTHER',
            birthdate,
            image: fileUrl,
            businessVerificationId: businessVerificationResponse.data.id,
          }),
        );
      } else if (memberType === 'cleaner') {
        // 청소자 회원가입은 step3에서 계좌 정보와 약관 동의를 포함하여 처리
        // 여기서는 기본 정보만 저장
        sessionStorage.setItem(
          'signupData',
          JSON.stringify({
            email: fullEmail,
            password: data.password,
            name: data.name,
            phone: data.phone,
            role: 'ROLE_CLEANER',
            gender: gender as 'MALE' | 'FEMALE' | 'OTHER',
            birthdate,
            image: fileUrl,
            serviceCity: data.province,
            serviceDistrict: data.district,
            introduction: data.introduction || '',
          }),
        );
      }

      router.push('/signup/step3?type=' + memberType);
    } catch (error: any) {
      console.error('회원가입 오류 상세:', error);
      console.error('에러 응답:', error?.response);
      console.error('에러 데이터:', error?.response?.data);
      console.error('에러 상태 코드:', error?.response?.status);
      console.error('에러 요청 URL:', error?.config?.url);

      let errorMessage = '회원가입 처리 중 오류가 발생했습니다';

      // 403 Forbidden 에러 처리
      if (error?.response?.status === 403) {
        errorMessage =
          '접근 권한이 없습니다. (403 Forbidden)\n\n이미 로그인되어 있거나, 인증이 필요한 요청입니다.';
      } else if (error?.response?.status === 401) {
        errorMessage = '인증이 필요합니다. (401 Unauthorized)';
      } else if (error?.response?.status === 400) {
        errorMessage = '잘못된 요청입니다. 입력 정보를 확인해주세요. (400 Bad Request)';
      } else if (error?.response?.status === 500) {
        errorMessage =
          '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요. (500 Internal Server Error)';
      }

      if (error?.response?.data) {
        // API 응답이 있는 경우
        if (error.response.data.message) {
          errorMessage = `${errorMessage}\n\n상세: ${error.response.data.message}`;
        } else if (error.response.data.error) {
          errorMessage = `${errorMessage}\n\n상세: ${error.response.data.error}`;
        } else if (typeof error.response.data === 'string') {
          errorMessage = `${errorMessage}\n\n상세: ${error.response.data}`;
        }
      } else if (error?.message) {
        errorMessage = `${errorMessage}\n\n상세: ${error.message}`;
      }

      alert(errorMessage);
    }
  };

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isVerificationActive = verificationTimer > 0;
  const isVerificationInputDisabled =
    !isVerificationRequested || (!isVerificationActive && !success.verificationCode);
  const verificationTimerLabel = isVerificationActive
    ? formatTimer(verificationTimer)
    : isVerificationRequested
      ? '00:00'
      : formatTimer(VERIFICATION_DURATION);

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
                  {...passwordRegister}
                  onChange={event => preventHangulInput(event, passwordRegister.onChange)}
                  error={!!errors.password?.message}
                />
                <Caption className="text-neutral-500">
                  영문 대문자, 소문자, 숫자, 특수문자(@$!%*?&) 포함, 8~16자
                </Caption>
                {errors.password?.message && (
                  <Caption className="text-red-500">{errors.password.message}</Caption>
                )}
                {success.password && (
                  <Caption className="text-green-500">사용 가능한 비밀번호입니다</Caption>
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
                  {...confirmPasswordRegister}
                  onChange={event => preventHangulInput(event, confirmPasswordRegister.onChange)}
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

              {/* 성별 */}
              <div className="space-y-2">
                <TitleDefault>
                  성별 <span className="text-red-500">*</span>
                </TitleDefault>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="male"
                      {...register('gender', { required: '성별을 선택해주세요' })}
                      checked={genderValue === 'male'}
                      className="w-4 h-4"
                    />
                    <BodySmall className="text-neutral-1000">남</BodySmall>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="female"
                      {...register('gender', { required: '성별을 선택해주세요' })}
                      checked={genderValue === 'female'}
                      className="w-4 h-4"
                    />
                    <BodySmall className="text-neutral-1000">여</BodySmall>
                  </label>
                </div>
                {errors.gender?.message && (
                  <Caption className="text-red-500">{errors.gender.message}</Caption>
                )}
              </div>

              {/* 생년월일 */}
              <div className="space-y-2">
                <TitleDefault>
                  생년월일 <span className="text-red-500">*</span>
                </TitleDefault>
                <div className="grid grid-cols-3 gap-2">
                  <Controller
                    name="birthYear"
                    control={control}
                    rules={{ required: '생년월일을 선택해주세요' }}
                    render={({ field }) => (
                      <Dropdown
                        options={yearOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="년"
                        error={!!errors.birthYear?.message}
                      />
                    )}
                  />
                  <Controller
                    name="birthMonth"
                    control={control}
                    rules={{ required: '생년월일을 선택해주세요' }}
                    render={({ field }) => (
                      <Dropdown
                        options={monthOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="월"
                        error={!!errors.birthMonth?.message}
                      />
                    )}
                  />
                  <Controller
                    name="birthDay"
                    control={control}
                    rules={{ required: '생년월일을 선택해주세요' }}
                    render={({ field }) => (
                      <Dropdown
                        options={dayOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="일"
                        error={!!errors.birthDay?.message}
                      />
                    )}
                  />
                </div>
                {birthDateErrorMessage && (
                  <Caption className="text-red-500">{birthDateErrorMessage}</Caption>
                )}
              </div>

              {/* 프로필 사진 업로드 */}
              <div className="space-y-2">
                <TitleDefault>
                  프로필 사진 업로드 <span className="text-red-500">*</span>
                </TitleDefault>
                <div className="flex flex-wrap gap-4">
                  {profilePhotos[0] && profilePhotoPreview ? (
                    <div className="relative w-28 h-28">
                      <Image
                        src={profilePhotoPreview}
                        alt="프로필 사진"
                        fill
                        sizes="112px"
                        className="rounded-lg object-cover border border-neutral-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          removeProfilePhoto(0);
                          setProfilePhotoError(null);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-neutral-900 text-white rounded-full flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="w-28 h-28 border-2 border-neutral-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-neutral-1000 gap-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={event => {
                          clearProfilePhoto();
                          handleProfilePhotoUpload(event);
                          setProfilePhotoError(null);
                          event.target.value = '';
                        }}
                        className="hidden"
                      />
                      <span className="text-2xl">
                        <BiSolidCamera className="w-3 h-3" />
                      </span>
                      <TitleDefault className="text-neutral-600">사진첨부</TitleDefault>
                    </label>
                  )}
                </div>
                <Caption className="text-neutral-500">
                  사진은 최대 1장, 5MB를 넘을 수 없습니다. (JPG, PNG 가능)
                </Caption>
                {profilePhotoError && (
                  <Caption className="text-red-500">{profilePhotoError}</Caption>
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
                      type="tel"
                      onlyNumber
                      inputMode="numeric"
                      maxLength={11}
                      {...register('phone')}
                      error={!!errors.phone?.message}
                      onChange={e => {
                        const value = e.target.value.replace(/-/g, '');
                        setValue('phone', value);
                        clearErrors('phone');
                        setSuccess(prev => ({ ...prev, phone: false }));
                      }}
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={sendVerificationCode}
                    className="!w-32 !h-12 flex items-center justify-center"
                  >
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
              <div className="space-y-2">
                <BodySmall className="text-neutral-1000">인증번호</BodySmall>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="6자리 숫자 입력"
                      onlyNumber
                      inputMode="numeric"
                      maxLength={6}
                      {...register('verificationCode')}
                      error={!!errors.verificationCode?.message}
                      disabled={isVerificationInputDisabled}
                      style={{ paddingRight: '64px' }}
                    />
                    <span
                      className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-mono ${
                        isVerificationActive ? 'text-red-500' : 'text-neutral-400'
                      }`}
                    >
                      {verificationTimerLabel}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    onClick={verifyCode}
                    disabled={!isVerificationActive}
                    className="!w-32 !h-12 flex items-center justify-center"
                  >
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
                      type="tel"
                      onlyNumber
                      {...register('businessNumber1')}
                      maxLength={3}
                      className="flex-1"
                      inputMode="numeric"
                      error={!!errors.businessNumber1?.message}
                    />
                    <span className="text-neutral-600">-</span>
                    <Input
                      placeholder="00"
                      type="tel"
                      onlyNumber
                      {...register('businessNumber2')}
                      maxLength={2}
                      className="flex-1"
                      inputMode="numeric"
                      error={!!errors.businessNumber1?.message}
                    />
                    <span className="text-neutral-600">-</span>
                    <Input
                      placeholder="000000"
                      type="tel"
                      onlyNumber
                      {...register('businessNumber3')}
                      maxLength={6}
                      className="flex-1"
                      inputMode="numeric"
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
                  <button type="button" onClick={() => setOpenBusinessConsentModal(true)}>
                    <BodySmall className="text-neutral-600">보기</BodySmall>
                  </button>
                </div>
                {/* 인라인 상세 박스 제거: 모달로 대체 */}
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
        {openBusinessConsentModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 px-4 py-8 backdrop-blur-sm"
            onClick={() => setOpenBusinessConsentModal(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
              onClick={event => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <div>
                  <TitleDefault className="text-neutral-1000">사업자 정보 제공 동의</TitleDefault>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenBusinessConsentModal(false)}
                  aria-label="닫기"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-xl text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-700"
                >
                  ×
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
                <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                  <BodyDefault className="font-medium mb-3">사업자 정보 제공 동의</BodyDefault>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p>아래와 같은 목적으로 사업자 정보를 수집 및 이용합니다.</p>
                    <p>
                      <strong>수집 항목:</strong> 상호명, 업종, 대표자명, 개업일자, 사업자 등록번호
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
              </div>

              <div className="flex flex-col gap-3 border-t border-neutral-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-sm text-neutral-800">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={!!businessAgreementValue}
                    onChange={event =>
                      setValue('businessAgreement', event.target.checked, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                  <span className="leading-tight">사업자 정보 제공에 동의합니다.</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setValue('businessAgreement', !businessAgreementValue, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className={`rounded-lg px-6 py-2 text-sm font-semibold transition ${
                    businessAgreementValue
                      ? 'border border-neutral-300 text-neutral-700 hover:border-neutral-500'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {businessAgreementValue ? '동의안함' : '동의하기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
