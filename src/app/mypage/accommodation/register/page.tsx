'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '@/app/_components/atoms/Input';
import Button from '@/app/_components/atoms/Button';
import {
  DisplayH3,
  TitleH4,
  TitleDefault,
  TitleSmall,
  Caption,
  BodyDefault,
} from '@/app/_components/atoms/Typography';

interface FormData {
  companyName: string;
  businessType: string;
  representativeName: string;
  establishmentDate: string;
  businessNumber1: string;
  businessNumber2: string;
  businessNumber3: string;
  businessAgreement: boolean;
}

export default function RegisterAccommodationPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
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

  const [showBusinessDetail, setShowBusinessDetail] = useState(false);

  const onSubmit = async (data: FormData) => {
    // 필수 항목 검증
    if (!data.companyName) {
      setError('companyName', {
        type: 'required',
        message: '필수 항목입니다',
      });
      return;
    }

    if (!data.businessType) {
      setError('businessType', {
        type: 'required',
        message: '필수 항목입니다',
      });
      return;
    }

    if (!data.representativeName) {
      setError('representativeName', {
        type: 'required',
        message: '필수 항목입니다',
      });
      return;
    }

    if (!data.establishmentDate) {
      setError('establishmentDate', {
        type: 'required',
        message: '필수 항목입니다',
      });
      return;
    }

    if (!data.businessNumber1 || !data.businessNumber2 || !data.businessNumber3) {
      setError('businessNumber1', {
        type: 'manual',
        message: '사업자 등록번호를 입력해주세요',
      });
      return;
    }

    if (!data.businessAgreement) {
      if (typeof window !== 'undefined') {
        alert('사업자 정보 제공 동의를 해주세요');
      }
      return;
    }

    // TODO: API 호출
    console.log('Submitted data:', data);

    // 다음 단계로 이동
    router.push('/mypage/accommodation/register/step2');
  };

  return (
    <div className="min-h-[calc(100dvh-68px)] py-8">
      <div className="flex flex-col items-center gap-16 w-full max-w-[472px] px-4 mx-auto">
        {/* 모바일: DisplayH3, 태블릿: DisplayH2, PC: DisplayH1*/}
        {/* <DisplayH3 className="block lg:hidden">숙소 신규 등록하기</DisplayH3>
        <DisplayH2 className="hidden lg:block xl:hidden">숙소 신규 등록하기</DisplayH2>
        <DisplayH1 className="hidden xl:block">숙소 신규 등록하기</DisplayH1>  */}
        {/* 모바일: DisplayH3(24px), 태블릿: 28px, PC: 32px */}
        <DisplayH3 className="lg:!text-[28px] xl:!text-[32px]">숙소 신규 등록하기</DisplayH3>

        <div className="w-full space-y-8">
          {/* 사업자 인증 */}
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
                  <Caption className="text-red-500">사업자 등록번호를 입력해주세요</Caption>
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
                    사업자 정보 제공 동의
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
          <Button type="submit" variant="primary" className="w-full">
            다음 단계로
          </Button>
        </form>
      </div>
    </div>
  );
}
