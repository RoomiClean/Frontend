'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import Button from '@/app/_components/atoms/Button';
import { LabeledInput } from '@/app/_components/molecules/LabeledInput';
import { DisplayH3, BodyDefault, Caption } from '@/app/_components/atoms/Typography';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
const HANGUL_REGEX = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/g;

interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordChangeFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<Record<string, boolean>>({});

  const {
    register,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<PasswordChangeFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const currentPassword = watch('currentPassword');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const newPasswordRegister = register('newPassword', {
    required: '새 비밀번호를 입력해주세요',
    validate: (value: string) => {
      if (!value) return true; // 빈 값은 required로 처리
      if (HANGUL_REGEX.test(value)) {
        return '비밀번호에 한글을 사용할 수 없습니다';
      }
      if (!PASSWORD_REGEX.test(value)) {
        return '비밀번호 조합이 일치하지 않습니다';
      }
      return true;
    },
  });

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    newPasswordRegister.onChange(e);
    trigger('newPassword');
  };

  const confirmPasswordRegister = register('confirmPassword', {
    required: '새 비밀번호를 다시 한 번 입력해주세요',
    validate: (value: string) => {
      if (!value) return true; // 빈 값은 required로 처리
      if (HANGUL_REGEX.test(value)) {
        return '비밀번호에 한글을 사용할 수 없습니다';
      }
      const currentNewPassword = getValues('newPassword');
      if (currentNewPassword && value !== currentNewPassword) {
        return '비밀번호가 일치하지 않습니다';
      }
      return true;
    },
  });

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    confirmPasswordRegister.onChange(e);
    trigger('confirmPassword');
  };

  // newPassword가 변경될 때 confirmPassword 재검증
  useEffect(() => {
    if (confirmPassword) {
      trigger('confirmPassword');
    }
  }, [newPassword, confirmPassword, trigger]);

  // success 상태를 errors 기반으로 계산
  useEffect(() => {
    setSuccess(prev => ({
      ...prev,
      newPassword:
        !!newPassword && !errors.newPassword?.message && PASSWORD_REGEX.test(newPassword),
      confirmPassword:
        !!confirmPassword && !errors.confirmPassword?.message && newPassword === confirmPassword,
    }));
  }, [newPassword, confirmPassword, errors.newPassword?.message, errors.confirmPassword?.message]);

  const onSubmit = async (data: PasswordChangeFormData) => {
    // 기존 비밀번호 검증
    if (!data.currentPassword) {
      setError('currentPassword', {
        type: 'manual',
        message: '기존 비밀번호를 입력해주세요',
      });
      return;
    }

    // 새 비밀번호 검증
    if (!PASSWORD_REGEX.test(data.newPassword)) {
      setError('newPassword', {
        type: 'manual',
        message: '비밀번호는 8-16자, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다',
      });
      return;
    }

    // 비밀번호 확인 검증
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: '비밀번호가 일치하지 않습니다',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 비밀번호 변경 API 호출
      // await changePasswordAPI({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      // });

      // 임시로 성공 처리
      await new Promise(resolve => setTimeout(resolve, 500));

      router.push('/mypage/userInformation/password/complete');
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      setError('currentPassword', {
        type: 'manual',
        message: '기존 비밀번호가 일치하지 않습니다',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    !errors.currentPassword &&
    !errors.newPassword &&
    !errors.confirmPassword;

  return (
    <RoomMainTemplate>
      <div className="flex flex-col gap-8 min-h-[calc(100vh-200px)]">
        {/* 페이지 타이틀 */}
        <DisplayH3 className="text-neutral-1000">비밀번호 변경하기</DisplayH3>

        {/* 비밀번호 변경 폼 */}
        <div className="flex flex-1 items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-[420px]">
            {/* 기존 비밀번호 입력 */}
            <div className="space-y-2">
              <LabeledInput
                label="기존 비밀번호 입력"
                placeholder="기존 비밀번호를 입력해주세요"
                type="password"
                invisible
                {...register('currentPassword', {
                  required: '기존 비밀번호를 입력해주세요',
                })}
                error={!!errors.currentPassword}
              />
              {errors.currentPassword && (
                <Caption className="text-red-500">{errors.currentPassword.message}</Caption>
              )}
            </div>

            {/* 새 비밀번호 입력 */}
            <div className="space-y-2">
              <LabeledInput
                label="새 비밀번호 입력"
                placeholder="새 비밀번호를 입력해주세요"
                type="password"
                invisible
                {...newPasswordRegister}
                onChange={handleNewPasswordChange}
                error={!!errors.newPassword}
              />
              <Caption className="text-neutral-500">
                영문 대문자, 소문자, 숫자, 특수문자(@$!%*?&) 포함, 8~16자
              </Caption>
              {errors.newPassword && (
                <Caption className="text-red-500">{errors.newPassword.message}</Caption>
              )}
            </div>

            {/* 새 비밀번호 확인 */}
            <div className="space-y-2">
              <LabeledInput
                label="새 비밀번호 확인"
                placeholder="새 비밀번호를 다시 한 번 입력해주세요"
                type="password"
                invisible
                {...confirmPasswordRegister}
                onChange={handleConfirmPasswordChange}
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <Caption className="text-red-500">{errors.confirmPassword.message}</Caption>
              )}
              {success.confirmPassword && (
                <Caption className="text-green-500">비밀번호가 일치합니다</Caption>
              )}
            </div>

            {/* 비밀번호 변경하기 버튼 */}
            <Button
              type="submit"
              variant="primary"
              active={!!isFormValid}
              disabled={isSubmitting || !isFormValid}
              className="w-full"
            >
              <BodyDefault>비밀번호 변경하기</BodyDefault>
            </Button>
          </form>
        </div>
      </div>
    </RoomMainTemplate>
  );
}
