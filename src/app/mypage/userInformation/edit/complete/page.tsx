'use client';

import { useRouter } from 'next/navigation';
import CompletePageSection from '@/app/_components/organisms/CompletePageSection';

export default function ProfileEditCompletePage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/home');
  };

  const handleGoMyPage = () => {
    router.push('/mypage/userInformation');
  };

  return (
    <CompletePageSection
      pageTitle="프로필 편집하기"
      completeTitle="프로필 편집 완료"
      descriptionTexts={[
        '프로필 정보 변경이 완료되었어요',
        '변경된 정보는 마이페이지에서 확인해주세요',
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
