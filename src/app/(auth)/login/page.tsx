'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthTemplate } from '@/app/_components/templates/AuthTemplate';
import LoginForm from '@/app/_components/organisms/LoginForm';
import { useLogin } from '@/app/_lib/queries/auth.queries';
import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/app/_lib/api-response.types';

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = (email: string, password: string) => {
    login(
      { email, password },
      {
        onSuccess: () => {
          router.push('/home');
        },
        onError: error => {
          console.error('로그인 실패:', error);
          if (error instanceof AxiosError && error.response) {
            if (error.response.status === 404) {
              setErrorMessage('등록되지 않은 아이디 또는 비밀번호입니다.');
              return;
            }
            const apiError = error.response.data as ApiErrorResponse;
            if (apiError?.message) {
              setErrorMessage(apiError.message);
              return;
            }
          }
          setErrorMessage('아이디와 비밀번호를 확인해주세요.');
        },
      },
    );
  };

  return (
    <AuthTemplate>
      <LoginForm onLogin={handleLogin} isLoading={isPending} errorMessage={errorMessage} />
    </AuthTemplate>
  );
}
