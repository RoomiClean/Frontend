'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Input } from '@/app/_components/atoms/Input';
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
import { BANKS, ACCOMMODATION_TYPES } from '@/constants/business.constants';
import {
  MARKETING_CONSENT,
  PRIVACY_POLICY,
  SERVICE_TERMS,
  LOCATION_TERMS,
} from '@/constants/agreements.constants';
import { useAgreements } from '@/hooks/useAgreements';
import { useFileUpload } from '@/hooks/useFileUpload';
import { BiSolidCamera } from 'react-icons/bi';
import { signupCleaner, signupHost } from '@/app/_lib/api/auth.api';
import { generatePresignedUrls, uploadFileToS3 } from '@/app/_lib/api/s3.api';
import { createAccommodation } from '@/app/_lib/api/accommodation.api';
import { getClientIpAddress } from '@/utils/ip.utils';

interface DaumPostcodeData {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (config: { oncomplete: (data: DaumPostcodeData) => void }) => {
        open: () => void;
      };
    };
  }
}

interface FormData {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  // 숙소 정보 (host)
  accommodationName: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  accessMethod: string;
  accommodationType: string;
  roomCount: string;
  bedCount: string;
  livingRoomCount: string;
  bathroomCount: string;
  area: string;
  maxOccupancy: string;
  equipmentStorage: string;
  trashDisposal: string;
  hostRequests: string;
}

function SignUpStep3Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberType = searchParams.get('type');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      bank: '',
      accountHolder: '',
      accountNumber: '',
      accommodationName: '',
      zipCode: '',
      address: '',
      detailAddress: '',
      accessMethod: '',
      accommodationType: '',
      roomCount: '',
      bedCount: '',
      livingRoomCount: '',
      bathroomCount: '',
      area: '',
      maxOccupancy: '',
      equipmentStorage: '',
      trashDisposal: '',
      hostRequests: '',
    },
    mode: 'onChange',
  });

  const [success, setSuccess] = useState<Record<string, boolean>>({});
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [isPostcodeLoaded, setIsPostcodeLoaded] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const { agreements, toggleAgreement, isRequiredMet } = useAgreements({
    required: ['service', 'privacy', 'location'],
  });
  // 개인정보 수집 및 이용 동의(은행/계좌 관련)는 약관의 '개인정보 처리방침'과 독립적으로 관리
  const [privacyCollectionConsent, setPrivacyCollectionConsent] = useState(false);
  const [openAgreement, setOpenAgreement] = useState<
    'service' | 'privacy' | 'location' | 'marketing' | 'privacyConsentBox' | null
  >(null);
  const agreementContentMap = {
    service: SERVICE_TERMS,
    privacy: PRIVACY_POLICY,
    location: LOCATION_TERMS,
    marketing: MARKETING_CONSENT,
  } as const;
  const agreementTitleMap = {
    service: '서비스 이용약관',
    privacy: '개인정보 처리방침',
    location: '위치정보 이용약관',
    marketing: '마케팅 정보 수신 동의',
    privacyConsentBox: '개인정보 수집 및 이용 동의',
  } as const;
  const selectedAgreementContent =
    openAgreement && openAgreement !== 'privacyConsentBox'
      ? agreementContentMap[openAgreement]
      : '';
  const formatAgreementContent = (content: string) => {
    const headingRegex = /^(서비스 이용약관|총칙|부칙|제\d+조)/;
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        if (headingRegex.test(line)) {
          return { id: `heading-${index}`, variant: 'heading' as const, text: line };
        }
        if (/^\d+\./.test(line)) {
          const prefix = line.match(/^\d+\./)?.[0] ?? '';
          const text = line.replace(/^\d+\.\s*/, '').trim();
          return { id: `list-${index}`, variant: 'list' as const, text, prefix };
        }
        if (/^[•-]/.test(line)) {
          const text = line.replace(/^[•-]\s*/, '').trim();
          return { id: `bullet-${index}`, variant: 'list' as const, text, prefix: '•' };
        }
        return { id: `paragraph-${index}`, variant: 'paragraph' as const, text: line };
      });
  };
  const agreementBlocks = useMemo(
    () => formatAgreementContent(selectedAgreementContent),
    [selectedAgreementContent],
  );
  const agreementTabOrder: Array<'service' | 'privacy' | 'location' | 'marketing'> = [
    'service',
    'privacy',
    'location',
    'marketing',
  ];
  const isAgreementChecked =
    openAgreement === 'privacyConsentBox'
      ? privacyCollectionConsent
      : openAgreement
        ? agreements[openAgreement]
        : false;

  useEffect(() => {
    if (!memberType) {
      router.push('/signup/step1');
    }
  }, [memberType, router]);

  useEffect(() => {
    if (window.daum?.Postcode) {
      setIsPostcodeLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => setIsPostcodeLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const {
    ref: zipCodeRef,
    onBlur: zipCodeOnBlur,
    ...zipCodeRest
  } = register('zipCode', {
    required: memberType === 'host' ? '우편번호를 입력해주세요' : false,
  });
  const {
    ref: addressRef,
    onBlur: addressOnBlur,
    ...addressRest
  } = register('address', {
    required: memberType === 'host' ? '주소를 입력해주세요' : false,
  });
  const zipCodeValue = watch('zipCode');
  const addressValue = watch('address');
  const detailAddressValue = watch('detailAddress');

  useEffect(() => {
    setIsAddressSelected(!!addressValue?.trim());
  }, [addressValue]);

  // 커스텀 훅 사용
  const {
    files: accommodationPhotos,
    uploadFile: handleFileUpload,
    removeFile: removePhoto,
  } = useFileUpload({
    maxFiles: 20,
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    onError: alert,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setValue(field as any, value);
    clearErrors(field as any);
  };

  const findZipCode = () => {
    if (!isPostcodeLoaded || !window.daum?.Postcode) {
      alert('우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: data => {
        setValue('zipCode', data.zonecode, { shouldValidate: true, shouldDirty: true });
        setValue('address', data.roadAddress || data.jibunAddress, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setFocus('detailAddress');
      },
    }).open();
  };

  const verifyAccount = async () => {
    const accountNumber = watch('accountNumber');
    if (!accountNumber) {
      setError('accountNumber', { type: 'manual', message: '계좌번호를 입력해주세요' });
      return;
    }

    if (accountNumber.length < 10) {
      setError('accountNumber', { type: 'manual', message: '올바른 계좌번호가 아닙니다' });
      return;
    }

    setSuccess(prev => ({ ...prev, accountNumber: true }));
    setIsAccountVerified(true);
  };

  const onSubmit = async (data: FormData) => {
    console.log('onSubmit 시작', { memberType, data });
    if (memberType === 'cleaner') {
      // cleaner 타입의 경우
      if (!isRequiredMet) {
        alert('필수 약관에 동의해주세요');
        return;
      }

      if (!data.bank || !data.accountHolder || !data.accountNumber) {
        alert('은행 정보를 모두 입력해주세요');
        return;
      }

      if (!isAccountVerified) {
        alert('계좌 인증을 완료해주세요');
        return;
      }

      if (!privacyCollectionConsent) {
        alert('개인정보 수집 및 이용 동의를 해주세요');
        return;
      }

      try {
        // step2에서 저장한 데이터 가져오기
        const signupDataStr = sessionStorage.getItem('signupData');
        if (!signupDataStr) {
          alert('회원가입 정보를 찾을 수 없습니다. 처음부터 다시 진행해주세요.');
          router.push('/signup/step1');
          return;
        }

        const signupData = JSON.parse(signupDataStr);

        // IP 주소 가져오기
        const ipAddress = await getClientIpAddress();

        // 은행 value를 한글명(label)으로 변환
        const selectedBank = BANKS.find(bank => bank.value === data.bank);
        const bankName = selectedBank ? selectedBank.label : data.bank;

        // 청소자 회원가입 완료 - 세션 스토리지 정보와 step3 선택 정보를 합침
        const cleanerSignupData = {
          email: signupData.email,
          password: signupData.password,
          name: signupData.name,
          phone: signupData.phone,
          role: signupData.role,
          gender: signupData.gender,
          birthdate: signupData.birthdate,
          image: signupData.image,
          serviceCity: signupData.serviceCity || '',
          serviceDistrict: signupData.serviceDistrict || '',
          introduction: signupData.introduction || '',
          bankName: bankName,
          accountHolder: data.accountHolder,
          accountNumber: data.accountNumber,
          isPrivacyConsentAgreement: privacyCollectionConsent,
          isServicePolicyAgreement: agreements.service,
          isPrivacyPolicyAgreement: agreements.privacy,
          isLocationPolicyAgreement: agreements.location,
          isMarketingPolicyAgreement: agreements.marketing,
          ipAddress: ipAddress || undefined,
        };

        console.log('청소자 회원가입 요청 데이터:', cleanerSignupData);
        const response = await signupCleaner(cleanerSignupData);
        console.log('청소자 회원가입 성공:', response);

        // sessionStorage 정리
        sessionStorage.removeItem('signupData');

        // 회원가입 완료 페이지로 이동
        router.push('/signup/step4');
      } catch (error: any) {
        console.error('청소자 회원가입 오류 상세:', error);
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
    } else if (memberType === 'host') {
      // host 타입의 경우
      if (accommodationPhotos.length < 5) {
        setPhotoError('숙소 사진을 최소 5장 이상 업로드해주세요.');
        alert('숙소 사진을 최소 5장 이상 업로드해주세요.');
        return;
      }
      if (!data.accommodationName) {
        setError('accommodationName', { type: 'required', message: '숙소명을 입력해주세요' });
        return;
      }
      if (!data.zipCode) {
        setError('zipCode', { type: 'required', message: '우편번호를 입력해주세요' });
        return;
      }
      if (!data.address) {
        setError('address', { type: 'required', message: '주소를 입력해주세요' });
        return;
      }
      if (!data.detailAddress) {
        setError('detailAddress', { type: 'required', message: '상세주소를 입력해주세요' });
        return;
      }
      if (!data.accessMethod) {
        setError('accessMethod', { type: 'required', message: '출입 방법을 입력해주세요' });
        return;
      }
      if (!data.accommodationType) {
        setError('accommodationType', { type: 'required', message: '숙소 유형을 선택해주세요' });
        return;
      }
      if (!data.roomCount || !data.bedCount || !data.livingRoomCount || !data.bathroomCount) {
        if (typeof window !== 'undefined') {
          alert('숙소 구조를 모두 입력해주세요');
        }
        return;
      }
      if (!data.area || !data.maxOccupancy) {
        if (typeof window !== 'undefined') {
          alert('숙소 면적과 최대 수용 인원을 입력해주세요');
        }
        return;
      }
      if (!data.equipmentStorage) {
        setError('equipmentStorage', {
          type: 'required',
          message: '비품 보관장소를 입력해주세요',
        });
        return;
      }
      if (!data.trashDisposal) {
        setError('trashDisposal', { type: 'required', message: '쓰레기 배출장소를 입력해주세요' });
        return;
      }
      if (!isRequiredMet) {
        alert('필수 약관에 동의해주세요');
        return;
      }

      try {
        // step2에서 저장한 데이터 가져오기
        const signupDataStr = sessionStorage.getItem('signupData');
        if (!signupDataStr) {
          alert('회원가입 정보를 찾을 수 없습니다. 처음부터 다시 진행해주세요.');
          router.push('/signup/step1');
          return;
        }

        const signupData = JSON.parse(signupDataStr);
        const { businessVerificationId, ...hostSignupData } = signupData;

        // 호스트 회원가입
        await signupHost(hostSignupData);

        // 숙소 사진 업로드
        const photoUrls: string[] = [];
        for (const photo of accommodationPhotos) {
          const presignedUrlResponse = await generatePresignedUrls({
            type: 'ACCOMMODATION',
            fileCount: 1,
            fileTypes: [photo.type],
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

          await uploadFileToS3(uploadUrl, photo, contentType);
          photoUrls.push(fileUrl);
        }

        // 숙소 등록
        await createAccommodation({
          businessVerificationId: businessVerificationId,
          name: data.accommodationName,
          address: data.address,
          detailedAddress: data.detailAddress,
          accessMethod: data.accessMethod,
          accommodationType: data.accommodationType as
            | 'ETC'
            | 'APARTMENT'
            | 'VILLA'
            | 'STUDIO'
            | 'HOUSE',
          areaPyeong: parseFloat(data.area) || undefined,
          roomCount: parseInt(data.roomCount, 10) || undefined,
          bedCount: parseInt(data.bedCount, 10) || undefined,
          livingRoomCount: parseInt(data.livingRoomCount, 10) || undefined,
          bathroomCount: parseInt(data.bathroomCount, 10) || undefined,
          maxOccupancy: parseInt(data.maxOccupancy, 10) || undefined,
          supplyStorageLocation: data.equipmentStorage,
          trashLocation: data.trashDisposal,
          recycleLocation: data.trashDisposal, // 재활용 배출장소는 쓰레기 배출장소와 동일하게 처리
          cleaningNotes: data.hostRequests || undefined,
          photoUrls: photoUrls,
        });

        // sessionStorage 정리
        sessionStorage.removeItem('signupData');

        router.push('/signup/step4');
      } catch (error: any) {
        console.error('숙소 등록 오류 상세:', error);
        console.error('에러 응답:', error?.response);
        console.error('에러 데이터:', error?.response?.data);
        console.error('에러 상태 코드:', error?.response?.status);
        console.error('에러 요청 URL:', error?.config?.url);

        let errorMessage = '숙소 등록 처리 중 오류가 발생했습니다';

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
    }
  };

  return (
    <>
      <div className="min-h-[calc(100dvh-68px)] py-8">
        <div className="flex flex-col items-center gap-16 w-full max-w-[472px] px-4 mx-auto">
          <DisplayH1>회원가입</DisplayH1>

          {/* Step 표시 */}
          <StepIndicator currentStep={2} />

          <div className="w-full space-y-8">
            {/* cleaner 타입일 때 은행 정보 */}
            {memberType === 'cleaner' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <TitleH4>전산정보</TitleH4>
                  <div className="flex items-center gap-1">
                    <span className="text-red-500">*</span>
                    <TitleSmall>필수입력사항</TitleSmall>
                  </div>
                </div>
                <TitleDefault>은행 정보</TitleDefault>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Dropdown
                      options={BANKS}
                      value={watch('bank')}
                      onChange={value => handleInputChange('bank', value)}
                      placeholder="옵션 선택"
                      error={!!errors.bank?.message}
                    />
                    {errors.bank?.message && (
                      <Caption className="text-red-500">{errors.bank.message}</Caption>
                    )}
                  </div>

                  <div className="space-y-2">
                    <TitleDefault>예금주명</TitleDefault>
                    <Input
                      placeholder="예금주명을 입력해주세요"
                      {...register('accountHolder')}
                      error={!!errors.accountHolder?.message}
                    />
                    {errors.accountHolder?.message && (
                      <Caption className="text-red-500">{errors.accountHolder.message}</Caption>
                    )}
                  </div>

                  <div className="space-y-2">
                    <TitleDefault>계좌 번호</TitleDefault>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="계좌번호를 입력해주세요(-제외)"
                          {...register('accountNumber')}
                          inputMode="numeric"
                          value={watch('accountNumber') ?? ''}
                          onChange={e =>
                            setValue('accountNumber', e.target.value.replace(/\D/g, ''), {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          error={!!errors.accountNumber?.message}
                        />
                      </div>
                      <Button variant="primary" onClick={verifyAccount} className="!w-24">
                        계좌 인증
                      </Button>
                    </div>
                    {errors.accountNumber?.message && (
                      <Caption className="text-red-500">{errors.accountNumber.message}</Caption>
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
                        checked={privacyCollectionConsent}
                        onChange={e => setPrivacyCollectionConsent(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="privacy-consent" className="text-sm text-neutral-1000">
                        개인정보 수집 및 이용 동의
                      </label>
                    </div>
                    <button type="button" onClick={() => setOpenAgreement('privacyConsentBox')}>
                      <BodySmall className="text-neutral-600">보기</BodySmall>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* host 타입일 때 숙소 정보 */}
            {memberType === 'host' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <TitleH4>숙소정보</TitleH4>
                  <div className="flex items-center gap-1">
                    <span className="text-red-500">*</span>
                    <TitleSmall>필수입력사항</TitleSmall>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* 숙소명 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      숙소명 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <Input
                      placeholder="숙소명을 입력해주세요"
                      {...register('accommodationName')}
                      error={!!errors.accommodationName?.message}
                    />
                    {errors.accommodationName?.message && (
                      <Caption className="text-red-500">{errors.accommodationName.message}</Caption>
                    )}
                  </div>

                  {/* 주소 */}
                  <div className="space-y-3">
                    <TitleDefault>
                      주소 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <div className="flex gap-2">
                      <Input
                        placeholder="우편번호"
                        ref={zipCodeRef}
                        {...zipCodeRest}
                        onBlur={e => {
                          zipCodeOnBlur?.(e);
                          if (!e.target.value.trim()) {
                            setValue('zipCode', '');
                          }
                        }}
                        value={zipCodeValue}
                        inputMode="numeric"
                        error={!!errors.zipCode?.message}
                        className="flex-1"
                        readOnly={isAddressSelected}
                        disabled={!isAddressSelected}
                      />
                      <Button
                        variant="primary"
                        onClick={findZipCode}
                        className="!w-32 !h-12 flex items-center justify-center"
                      >
                        우편번호 찾기
                      </Button>
                    </div>
                    {errors.zipCode?.message && (
                      <Caption className="text-red-500">{errors.zipCode.message}</Caption>
                    )}
                    <Input
                      placeholder="주소"
                      ref={addressRef}
                      {...addressRest}
                      onBlur={e => {
                        addressOnBlur?.(e);
                        if (!e.target.value.trim()) {
                          setValue('address', '');
                        }
                      }}
                      value={addressValue}
                      error={!!errors.address?.message}
                      readOnly={isAddressSelected}
                      disabled={!isAddressSelected}
                    />
                    {errors.address?.message && (
                      <Caption className="text-red-500">{errors.address.message}</Caption>
                    )}
                    <Input
                      placeholder="상세주소 입력"
                      {...register('detailAddress', {
                        required: memberType === 'host' ? '상세주소를 입력해주세요' : false,
                      })}
                      error={!!errors.detailAddress?.message}
                      value={detailAddressValue ?? ''}
                    />
                    {errors.detailAddress?.message && (
                      <Caption className="text-red-500">{errors.detailAddress.message}</Caption>
                    )}
                  </div>

                  {/* 출입 방법 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      출입 방법 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <Input
                      placeholder="비밀번호, 키박스 등 출입 방법을 입력해주세요"
                      {...register('accessMethod')}
                      error={!!errors.accessMethod?.message}
                    />
                    {errors.accessMethod?.message && (
                      <Caption className="text-red-500">{errors.accessMethod.message}</Caption>
                    )}
                  </div>

                  {/* 숙소 유형 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      숙소 유형 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <Dropdown
                      options={ACCOMMODATION_TYPES}
                      value={watch('accommodationType')}
                      onChange={value => handleInputChange('accommodationType', value)}
                      placeholder="옵션 선택"
                      error={!!errors.accommodationType?.message}
                    />
                    {errors.accommodationType?.message && (
                      <Caption className="text-red-500">{errors.accommodationType.message}</Caption>
                    )}
                  </div>

                  {/* 숙소 구조 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      숙소 구조 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <TitleSmall className="text-neutral-600">방 개수</TitleSmall>
                        <Input
                          placeholder="0"
                          {...register('roomCount')}
                          type="number"
                          inputMode="numeric"
                        />
                      </div>
                      <div className="space-y-1">
                        <TitleSmall className="text-neutral-600">침대 개수</TitleSmall>
                        <Input
                          placeholder="0"
                          {...register('bedCount')}
                          type="number"
                          inputMode="numeric"
                        />
                      </div>
                      <div className="space-y-1">
                        <TitleSmall className="text-neutral-600">거실 개수</TitleSmall>
                        <Input
                          placeholder="0"
                          {...register('livingRoomCount')}
                          type="number"
                          inputMode="numeric"
                        />
                      </div>
                      <div className="space-y-1">
                        <TitleSmall className="text-neutral-600">화장실 개수</TitleSmall>
                        <Input
                          placeholder="0"
                          {...register('bathroomCount')}
                          type="number"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 숙소 면적/규모 및 최대 수용 인원 */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* 숙소 면적/규모 */}
                    <div className="space-y-2">
                      <TitleDefault>
                        숙소 면적/규모 <span className="text-red-500">*</span>
                      </TitleDefault>
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder=""
                          {...register('area')}
                          type="number"
                          inputMode="decimal"
                          error={!!errors.area?.message}
                        />
                        <span className="text-neutral-1000 whitespace-nowrap">평</span>
                      </div>
                    </div>

                    {/* 최대 수용 인원 */}
                    <div className="space-y-2">
                      <TitleDefault>최대 수용 인원</TitleDefault>
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder=""
                          {...register('maxOccupancy')}
                          type="number"
                          inputMode="numeric"
                          error={!!errors.maxOccupancy?.message}
                        />
                        <span className="text-neutral-1000 whitespace-nowrap">명</span>
                      </div>
                    </div>
                  </div>

                  {/* 숙소 사진 업로드 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      숙소 사진 업로드 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <div className="flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pb-2">
                      {accommodationPhotos.length < 20 && (
                        <div className="flex-shrink-0">
                          <label className="w-28 h-28 border-2 border-neutral-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-neutral-1000">
                            <input
                              type="file"
                              multiple
                              accept="image/jpeg,image/png,image/gif"
                              onChange={e => {
                                handleFileUpload(e);
                                setPhotoError(null);
                              }}
                              className="hidden"
                            />
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-2xl">
                                <BiSolidCamera className="w-3 h-3" />
                              </span>
                              <TitleDefault className="text-neutral-600">사진첨부</TitleDefault>
                            </div>
                          </label>
                        </div>
                      )}
                      {accommodationPhotos.map((file, index) => (
                        <div key={index} className="relative w-28 h-28 flex-shrink-0">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`숙소 사진 ${index + 1}`}
                            width={112}
                            height={112}
                            unoptimized
                            className="w-full h-full object-cover rounded-lg border border-neutral-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center text-white hover:bg-neutral-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <Caption className="text-neutral-500">
                      사진은 최소 5장, 최대 20장까지 업로드해야 하며 각각 5MB, 전체 100MB를 넘을 수
                      없습니다. (JPG, PNG, GIF 가능)
                    </Caption>
                    {photoError && <Caption className="text-red-500">{photoError}</Caption>}
                  </div>

                  {/* 비품 보관장소 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      비품 보관장소 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <Input
                      placeholder="청소 비품 보관장소를 입력해주세요"
                      {...register('equipmentStorage')}
                      error={!!errors.equipmentStorage?.message}
                    />
                    {errors.equipmentStorage?.message && (
                      <Caption className="text-red-500">{errors.equipmentStorage.message}</Caption>
                    )}
                  </div>

                  {/* 쓰레기 배출장소 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      쓰레기 배출장소 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <Input
                      placeholder="쓰레기 배출장소를 입력해주세요"
                      {...register('trashDisposal')}
                      error={!!errors.trashDisposal?.message}
                    />
                    {errors.trashDisposal?.message && (
                      <Caption className="text-red-500">{errors.trashDisposal.message}</Caption>
                    )}
                  </div>

                  {/* 호스트 요청사항 */}
                  <div className="space-y-2">
                    <TitleDefault>호스트 요청사항</TitleDefault>
                    <Input placeholder="요청사항을 입력해주세요" {...register('hostRequests')} />
                  </div>
                </div>
              </div>
            )}

            {/* 약관동의 */}
            <div className="space-y-4">
              <BodyDefault className="font-medium">약관동의</BodyDefault>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="all-agreement"
                    checked={agreements.all}
                    onChange={e => toggleAgreement('all', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="all-agreement" className="text-sm font-medium text-neutral-1000">
                    아래 내용에 모두 동의합니다
                  </label>
                </div>
              </div>

              <div className="border-t border-neutral-200" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="service-agreement"
                      checked={agreements.service}
                      onChange={e => toggleAgreement('service', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="service-agreement" className="text-sm text-neutral-1000">
                      서비스 이용 약관(필수)
                    </label>
                  </div>
                  <button type="button" onClick={() => setOpenAgreement('service')}>
                    <BodySmall className="text-neutral-600">보기</BodySmall>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="privacy-agreement"
                      checked={agreements.privacy}
                      onChange={e => toggleAgreement('privacy', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="privacy-agreement" className="text-sm text-neutral-1000">
                      개인정보 처리방침(필수)
                    </label>
                  </div>
                  <button type="button" onClick={() => setOpenAgreement('privacy')}>
                    <BodySmall className="text-neutral-600">보기</BodySmall>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="location-agreement"
                      checked={agreements.location}
                      onChange={e => toggleAgreement('location', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="location-agreement" className="text-sm text-neutral-1000">
                      위치정보 이용약관(필수)
                    </label>
                  </div>
                  <button type="button" onClick={() => setOpenAgreement('location')}>
                    <BodySmall className="text-neutral-600">보기</BodySmall>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="marketing-agreement"
                      checked={agreements.marketing}
                      onChange={e => toggleAgreement('marketing', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="marketing-agreement" className="text-sm text-neutral-1000">
                      마케팅 정보 수신(선택)
                    </label>
                  </div>
                  <button type="button" onClick={() => setOpenAgreement('marketing')}>
                    <BodySmall className="text-neutral-600">보기</BodySmall>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 다음 단계 버튼 */}
        <form
          onSubmit={handleSubmit(onSubmit, errors => {
            console.log('Form validation 실패:', errors);
          })}
          className="w-full max-w-[400px]"
        >
          <Button type="submit" variant="secondary" className="w-full">
            회원가입 완료
          </Button>
        </form>
      </div>
      {openAgreement !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 px-4 py-8 backdrop-blur-sm"
          onClick={() => setOpenAgreement(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div>
                <TitleDefault className="text-neutral-1000">
                  {openAgreement
                    ? agreementTitleMap[
                        openAgreement as 'service' | 'privacy' | 'location' | 'marketing'
                      ]
                    : ''}
                </TitleDefault>
                <BodySmall className="text-neutral-500">
                  필요한 약관을 선택해서 자세한 내용을 확인하세요.
                </BodySmall>
              </div>
              <button
                type="button"
                onClick={() => setOpenAgreement(null)}
                aria-label="닫기"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-xl text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-700"
              >
                ×
              </button>
            </div>

            {openAgreement !== 'privacyConsentBox' && (
              <div className="flex flex-wrap gap-2 border-b border-neutral-100 bg-neutral-50 px-6 py-3">
                {agreementTabOrder.map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setOpenAgreement(tab)}
                    aria-pressed={openAgreement === tab}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                      openAgreement === tab
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-transparent bg-white text-neutral-600 hover:border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {agreementTitleMap[tab]}
                  </button>
                ))}
              </div>
            )}

            <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
              {openAgreement === 'privacyConsentBox' ? (
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
              ) : agreementBlocks.length > 0 ? (
                <div className="space-y-3">
                  {agreementBlocks.map(block => {
                    if (block.variant === 'heading') {
                      return (
                        <TitleSmall key={block.id} className="text-neutral-900">
                          {block.text}
                        </TitleSmall>
                      );
                    }
                    if (block.variant === 'list') {
                      const anyBlock = block as any;
                      return (
                        <div
                          key={block.id}
                          className="flex items-start gap-2 text-sm text-neutral-700"
                        >
                          {anyBlock.prefix ? (
                            <span className="mt-0.5 font-semibold text-neutral-500">
                              {anyBlock.prefix}
                            </span>
                          ) : null}
                          <span className="leading-relaxed">{block.text}</span>
                        </div>
                      );
                    }
                    return (
                      <BodySmall key={block.id} className="text-neutral-800 leading-relaxed">
                        {block.text}
                      </BodySmall>
                    );
                  })}
                </div>
              ) : (
                <BodySmall className="text-neutral-500">
                  약관 내용을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
                </BodySmall>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-neutral-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-neutral-800">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={isAgreementChecked}
                  onChange={event => {
                    if (!openAgreement) return;
                    if (openAgreement === 'privacyConsentBox') {
                      setPrivacyCollectionConsent(event.target.checked);
                    } else {
                      toggleAgreement(openAgreement, event.target.checked);
                    }
                  }}
                />
                <span className="leading-tight">
                  {openAgreement &&
                  (openAgreement === 'service' ||
                    openAgreement === 'privacy' ||
                    openAgreement === 'location' ||
                    openAgreement === 'marketing' ||
                    openAgreement === 'privacyConsentBox')
                    ? agreementTitleMap[openAgreement as keyof typeof agreementTitleMap]
                    : ''}{' '}
                  에 동의합니다.
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!openAgreement) return;
                  if (openAgreement === 'privacyConsentBox') {
                    setPrivacyCollectionConsent(prev => !prev);
                  } else {
                    toggleAgreement(openAgreement, !isAgreementChecked);
                  }
                }}
                className={`rounded-lg px-6 py-2 text-sm font-semibold transition ${
                  isAgreementChecked
                    ? 'border border-neutral-300 text-neutral-700 hover:border-neutral-500'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                {isAgreementChecked ? '동의안함' : '동의하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function SignUpStep3Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100dvh-68px)] py-8 flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <SignUpStep3Content />
    </Suspense>
  );
}
