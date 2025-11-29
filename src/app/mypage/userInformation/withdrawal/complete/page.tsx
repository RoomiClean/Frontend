'use client';

import { useRouter } from 'next/navigation';
import CompletePageSection from '@/app/_components/organisms/CompletePageSection';

export default function WithdrawalCompletePage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/home');
  };

  return (
    <CompletePageSection
      pageTitle="회원 탈퇴"
      completeTitle="회원 탈퇴 완료"
      descriptionTexts={[
        '더욱 발전된 루미클린이 되도록 앞으로도 계속 노력하겠습니다',
        '그동안 루미클린과 함께해주셔서 정말 감사드립니다',
      ]}
      actionButtons={[
        {
          label: '메인 페이지로 이동',
          onClick: handleGoHome,
          variant: 'secondary',
        },
      ]}
    />
  );
}
