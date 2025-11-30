'use client';
import Image from 'next/image';
import { Controller, Control, UseFormHandleSubmit, FieldErrors } from 'react-hook-form';
import { LineInput } from '@/app/_components/atoms/LineInput';
import Button from '@/app/_components/atoms/Button';
import { BodyDefault, DisplayDefault, BodySmall, TitleH4, BodyLarge } from '../atoms/Typography';
import { FindInfoFormData } from '@/hooks/useFindInfo';
import { LabeledInput } from './LabeledInput';
import ColumnLogo from '@/assets/svg/ColumnLogo.svg';
import Link from 'next/link';

interface FindPasswordProps {
  control: Control<FindInfoFormData>;
  handleSubmit: UseFormHandleSubmit<FindInfoFormData>;
  errors: FieldErrors<FindInfoFormData>;
  watchedValues: Partial<FindInfoFormData>;
  isCodeSent: boolean;
  isVerified: boolean;
  timeLeft: number;
  passwordStep: 'input' | 'reset' | 'complete';
  onSendCode: (phone?: string) => Promise<void>;
  onResendCode: (phone?: string) => Promise<void>;
  onVerifyCode: (phone?: string, code?: string) => Promise<void>;
  onPasswordReset: (data: FindInfoFormData) => Promise<void>;
  onPasswordResetComplete: (data: FindInfoFormData) => Promise<void>;
  onTabChange: () => void;
}

/**
 * 비밀번호 찾기 컴포넌트
 *
 * - 아이디와 휴대폰 인증을 통해 비밀번호를 재설정
 * - 입력, 인증 -> 재설정 -> 완료의 3단계로 구성
 *
 * @component
 * @param {FindPasswordProps} props - 컴포넌트 props
 */
export default function FindPassword({
  control,
  handleSubmit,
  errors,
  watchedValues,
  isCodeSent,
  isVerified,
  timeLeft,
  passwordStep,
  onSendCode,
  onResendCode,
  onVerifyCode,
  onPasswordReset,
  onPasswordResetComplete,
}: FindPasswordProps) {
  // --- 이메일, 전화번호 입력 단계 ---
  if (passwordStep === 'input') {
    return (
      <div className="flex flex-col items-center gap-[48px]">
        <div className="text-center text-neutral-1000">
          <BodyDefault>
            비밀번호를 잃어버리셨나요? <br />
            가입 시 등록한 이메일과 휴대폰 번호를 입력해주세요
          </BodyDefault>
        </div>

        {/* 비밀번호 재설정하기 입력 폼 */}
        <form className="flex flex-col gap-4 w-full">
          {/* 이메일 입력*/}
          <Controller
            name="id"
            control={control}
            rules={{ required: '이메일을 입력해주세요' }}
            render={({ field }) => (
              <LineInput
                placeholder="이메일을 입력해주세요"
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          />
          {errors.id && <BodySmall className="text-red-100 mt-1">{errors.id.message}</BodySmall>}

          {/* 휴대폰 번호 입력 및 인증번호 전송 */}
          <div>
            <div className="flex w-full justify-between gap-4">
              <div className="flex-1">
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: '휴대폰 번호를 입력해주세요' }}
                  render={({ field }) => (
                    <LineInput
                      placeholder="휴대폰 번호를 입력해주세요 (-제외)"
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
              <div className="w-[130px]">
                <Button
                  type="button"
                  active={!!watchedValues.id && !!watchedValues.phone && !isCodeSent && !isVerified}
                  disabled={!watchedValues.id || !watchedValues.phone || isVerified}
                  onClick={() => {
                    if (watchedValues.phone) {
                      if (isCodeSent) {
                        onResendCode(watchedValues.phone);
                      } else {
                        onSendCode(watchedValues.phone);
                      }
                    }
                  }}
                >
                  <BodyDefault>{isCodeSent ? '인증번호 재전송' : '인증번호 받기'}</BodyDefault>
                </Button>
              </div>
            </div>
            {errors.phone && (
              <div className="mt-1">
                <BodySmall className="ml-[2px] text-red-100">{errors.phone.message}</BodySmall>
              </div>
            )}
            {!errors.phone && isCodeSent && (
              <div className="mt-1">
                <BodySmall className="ml-[2px] text-green-500">
                  인증번호가 전송되었습니다.
                </BodySmall>
              </div>
            )}
          </div>

          {/* 인증번호 입력 */}
          {isCodeSent && (
            <div>
              <div className="flex w-full justify-between gap-4">
                <div className="flex-1 relative">
                  <Controller
                    name="verificationCode"
                    control={control}
                    rules={{ required: '인증번호 입력' }}
                    render={({ field }) => (
                      <LineInput
                        placeholder="인증번호 입력"
                        value={field.value ?? ''}
                        onChange={e => {
                          const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(onlyNumbers);
                        }}
                        inputMode="numeric"
                      />
                    )}
                  />
                  {timeLeft > 0 && !isVerified && (
                    <BodySmall className="absolute top-1/2 right-2 -translate-y-1/2 text-red-100">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </BodySmall>
                  )}
                </div>
                <div className="w-[130px]">
                  <Button
                    type="button"
                    active={isVerified}
                    disabled={isVerified || !watchedValues.verificationCode}
                    onClick={() => {
                      if (!isVerified && watchedValues.phone && watchedValues.verificationCode) {
                        onVerifyCode(watchedValues.phone, watchedValues.verificationCode);
                      }
                    }}
                  >
                    <BodyDefault>{isVerified ? '인증완료' : '인증번호 확인'}</BodyDefault>
                  </Button>
                </div>
              </div>
              {errors.verificationCode && (
                <div className="mt-1">
                  <BodySmall className="ml-[2px] text-red-100">
                    {errors.verificationCode.message}
                  </BodySmall>
                </div>
              )}
              {isVerified && !errors.verificationCode && (
                <div className="mt-1">
                  <BodySmall className="ml-[2px] text-green-500">인증이 완료되었습니다.</BodySmall>
                </div>
              )}
            </div>
          )}
        </form>
        {/* 인증 완료 후 비밀번호 재설정하기 버튼 */}
        {isVerified && (
          <Button active={true} onClick={handleSubmit(onPasswordReset)}>
            <DisplayDefault>비밀번호 재설정하기</DisplayDefault>
          </Button>
        )}
      </div>
    );
  }

  // --- 비밀번호 재설정 단계 ---
  if (passwordStep === 'reset') {
    return (
      <div className="flex flex-col gap-[48px]">
        <form className="flex flex-col gap-4 w-full">
          <TitleH4>비밀번호 재설정</TitleH4>
          <div className="flex flex-col gap-[32px]">
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: '새 비밀번호를 입력해주세요',
                minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다' },
              }}
              render={({ field }) => (
                <div>
                  <LabeledInput
                    label="새 비밀번호"
                    type="password"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    invisible
                    required
                  />
                  {errors.newPassword && (
                    <BodySmall className="text-red-100 mt-1">
                      {errors.newPassword.message}
                    </BodySmall>
                  )}
                  <BodySmall className="mt-2">
                    영문 대문자, 소문자, 숫자, 특수문자(@$!%*?&) 포함, 8~16자
                  </BodySmall>
                </div>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: '비밀번호를 다시 입력해주세요',
                validate: value =>
                  value === watchedValues.newPassword || '비밀번호가 일치하지 않습니다',
              }}
              render={({ field }) => (
                <div>
                  <LabeledInput
                    label="새 비밀번호 확인"
                    type="password"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    invisible
                    required
                  />
                  {errors.confirmPassword && (
                    <BodySmall className="text-red-100 mt-1">
                      {errors.confirmPassword.message}
                    </BodySmall>
                  )}
                </div>
              )}
            />
          </div>
        </form>
        <Button type="submit" onClick={handleSubmit(onPasswordResetComplete)} active={true}>
          <DisplayDefault>비밀번호 재설정</DisplayDefault>
        </Button>
      </div>
    );
  }

  // --- 비밀번호 재설정 완료 안내 단계 ---
  if (passwordStep === 'complete') {
    return (
      <div className="flex flex-col gap-4 w-full items-center text-center">
        <Image src={ColumnLogo} alt="ColumnLogo" />
        <BodyLarge className="mt-8 mb-12">비밀번호 재설정이 완료되었습니다</BodyLarge>
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
