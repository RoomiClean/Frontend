'use client';

import { useRouter } from 'next/navigation';
import CompletePageSection from '@/app/_components/organisms/CompletePageSection';

export default function PasswordChangeCompletePage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/home');
  };

  const handleGoMyPage = () => {
    router.push('/mypage/userInformation');
  };

  return (
    <CompletePageSection
      pageTitle="비밀번호 변경하기"
      completeTitle="비밀번호 변경 완료"
      descriptionTexts={[
        '비밀번호 변경이 완료되었어요',
        '다음 접속부터 새로운 비밀번호로 접속해주세요',
      ]}
      actionButtons={[
        {
          label: '메인 페이지로 이동',
          onClick: handleGoHome,
          variant: 'secondary',
        },
        {
          label: '마이페이지로 이동',
          onClick: handleGoMyPage,
          variant: 'primary',
          active: true,
        },
      ]}
    />
  );
}
