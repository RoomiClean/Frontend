'use client';

import { BodyDefault, TitleH4, TitleLarge } from '@/app/_components/atoms/Typography';

interface PaymentSectionProps {
  isAutomatic: boolean;
}

export const PaymentSection = ({ isAutomatic }: PaymentSectionProps) => {
  const calculatePrice = (baseFee: number = 50000) => {
    const platformFee = Math.floor(baseFee * 0.15);
    const total = baseFee + platformFee;
    return { baseFee, platformFee, total };
  };

  return (
    <div className="mt-12 flex flex-col gap-6">
      <TitleH4 className="text-neutral-1000">결제 예상 금액</TitleH4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <BodyDefault className="text-neutral-800">
            {isAutomatic ? '기본 요금(회당)' : '기본 요금'}
          </BodyDefault>
          <TitleLarge className="text-neutral-1000">
            {calculatePrice().baseFee.toLocaleString()} 원
          </TitleLarge>
        </div>
        <div className="flex justify-between">
          <BodyDefault className="text-neutral-800">플랫폼 수수료 (15%)</BodyDefault>
          <TitleLarge className="text-neutral-1000">
            {calculatePrice().platformFee.toLocaleString()} 원
          </TitleLarge>
        </div>
      </div>
      <div>
        <div className="border-t border-neutral-300">
          <div className="flex justify-between py-6">
            <BodyDefault className="text-neutral-1000">결제 예정 금액</BodyDefault>
            <TitleH4 className="text-neutral-1000">
              {calculatePrice().total.toLocaleString()}원
            </TitleH4>
          </div>
        </div>
      </div>
    </div>
  );
};
