'use client';
import { useRouter } from 'next/navigation';
import { AuthTemplate } from '@/app/_components/templates/AuthTemplate';
import LoginForm from '@/app/_components/organisms/LoginForm';
import { useLogin } from '@/app/_lib/queries/auth.queries';

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const handleLogin = (email: string, password: string) => {
    login(
      { email, password },
      {
        onSuccess: () => {
          router.push('/home');
        },
        onError: error => {
          console.error('로그인 실패:', error);
        },
      },
    );
  };

  return (
    <AuthTemplate>
      <LoginForm onLogin={handleLogin} isLoading={isPending} />
    </AuthTemplate>
  );
}
