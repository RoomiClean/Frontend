'use client';

import { useState } from 'react';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import Toggle from '@/app/_components/atoms/Toggle';
import {
  DisplayH3,
  DisplayH4,
  BodyDefault,
  TitleH4,
  BodySmall,
} from '@/app/_components/atoms/Typography';

export default function NotificationSettingsPage() {
  const [promotionNotification, setPromotionNotification] = useState(false);
  const [appPushNotification, setAppPushNotification] = useState(true);

  const handlePromotionToggle = (checked: boolean) => {
    setPromotionNotification(checked);
    // TODO: API 호출로 프로모션 알림 설정 업데이트
    console.log('프로모션 알림 설정:', checked);
  };

  const handleAppPushToggle = (checked: boolean) => {
    setAppPushNotification(checked);
    // TODO: API 호출로 앱 푸시 알림 설정 업데이트
    console.log('앱 푸시 알림 설정:', checked);
  };

  return (
    <RoomMainTemplate>
      <div className="flex flex-col gap-8">
        {/* 페이지 타이틀 */}
        <DisplayH3 className="text-neutral-1000">알림 설정</DisplayH3>

        {/* 알림 수신 동의 섹션 */}
        <section className="w-full rounded-[20px] bg-neutral-100 border border-neutral-200 shadow-[0_6px_15px_0_rgba(0,0,0,0.1)] px-4 py-6 md:px-8 md:py-8">
          <TitleH4 className="text-neutral-1000 mb-6">알림 수신 동의</TitleH4>

          <div className="flex flex-col gap-6">
            {/* 프로모션 소식 알림 */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1 flex-1">
                <BodyDefault className="text-neutral-1000">프로모션 소식 알림</BodyDefault>
                <BodySmall className="text-neutral-600">
                  프로모션 소식이 있으면 카카오톡, SMS, 앱 푸시를 통해 알려드려요
                </BodySmall>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Toggle checked={promotionNotification} onChange={handlePromotionToggle} />
              </div>
            </div>

            {/* 앱 푸시 알림 */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1 flex-1">
                <BodyDefault className="text-neutral-1000">앱 푸시 알림</BodyDefault>
                <BodySmall className="text-neutral-600">
                  서비스 이용 중 중요한 이벤트 발생 시 앱 푸시를 통해 해당 소식을 알려드려요
                </BodySmall>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Toggle checked={appPushNotification} onChange={handleAppPushToggle} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </RoomMainTemplate>
  );
}
