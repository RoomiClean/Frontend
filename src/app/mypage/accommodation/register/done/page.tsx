'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/app/_components/atoms/Button';
import { BodyDefault, DisplayH3 } from '@/app/_components/atoms/Typography';
import ColumnLogo from '@/assets/svg/ColumnLogo.svg';

export default function RegisterAccommodationDonePage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/home');
  };
  const handleLogin = () => {
    router.push('/mypage');
  };

  return (
    <div className="flex justify-center items-center h-full w-full pt-[100px]">
      <div className="flex flex-col items-center gap-16 w-full max-w-[600px] px-4">
        <DisplayH3 className="md:text-[28px] lg:text-[32px]">숙소 신규 등록 완료</DisplayH3>

        {/* Logo */}
        <div className="flex flex-col items-center gap-8">
          <Image src={ColumnLogo} alt="RoomiClean Logo" />
          <BodyDefault className="text-neutral-600">숙소 신규 등록이 완료되었습니다</BodyDefault>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full max-w-[400px]">
          <Button variant="secondary" onClick={handleGoHome} className="flex-1">
            메인 페이지로 이동
          </Button>
          <Button variant="primary" active onClick={handleLogin} className="flex-1">
            숙소 관리로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
