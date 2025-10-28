'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { TitleDefault } from '@/app/_components/atoms/Typography';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      // 이전 단계로 이동 가능
      if (step === 1) {
        router.push('/signup/step1');
      } else if (step === 2) {
        const memberType = searchParams.get('type');
        if (memberType) {
          router.push(`/signup/step2?type=${memberType}`);
        } else {
          router.push('/signup/step2?type=cleaner');
        }
      }
      // currentStep이 3인 경우 step3로는 이동하지 않음 (약관동의는 다시 안 해도 됨)
    }
  };

  const getStepStyle = (step: number) => {
    const isActive = step === currentStep;
    return isActive
      ? 'text-neutral-1000 cursor-default'
      : 'text-neutral-500 cursor-pointer hover:text-neutral-700';
  };

  const isClickable = (step: number) => {
    return step < currentStep;
  };

  return (
    <div className="flex items-center gap-4">
      <div onClick={() => isClickable(1) && handleStepClick(1)}>
        <TitleDefault className={getStepStyle(1)}>1. 회원 유형 선택</TitleDefault>
      </div>
      <TitleDefault className="text-neutral-500">&gt;</TitleDefault>
      <div onClick={() => isClickable(2) && handleStepClick(2)}>
        <TitleDefault className={getStepStyle(2)}>2. 정보입력</TitleDefault>
      </div>
      <TitleDefault className="text-neutral-500">&gt;</TitleDefault>
      <div>
        <TitleDefault className={getStepStyle(3)}>3. 가입완료</TitleDefault>
      </div>
    </div>
  );
}
