'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/app/_components/atoms/Button';
import { BodyDefault, DisplayH1 } from '@/app/_components/atoms/Typography';
import { AuthTemplate } from '@/app/_components/templates/AuthTemplate';
import ColumnLogo from '@/assets/svg/ColumnLogo.svg';

export default function SignUpStep3Page() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/home');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <AuthTemplate>
      <div className="flex flex-col items-center gap-16 w-full max-w-[600px] px-4 my-[100px]">
        <DisplayH1>회원가입</DisplayH1>

        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <Image src={ColumnLogo} alt="RoomiClean Logo" />
          <BodyDefault className="text-neutral-600">회원가입이 완료되었습니다</BodyDefault>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full max-w-[400px]">
          <Button variant="secondary" onClick={handleGoHome} className="flex-1">
            홈으로 이동
          </Button>
          <Button variant="primary" onClick={handleLogin} className="flex-1">
            로그인 하기
          </Button>
        </div>
      </div>
    </AuthTemplate>
  );
}
