'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/app/_components/atoms/Input';
import { DatePicker } from '@/app/_components/atoms/DatePicker';
import Button from '@/app/_components/atoms/Button';
import {
  DisplayH3,
  TitleH4,
  TitleDefault,
  TitleSmall,
  Caption,
  BodyDefault,
} from '@/app/_components/atoms/Typography';
import { useValidateBusinessVerification } from '@/app/_lib/queries';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/app/_lib/api-response.types';

interface FormData {
  companyName: string;
  businessType: string;
  representativeName: string;
  establishmentDate: string;
  businessNumber: string;
  businessAgreement: boolean;
}

export default function RegisterAccommodationPage() {
  const router = useRouter();
  const { mutateAsync: validateBusinessVerificationMutate } = useValidateBusinessVerification();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      companyName: '',
      businessType: '',
      representativeName: '',
      establishmentDate: '',
      businessNumber: '',
      businessAgreement: false,
    },
    mode: 'onChange',
  });

  const [showBusinessDetail, setShowBusinessDetail] = useState(false);
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const handleBusinessVerification = async () => {
    const businessNumber = watch('businessNumber');
    const representativeName = watch('representativeName');
    const establishmentDate = watch('establishmentDate');

    if (!businessNumber) {
      setError('businessNumber', {
        type: 'manual',
        message: '사업자 등록번호를 입력해주세요',
      });
      setVerificationMessage({ type: 'error', text: '' });
      return;
    }

    if (businessNumber.length !== 10) {
      setError('businessNumber', {
        type: 'manual',
        message: '사업자 등록번호는 10자리여야 합니다',
      });
      setVerificationMessage({ type: 'error', text: '' });
      return;
    }

    if (!representativeName) {
      setError('representativeName', {
        type: 'manual',
        message: '대표자명을 입력해주세요',
      });
      setVerificationMessage({ type: 'error', text: '' });
      return;
    }

    if (!establishmentDate) {
      setError('establishmentDate', {
        type: 'manual',
        message: '개업일자를 선택해주세요',
      });
      setVerificationMessage({ type: 'error', text: '' });
      return;
    }

    try {
      const establishmentDateFormatted = establishmentDate.replace(/-/g, ''); // YYYYMMDD 형식
      const response = await validateBusinessVerificationMutate({
        businessNumber: businessNumber,
        ceoName: representativeName,
        startDate: establishmentDateFormatted,
      });

      if (response.success) {
        const responseData = (response as { data?: { valid?: boolean } }).data;
        if (responseData?.valid === true) {
          clearErrors('businessNumber');
          setIsBusinessVerified(true);
          setVerificationMessage({
            type: 'success',
            text: '인증되었습니다',
          });
        } else {
          setIsBusinessVerified(false);
          setVerificationMessage({
            type: 'error',
            text: '인증에 실패하였습니다.',
          });
        }
      } else {
        setIsBusinessVerified(false);
        setVerificationMessage({
          type: 'error',
          text: '인증에 실패하였습니다.',
        });
      }
    } catch (error) {
      setIsBusinessVerified(false);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError?.response?.status === 409
          ? '이미 등록된 사업자 정보입니다.'
          : '인증에 실패하였습니다.';
      setVerificationMessage({
        type: 'error',
        text: errorMessage,
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!isBusinessVerified) {
      setError('businessNumber', {
        type: 'manual',
        message: '사업자 인증을 완료해주세요',
      });
      return;
    }
    if (!data.businessAgreement) {
      setError('businessAgreement', {
        type: 'manual',
        message: '필수 동의 항목입니다',
      });
      return;
    }

    // 사업자 정보를 sessionStorage에 저장
    const establishmentDateFormatted = data.establishmentDate.replace(/-/g, ''); // YYYYMMDD 형식
    const businessInfo = {
      businessName: data.companyName,
      businessNumber: data.businessNumber,
      businessType: data.businessType,
      ceoName: data.representativeName,
      startDate: establishmentDateFormatted,
    };
    sessionStorage.setItem('accommodationRegisterData', JSON.stringify({ businessInfo }));

    router.push('/mypage/accommodation/register/step2');
  };

  return (
    <div className="min-h-[calc(100dvh-68px)] py-8">
      <div className="flex flex-col items-center gap-16 w-full max-w-[472px] px-4 mx-auto">
        <DisplayH3 className="lg:!text-[28px] xl:!text-[32px]">숙소 신규 등록하기</DisplayH3>

        <div className="w-full space-y-8">
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
                  value={watch('companyName') ?? ''}
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
                  value={watch('businessType') ?? ''}
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
                  value={watch('representativeName') ?? ''}
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
                <Controller
                  name="establishmentDate"
                  control={control}
                  rules={{ required: '개업일자를 선택해주세요' }}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="개업일자를 선택해주세요"
                      error={!!errors.establishmentDate?.message}
                      minDate="1900-01-01"
                    />
                  )}
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
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="숫자 10자리 입력 (-제외)"
                      type="tel"
                      onlyNumber
                      {...register('businessNumber', {
                        onChange: () => {
                          setIsBusinessVerified(false);
                          setVerificationMessage({ type: null, text: '' });
                          clearErrors('businessNumber');
                        },
                      })}
                      maxLength={10}
                      inputMode="numeric"
                      error={!!errors.businessNumber?.message}
                      value={watch('businessNumber') ?? ''}
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleBusinessVerification}
                    className="!w-32 h-[50px]"
                    disabled={isBusinessVerified}
                  >
                    {isBusinessVerified ? '인증완료' : '인증하기'}
                  </Button>
                </div>
                {errors.businessNumber?.message && (
                  <Caption className="text-red-500">{errors.businessNumber.message}</Caption>
                )}
                {verificationMessage.type === 'success' && (
                  <Caption className="text-green-500">{verificationMessage.text}</Caption>
                )}
                {verificationMessage.type === 'error' && (
                  <Caption className="text-red-500">{verificationMessage.text}</Caption>
                )}
              </div>
              {/* 동의 체크박스 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="business-consent"
                      {...register('businessAgreement', {
                        onChange: () => {
                          clearErrors('businessAgreement');
                        },
                      })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="business-consent" className="text-sm text-neutral-1000">
                      사업자 정보 제공 동의 (필수)
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
                {errors.businessAgreement?.message && (
                  <Caption className="text-red-500">{errors.businessAgreement.message}</Caption>
                )}
              </div>
              {showBusinessDetail && (
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
              )}
            </div>
          </div>
        </div>
        {/* 다음 단계 버튼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!isBusinessVerified || !watch('businessAgreement')}
          >
            다음 단계로
          </Button>
        </form>
      </div>
    </div>
  );
}
