'use client';

import { useRouter } from 'next/navigation';
import Button from '@/app/_components/atoms/Button';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import { DisplayH3, DisplayH4, BodyDefault } from '@/app/_components/atoms/Typography';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export default function PasswordChangeCompletePage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/home');
  };

  const handleGoMyPage = () => {
    router.push('/mypage/userInformation');
  };

  return (
    <RoomMainTemplate>
      <div className="flex flex-col items-center gap-8">
        {/* 페이지 타이틀 */}
        <DisplayH3 className="text-neutral-1000 w-full text-left">비밀번호 변경하기</DisplayH3>

        {/* 완료 메시지 */}
        <div className="flex flex-col items-center gap-6 w-full max-w-[600px]">
          {/* 체크마크 아이콘 */}
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
            <AiOutlineCheckCircle className="h-20 w-20 text-primary-400" />
          </div>

          {/* 완료 텍스트 */}
          <DisplayH4 className="text-neutral-1000">비밀번호 변경 완료</DisplayH4>

          {/* 설명 텍스트 */}
          <div className="flex flex-col gap-2 items-center">
            <BodyDefault className="text-neutral-600 text-center">
              비밀번호 변경이 완료되었어요
            </BodyDefault>
            <BodyDefault className="text-neutral-600 text-center">
              다음 접속부터 새로운 비밀번호로 접속해주세요
            </BodyDefault>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-4 w-full max-w-[400px] pt-4">
            <Button variant="secondary" onClick={handleGoHome} className="flex-1">
              <BodyDefault>메인 페이지로 이동</BodyDefault>
            </Button>
            <Button variant="primary" onClick={handleGoMyPage} className="flex-1" active>
              <BodyDefault>마이페이지로 이동</BodyDefault>
            </Button>
          </div>
        </div>
      </div>
    </RoomMainTemplate>
  );
}
