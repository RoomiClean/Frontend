'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import Modal from '@/app/_components/atoms/Modal';
import Button from '@/app/_components/atoms/Button';
import { Input } from '@/app/_components/atoms/Input';
import {
  DisplayH3,
  DisplayH4,
  BodyDefault,
  BodySmall,
  TitleDefault,
  Caption,
} from '@/app/_components/atoms/Typography';
import { useSendSmsCode, useVerifySmsCode } from '@/app/_lib/queries';
import { ApiErrorResponse } from '@/app/_lib/api-response.types';
import { BsQuestionCircle } from 'react-icons/bs';

const VERIFICATION_DURATION = 180; // 3분

interface VerificationFormData {
  phone: string;
  verificationCode: string;
}

export default function PasswordChangePage() {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(true);
  const [verificationTimer, setVerificationTimer] = useState(0);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [success, setSuccess] = useState<Record<string, boolean>>({});

  const { mutateAsync: sendSmsCodeMutate } = useSendSmsCode();
  const { mutateAsync: verifySmsCodeMutate } = useVerifySmsCode();

  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<VerificationFormData>({
    defaultValues: {
      phone: '',
      verificationCode: '',
    },
  });

  const phone = watch('phone');
  const verificationCode = watch('verificationCode');

  // 타이머 관리
  useEffect(() => {
    if (verificationTimer <= 0) return;

    const interval = setInterval(() => {
      setVerificationTimer(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [verificationTimer]);

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isVerificationActive = verificationTimer > 0;
  const isVerificationInputDisabled =
    !isVerificationRequested || (!isVerificationActive && !success.verificationCode);

  const handleConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const sendVerificationCode = async () => {
    if (!phone) {
      setError('phone', { type: 'manual', message: '전화번호를 입력해주세요' });
      return;
    }

    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError('phone', { type: 'manual', message: '올바른 전화번호 형식이 아닙니다' });
      return;
    }

    try {
      await sendSmsCodeMutate(phone);
      setVerificationTimer(VERIFICATION_DURATION);
      setIsVerificationRequested(true);
      clearErrors('phone');
      setSuccess(prev => ({ ...prev, phone: true }));
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        '인증번호 전송에 실패했습니다';
      setError('phone', { type: 'manual', message: errorMessage });
      setSuccess(prev => ({ ...prev, phone: false }));
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      setError('verificationCode', { type: 'manual', message: '인증번호를 입력해주세요' });
      return;
    }

    try {
      await verifySmsCodeMutate({ phone, code: verificationCode });
      clearErrors('verificationCode');
      setSuccess(prev => ({ ...prev, verificationCode: true }));
      setIsPhoneVerified(true);
      setVerificationTimer(0);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      let errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        '인증번호가 일치하지 않습니다';
      errorMessage = errorMessage.replace(/^\[.*?\]\s*/, '');
      setError('verificationCode', {
        type: 'manual',
        message: errorMessage,
      });
      setSuccess(prev => ({ ...prev, verificationCode: false }));
    }
  };

  const handleNextStep = () => {
    if (!isPhoneVerified) {
      alert('전화번호 인증을 완료해주세요');
      return;
    }
    router.push('/mypage/userInformation/password/change');
  };

  return (
    <RoomMainTemplate>
      <div className="flex flex-col gap-8 min-h-[calc(100vh-200px)]">
        {/* 페이지 타이틀 */}
        <DisplayH3 className="text-neutral-1000">비밀번호 변경하기</DisplayH3>

        {/* 번호인증 재확인 모달 */}
        <Modal
          isOpen={showConfirmModal}
          onClose={handleConfirmModal}
          width="500px"
          height="auto"
          padding="48px"
          showCloseButton={false}
        >
          <div className="flex flex-col items-center gap-6">
            {/* 물음표 아이콘 */}
            <BsQuestionCircle className="h-20 w-20 text-primary-400" />

            {/* 질문 텍스트 */}
            <DisplayH4 className="text-neutral-1000 text-center font-semibold">
              번호인증을 다시 하시겠습니까?
            </DisplayH4>

            {/* 설명 텍스트 */}
            <BodyDefault className="text-neutral-600 text-center">
              비밀번호 변경을 하려면 다시 한 번 번호인증을 해야해요
            </BodyDefault>

            {/* 인증하기 버튼 */}
            <Button variant="primary" onClick={handleConfirmModal} active className="w-full">
              <BodyDefault>인증하기</BodyDefault>
            </Button>
          </div>
        </Modal>

        {/* 인증 폼 */}
        <div className="flex flex-1 items-start md:items-center justify-center">
          <div className="flex flex-col w-[420px] space-y-8">
            {/* 휴대폰 번호 입력 */}
            <div className="space-y-2">
              <TitleDefault className="text-neutral-1000">
                휴대폰 번호 입력 <span className="text-red-500">*</span>
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
                      clearErrors('phone');
                    }}
                    onKeyDown={e => {
                      if (e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={sendVerificationCode}
                  className="!w-32 !h-12 flex-shrink-0"
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
                    style={{ paddingRight: verificationTimer > 0 ? '64px' : undefined }}
                  />
                  {verificationTimer > 0 && (
                    <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-red-500 font-mono text-sm">
                      {formatTimer(verificationTimer)}
                    </span>
                  )}
                </div>
                <Button
                  variant="primary"
                  onClick={verifyCode}
                  disabled={!isVerificationActive}
                  className="!w-32 !h-12 flex-shrink-0"
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

            {/* 다음 단계로 버튼 */}
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={handleNextStep}
                active={isPhoneVerified}
                disabled={!isPhoneVerified}
                type="button"
                className="w-full"
              >
                <BodyDefault>다음 단계로</BodyDefault>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RoomMainTemplate>
  );
}
