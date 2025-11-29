'use client';

import { ReactNode } from 'react';
import Button from '@/app/_components/atoms/Button';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import { DisplayH3, DisplayH4, BodyDefault } from '@/app/_components/atoms/Typography';
import { AiOutlineCheckCircle } from 'react-icons/ai';

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  active?: boolean;
}

interface CompletePageSectionProps {
  pageTitle: string;
  completeTitle: string;
  descriptionTexts: string[];
  actionButtons: ActionButton[];
}

export default function CompletePageSection({
  pageTitle,
  completeTitle,
  descriptionTexts,
  actionButtons,
}: CompletePageSectionProps) {
  return (
    <RoomMainTemplate>
      <div className="flex flex-col items-center gap-8">
        {/* 페이지 타이틀 */}
        <DisplayH3 className="text-neutral-1000 w-full text-left">{pageTitle}</DisplayH3>

        {/* 완료 메시지 */}
        <div className="flex flex-col items-center gap-6 w-full max-w-[600px]">
          {/* 체크마크 아이콘 */}
          <AiOutlineCheckCircle className="h-20 w-20 text-primary-400" />

          {/* 완료 텍스트 */}
          <DisplayH4 className="text-neutral-1000">{completeTitle}</DisplayH4>

          {/* 설명 텍스트 */}
          <div className="flex flex-col gap-2 items-center">
            {descriptionTexts.map((text, index) => (
              <BodyDefault key={index} className="text-neutral-600 text-center">
                {text}
              </BodyDefault>
            ))}
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-4 w-full max-w-[400px] pt-4">
            {actionButtons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || 'secondary'}
                onClick={button.onClick}
                active={button.active}
                className="flex-1"
              >
                <BodyDefault>{button.label}</BodyDefault>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </RoomMainTemplate>
  );
}
