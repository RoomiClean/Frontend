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
    <div className="mt-8 lg:mt-0 flex flex-col gap-4 sm:gap-6">
      <TitleH4 className="text-neutral-1000 text-lg sm:text-xl">결제 예상 금액</TitleH4>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <BodyDefault className="text-neutral-800 text-sm sm:text-base">
            {isAutomatic ? '기본 요금(회당)' : '기본 요금'}
          </BodyDefault>
          <TitleLarge className="text-neutral-1000 text-base sm:text-lg">
            {calculatePrice().baseFee.toLocaleString()} 원
          </TitleLarge>
        </div>
        <div className="flex justify-between items-center">
          <BodyDefault className="text-neutral-800 text-sm sm:text-base">
            플랫폼 수수료 (15%)
          </BodyDefault>
          <TitleLarge className="text-neutral-1000 text-base sm:text-lg">
            {calculatePrice().platformFee.toLocaleString()} 원
          </TitleLarge>
        </div>
      </div>
      <div>
        <div className="border-t border-neutral-300">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <BodyDefault className="text-neutral-1000 text-sm sm:text-base">
              결제 예정 금액
            </BodyDefault>
            <TitleH4 className="text-neutral-1000 text-lg sm:text-xl">
              {calculatePrice().total.toLocaleString()}원
            </TitleH4>
          </div>
        </div>
      </div>
    </div>
  );
};
