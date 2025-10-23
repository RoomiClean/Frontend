'use client';
import { AuthTemplate } from '@/app/_components/templates/LoginTemplate';
import LoginForm from '@/app/_components/organisms/LoginForm';

export default function LoginPage() {
  const handleLogin = () => {
    console.log('로그인 api 연동');
  };

  return (
    <AuthTemplate>
      <LoginForm onLogin={handleLogin} />
    </AuthTemplate>
  );
}
