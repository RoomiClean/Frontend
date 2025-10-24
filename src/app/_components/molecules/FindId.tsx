'use client';
import { Controller, useForm } from 'react-hook-form';
import { LineInput } from '@/app/_components/atoms/LineInput';
import Button from '@/app/_components/atoms/Button';
import { BodyDefault, BodySmall, DisplayDefault } from '../atoms/Typography';
import { FindInfoFormData } from '@/hooks/useFindInfo';
import Link from 'next/link';

interface FindIdProps {
  isCodeSent: boolean;
  isVerified: boolean;
  timeLeft: number;
  foundId: string;
  idStep: 'input' | 'result';
  onSendCode: () => void;
  onResendCode: () => void;
  onVerifyCode: () => void;
  onIdFind: (data: FindInfoFormData) => void;
  onTabChange: () => void;
}

/**
 * 아이디 찾기 폼 컴포넌트
 *
 * - 이름과 휴대폰 번호로 인증 후 아이디를 조회
 * - 입력, 인증 -> 완료의 2단계로 구성
 *
 * @component
 * @param {FindIdProps} props - 컴포넌트 props
 */
export default function FindId({
  isCodeSent,
  isVerified,
  timeLeft,
  foundId,
  idStep,
  onSendCode,
  onResendCode,
  onVerifyCode,
  onIdFind,
}: FindIdProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FindInfoFormData>();

  const watchedValues = watch();

  // --- 이름, 전화번호 입력 단계 ---
  if (idStep === 'input') {
    return (
      <div className="flex flex-col items-center gap-[48px]">
        <div className="text-center text-neutral-1000">
          <BodyDefault>
            아이디를 잃어버리셨나요? <br />
            가입 시 등록한 이름과 휴대폰 번호를 입력해주세요
          </BodyDefault>
        </div>

        {/* 아이디 찾기 입력 폼 */}
        <form onSubmit={handleSubmit(onIdFind)} className="flex flex-col gap-4 w-full">
          {/* 이름 입력 */}
          <div>
            <Controller
              name="name"
              control={control}
              rules={{ required: '이름을 입력하세요' }}
              render={({ field }) => (
                <LineInput
                  placeholder="이름을 입력하세요"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.name && (
              <BodySmall className="text-red-100 mt-2">{errors.name.message}</BodySmall>
            )}
          </div>

          {/* 휴대폰 번호 입력 및 인증번호 전송 */}
          <div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: '휴대폰 번호를 입력하세요 (-제외)' }}
                  render={({ field }) => (
                    <LineInput
                      placeholder="휴대폰 번호를 입력하세요 (-제외)"
                      value={field.value ?? ''}
                      onChange={e => {
                        const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(onlyNumbers);
                      }}
                      inputMode="numeric"
                    />
                  )}
                />
              </div>

              <Button
                type="button"
                className="w-[120px]"
                active={!!watchedValues.name && !!watchedValues.phone && !isCodeSent}
                disabled={!watchedValues.name || !watchedValues.phone}
                onClick={isCodeSent ? onResendCode : onSendCode}
              >
                <BodyDefault>{isCodeSent ? '인증번호 재전송' : '인증번호 받기'}</BodyDefault>
              </Button>
            </div>
          </div>

          {/* 인증번호 입력 */}
          {isCodeSent && (
            <div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Controller
                    name="verificationCode"
                    control={control}
                    rules={{ required: '4자리 숫자입력' }}
                    render={({ field }) => (
                      <LineInput
                        placeholder="4자리 숫자입력"
                        value={field.value ?? ''}
                        onChange={e => {
                          const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(onlyNumbers);
                        }}
                        inputMode="numeric"
                        maxLength={4}
                      />
                    )}
                  />
                  {timeLeft > 0 && (
                    <BodySmall className="absolute top-1/2 right-2 -translate-y-1/2 text-red-100">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </BodySmall>
                  )}
                </div>

                <Button
                  type="button"
                  className="w-[120px]"
                  active={!!watchedValues.verificationCode && !isVerified}
                  disabled={!watchedValues.verificationCode}
                  onClick={onVerifyCode}
                >
                  <BodyDefault>인증번호 확인</BodyDefault>
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* 인증 완료 후 아이디 찾기 버튼 */}
        {isVerified && (
          <Button onClick={handleSubmit(onIdFind)} active={true}>
            <DisplayDefault>아이디 찾기</DisplayDefault>
          </Button>
        )}
      </div>
    );
  }

  // --- 아이디 결과 단계 ---
  if (idStep === 'result') {
    return (
      <div className="flex flex-col gap-12 w-full text-center">
        <BodyDefault className="text-neutral-1000">
          회원님은 다음 정보로 가입되어 있습니다
        </BodyDefault>
        <div className="py-4 bg-neutral-100 border-[1px] border-neutral-300 rounded-[8px]">
          <BodyDefault className="text-neutral-500">아이디 : </BodyDefault>
          <BodyDefault className="text-neutral-1000">{foundId}</BodyDefault>
        </div>
        <div className="flex gap-[10px] w-full">
          <Link href={'/home'} className="flex-1">
            <Button variant="secondary">
              <DisplayDefault>홈으로 이동</DisplayDefault>
            </Button>
          </Link>
          <Link href={'/login'} className="flex-1">
            <Button active={true}>
              <DisplayDefault>로그인하기</DisplayDefault>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
