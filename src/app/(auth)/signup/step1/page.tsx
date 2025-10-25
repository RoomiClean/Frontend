'use client';
import { useRouter } from 'next/navigation';
import { BiSolidUserPlus, BiSolidBuildings } from 'react-icons/bi';
import Button from '@/app/_components/atoms/Button';
import {
  DisplayH1,
  TitleDefault,
  BodyDefault,
  DisplayH3,
} from '@/app/_components/atoms/Typography';
import { AuthTemplate } from '@/app/_components/templates/AuthTemplate';

export default function SignUpStep1Page() {
  const router = useRouter();

  const handleTypeSelect = (type: 'cleaner' | 'host') => {
    router.push(`/signup/step2?type=${type}`);
  };

  return (
    <AuthTemplate>
      <div className="flex flex-col items-center gap-16 w-full max-w-[800px] px-4">
        <DisplayH1>회원가입</DisplayH1>

        {/* Step 표시 */}
        <div className="flex items-center gap-8">
          <TitleDefault>1. 회원 유형 선택</TitleDefault>
          <TitleDefault className="text-neutral-500">&gt;</TitleDefault>
          <TitleDefault className="text-neutral-500">2. 정보입력</TitleDefault>
          <TitleDefault className="text-neutral-500">&gt;</TitleDefault>
          <TitleDefault className="text-neutral-500">3. 가입완료</TitleDefault>
        </div>

        {/* 회원 유형 선택 */}
        <div className="flex w-[688px] h-[386px] border py-8 border-neutral-200 rounded-lg overflow-hidden items-center justify-center">
          {/* 청소자 회원가입 */}
          <div className="flex-1 flex flex-col items-center justify-between p-8 border-r border-neutral-200 h-full">
            <DisplayH3 className="text-center">청소자 회원가입</DisplayH3>
            <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center">
              <BiSolidUserPlus className="w-10 h-10 text-neutral-1000" />
            </div>
            <Button
              variant="secondary"
              onClick={() => handleTypeSelect('cleaner')}
              className="w-full"
            >
              가입하기
            </Button>
          </div>

          {/* 호스트 회원가입 */}
          <div className="flex-1 flex flex-col items-center justify-between p-8 h-full">
            <DisplayH3 className="text-center">호스트 회원가입</DisplayH3>
            <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center">
              <BiSolidBuildings className="w-10 h-10 text-neutral-1000" />
            </div>
            <Button variant="secondary" onClick={() => handleTypeSelect('host')} className="w-full">
              가입하기
            </Button>
          </div>
        </div>
      </div>
    </AuthTemplate>
  );
}
