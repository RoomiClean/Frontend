'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import Button from '@/app/_components/atoms/Button';
import {
  DisplayH3,
  DisplayH4,
  BodyDefault,
  BodySmall,
  TitleDefault,
} from '@/app/_components/atoms/Typography';
import {
  WITHDRAWAL_PRECAUTIONS,
  WITHDRAWAL_INFO_RETENTION_DESCRIPTION,
  WITHDRAWAL_INFO_RETENTION_ITEMS,
} from '@/constants/withdrawal.constants';

export default function WithdrawalPage() {
  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const handleWithdraw = async () => {
    if (!isAgreed) {
      alert('유의사항에 동의해주세요.');
      return;
    }

    if (!confirm('정말 탈퇴하시겠습니까? 탈퇴 후에는 복구할 수 없습니다.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: 회원 탈퇴 API 연동
      // await withdrawMember();

      // 임시: API 연동 전까지는 alert로 처리
      alert('회원 탈퇴가 완료되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoomMainTemplate>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          {/* 페이지 타이틀 */}
          <DisplayH3 className="text-neutral-1000">회원 탈퇴</DisplayH3>

          {/* 부제목 */}
          <BodyDefault className="text-neutral-600">
            회원탈퇴 전 유의사항을 확인해주세요
          </BodyDefault>
        </div>
        {/* 메인 컨텐츠 카드 */}
        <div className="w-full rounded-[20px] bg-neutral-100 border border-neutral-200 shadow-[0_6px_15px_0_rgba(0,0,0,0.1)] px-4 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-8">
            {/* 유의 사항 섹션 */}
            <section className="flex flex-col gap-4">
              <DisplayH4 className="text-neutral-1000">유의 사항</DisplayH4>
              <div className="flex flex-col gap-3">
                {WITHDRAWAL_PRECAUTIONS.map((precaution, index) => (
                  <BodyDefault key={index} className="text-neutral-800">
                    {precaution}
                  </BodyDefault>
                ))}
              </div>
            </section>

            {/* 탈퇴 후 정보보관 섹션 */}
            <section className="flex flex-col gap-4">
              <DisplayH4 className="text-neutral-1000">탈퇴 후 정보보관</DisplayH4>
              <BodyDefault className="text-neutral-800">
                {WITHDRAWAL_INFO_RETENTION_DESCRIPTION}
              </BodyDefault>
              <div className="flex flex-col gap-2 mt-2">
                {WITHDRAWAL_INFO_RETENTION_ITEMS.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="">•</span>
                    <BodySmall className="text-neutral-700">{item}</BodySmall>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        {/* 동의 체크박스 */}
        <div className="flex items-center gap-3 pt-4 justify-center">
          <button
            type="button"
            onClick={() => setIsAgreed(!isAgreed)}
            className="flex-shrink-0 cursor-pointer transition-colors"
          >
            <AiOutlineCheckCircle
              className={`h-6 w-6 ${isAgreed ? 'text-primary-400' : 'text-neutral-400'}`}
            />
          </button>
          <label onClick={() => setIsAgreed(!isAgreed)} className="flex-1 cursor-pointer">
            <BodyDefault className="text-neutral-800">
              위 유의사항을 모두 확인하였고 회원탈퇴에 동의합니다
            </BodyDefault>
          </label>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-4 pt-4 justify-center">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-[210px]"
          >
            <BodyDefault>취소하기</BodyDefault>
          </Button>
          <Button
            variant="primary"
            onClick={handleWithdraw}
            active={isAgreed}
            disabled={!isAgreed || isSubmitting}
            className="w-[210px]"
          >
            <BodyDefault>탈퇴하기</BodyDefault>
          </Button>
        </div>
      </div>
    </RoomMainTemplate>
  );
}
