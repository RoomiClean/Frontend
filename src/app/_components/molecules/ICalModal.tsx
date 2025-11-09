'use client';

import { useState, useEffect } from 'react';
import Modal from '../atoms/Modal';
import { Input } from '../atoms/Input';
import { Dropdown } from '../atoms/DropDown';
import Button from '../atoms/Button';
import { DisplayH3, TitleDefault, DisplayDefault } from '../atoms/Typography';
import { ICAL_SYNC_PERIOD_OPTIONS } from '@/constants/business.constants';

interface ICalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string, syncPeriod: string) => void;
  isEdit?: boolean;
  initialUrl?: string;
  initialSyncPeriod?: string;
}

/**
 * iCal 캘린더 연동/수정 모달 컴포넌트
 *
 * @description
 * - 신규 연동 시: URL 입력 및 동기화 주기 선택
 * - 수정 시: 기존 값 표시, 변경 사항이 없으면 버튼 disabled
 */
export default function ICalModal({
  isOpen,
  onClose,
  onSave,
  isEdit = false,
  initialUrl = '',
  initialSyncPeriod = '',
}: ICalModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [syncPeriod, setSyncPeriod] = useState<string>(initialSyncPeriod);

  // 모달이 열릴 때마다 초기값 재설정
  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setSyncPeriod(initialSyncPeriod);
    }
  }, [isOpen, initialUrl, initialSyncPeriod]);

  // 수정 모드일 때 변경 사항 확인
  const hasChanges = isEdit
    ? url !== initialUrl || syncPeriod !== initialSyncPeriod
    : url.trim() !== '' && syncPeriod !== '';

  const handleSave = () => {
    if (!hasChanges) return;
    onSave(url, syncPeriod);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} padding="20px">
      <div className="flex flex-col gap-6">
        {/* 제목 */}
        <DisplayH3 className="text-neutral-1000 mt-6">iCal 캘린더 연동</DisplayH3>

        {/* iCal URL 입력 */}
        <div>
          <div className="flex flex-col gap-3 mb-4">
            <TitleDefault className="text-neutral-1000">iCal URL 입력</TitleDefault>
            <Input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="iCal URL을 입력해주세요"
            />
          </div>

          {/* 동기화 주기 설정 */}
          <div className="flex flex-col gap-3">
            <TitleDefault className="text-neutral-1000">동기화 주기 설정</TitleDefault>
            <Dropdown
              options={ICAL_SYNC_PERIOD_OPTIONS}
              value={syncPeriod}
              onChange={setSyncPeriod}
              placeholder="옵션 선택"
            />
          </div>
        </div>

        {/* 설정하기 버튼 */}
        <Button
          variant="primary"
          onClick={handleSave}
          active={hasChanges}
          disabled={!hasChanges}
          className="w-full h-[46px]"
        >
          <DisplayDefault>설정하기</DisplayDefault>
        </Button>
      </div>
    </Modal>
  );
}
