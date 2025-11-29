'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import { LabeledInput } from '@/app/_components/molecules/LabeledInput';
import { Input } from '@/app/_components/atoms/Input';
import { Dropdown } from '@/app/_components/atoms/DropDown';
import Button from '@/app/_components/atoms/Button';
import { Label } from '@/app/_components/atoms/Label';
import Modal from '@/app/_components/atoms/Modal';
import {
  DisplayH3,
  DisplayH4,
  BodySmall,
  BodyDefault,
  TitleDefault,
} from '@/app/_components/atoms/Typography';
import CameraIcon from '@/assets/svg/Camera.svg';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export default function ProfileEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO: 실제 로그인한 사용자 정보로 교체 예정
  const [formData, setFormData] = useState({
    profileImage: '/img/cleaner-male.png',
    name: '홍길동',
    birthYear: '2001',
    birthMonth: '12',
    birthDay: '30',
    gender: '남',
    phone: '01000000000',
  });

  // 휴대폰 번호 변경 모달 상태
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [isVerified, setIsVerified] = useState(false);

  // 생년월일 옵션 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0'),
  }));

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0'),
  }));

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 넘을 수 없습니다.');
        return;
      }

      // 파일 형식 검증 (JPG, PNG)
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        alert('JPG, PNG 형식의 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCodeSent && timer > 0 && !isVerified) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCodeSent, timer, isVerified]);

  const handlePhoneChange = () => {
    setIsPhoneModalOpen(true);
    setNewPhone('');
    setVerificationCode('');
    setIsCodeSent(false);
    setIsVerified(false);
    setTimer(180);
  };

  const handleSendVerificationCode = () => {
    if (!newPhone || newPhone.length < 10) {
      alert('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }
    // TODO: 인증번호 발송 API 호출
    setIsCodeSent(true);
    setTimer(180);
  };

  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert('4자리 인증번호를 입력해주세요.');
      return;
    }
    // TODO: 인증번호 확인 API 호출
    setIsVerified(true);
  };

  const handleCompletePhoneChange = () => {
    // TODO: 휴대폰 번호 변경 API 호출
    setIsPhoneModalOpen(false);
    setIsCompleteModalOpen(true);
    setFormData(prev => ({
      ...prev,
      phone: newPhone,
    }));
  };

  const handleCloseCompleteModal = () => {
    setIsCompleteModalOpen(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    // TODO: API 호출로 프로필 업데이트
    console.log('프로필 저장:', formData);
    router.push('/mypage/userInformation');
  };

  const isFormValid = formData.name.trim() !== '' && formData.phone.trim() !== '';

  return (
    <RoomMainTemplate>
      <div className="flex flex-col gap-8">
        {/* 페이지 타이틀 */}
        <DisplayH3 className="text-neutral-1000">프로필 편집하기</DisplayH3>

        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-8 w-[420px]">
            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-[180px] h-[180px] flex-shrink-0">
                <div className="w-[180px] h-[180px] rounded-full overflow-hidden bg-neutral-200">
                  <Image
                    src={formData.profileImage}
                    alt="프로필 이미지"
                    width={180}
                    height={180}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-100 rounded-full px-2 py-1 shadow-[0_6px_15px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_0_rgba(0,0,0,0.2)] transition-shadow z-10"
                >
                  <Image src={CameraIcon} alt="카메라 아이콘" width={20} height={20} />
                  <BodySmall className="text-neutral-1000">수정</BodySmall>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleProfileImageChange}
                className="hidden"
              />
              <BodySmall className="text-neutral-600 text-center">
                사진은 최대 1장, 5MB를 넘을 수 없습니다. (JPG, PNG 가능)
              </BodySmall>
            </div>

            {/* 이름 */}
            <LabeledInput
              label="이름"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="이름을 입력해주세요"
            />

            {/* 생년월일 */}
            <div className="flex flex-col gap-[16px] w-full">
              <Label>생년월일</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Dropdown
                    options={years}
                    value={formData.birthYear}
                    onChange={value => handleInputChange('birthYear', value)}
                    placeholder="년"
                  />
                </div>
                <div className="flex-1">
                  <Dropdown
                    options={months}
                    value={formData.birthMonth}
                    onChange={value => handleInputChange('birthMonth', value)}
                    placeholder="월"
                  />
                </div>
                <div className="flex-1">
                  <Dropdown
                    options={days}
                    value={formData.birthDay}
                    onChange={value => handleInputChange('birthDay', value)}
                    placeholder="일"
                  />
                </div>
              </div>
            </div>

            {/* 성별 */}
            <div className="flex flex-col gap-[16px] w-full">
              <Label>성별</Label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="남"
                    checked={formData.gender === '남'}
                    onChange={e => handleInputChange('gender', e.target.value)}
                    className="w-4 h-4 text-primary-400 border-neutral-300 focus:ring-primary-400 focus:ring-2"
                  />
                  <BodySmall className="text-neutral-1000">남</BodySmall>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="여"
                    checked={formData.gender === '여'}
                    onChange={e => handleInputChange('gender', e.target.value)}
                    className="w-4 h-4 text-primary-400 border-neutral-300 focus:ring-primary-400 focus:ring-2"
                  />
                  <BodySmall className="text-neutral-1000">여</BodySmall>
                </label>
              </div>
            </div>

            {/* 휴대폰 번호 */}
            <div className="flex flex-col gap-[16px] w-full">
              <Label>휴대폰 번호</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    placeholder="휴대폰 번호를 입력해주세요"
                    onlyNumber
                  />
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="primary"
                    onClick={handlePhoneChange}
                    className="px-6 whitespace-nowrap"
                  >
                    <BodySmall>변경하기</BodySmall>
                  </Button>
                </div>
              </div>
            </div>

            {/* 저장하기 버튼 */}
            <div className="pt-4">
              <Button
                variant="primary"
                active={isFormValid}
                onClick={handleSubmit}
                disabled={!isFormValid}
                type="button"
              >
                <BodySmall>저장하기</BodySmall>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 휴대폰 번호 변경 모달 */}
      <Modal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        width="500px"
        padding="32px"
      >
        <div className="w-full flex flex-col gap-6 items-start">
          <DisplayH4 className="text-neutral-1000">휴대폰 번호 변경하기</DisplayH4>
          <div className="space-y-2 w-full">
            <TitleDefault className="text-neutral-1000">새로운 휴대폰 번호 입력</TitleDefault>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  value={newPhone}
                  onChange={e => {
                    const value = e.target.value.replace(/-/g, '');
                    setNewPhone(value);
                  }}
                  onKeyDown={e => {
                    if (e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  placeholder="휴대폰 번호를 입력하세요 (-제외)"
                  onlyNumber
                  disabled={isCodeSent}
                  className="!h-12"
                />
              </div>
              <Button
                variant="primary"
                onClick={handleSendVerificationCode}
                disabled={!newPhone || newPhone.length < 10 || isCodeSent}
                className="!w-32 !h-12 flex-shrink-0"
              >
                {timer > 0 ? '인증번호 받기' : '인증번호 재전송'}
              </Button>
            </div>
          </div>
          {/* 인증번호 확인 */}
          <div className="space-y-2 w-full">
            <BodySmall className="text-neutral-1000">인증번호 확인</BodySmall>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Input
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  placeholder="6자리 숫자 입력"
                  onlyNumber
                  inputMode="numeric"
                  maxLength={6}
                  disabled={!isCodeSent || isVerified}
                  className="!h-12"
                  style={{ paddingRight: timer > 0 && !isVerified ? '64px' : undefined }}
                />
                {timer > 0 && !isVerified && (
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-red-500 font-mono text-sm">
                    {formatTimer(timer)}
                  </span>
                )}
              </div>
              <Button
                variant="primary"
                onClick={handleVerifyCode}
                disabled={
                  !verificationCode || verificationCode.length !== 6 || isVerified || !isCodeSent
                }
                className="!w-32 !h-12 flex-shrink-0"
              >
                인증하기
              </Button>
            </div>
          </div>
          {/* 변경하기 버튼 */}
          <div className="w-full pt-4">
            <Button
              variant="primary"
              onClick={handleCompletePhoneChange}
              disabled={!isVerified}
              active={isVerified}
              type="button"
            >
              <BodySmall>변경하기</BodySmall>
            </Button>
          </div>
        </div>
      </Modal>

      {/* 완료 모달 */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={handleCloseCompleteModal}
        width="400px"
        padding="40px"
        showCloseButton={false}
      >
        <div className="w-full flex flex-col items-center gap-6">
          {/* 체크마크 아이콘 */}
          <AiOutlineCheckCircle className="h-20 w-20 text-primary-400" />

          {/* 변경 완료 텍스트 */}
          <DisplayH4 className="text-neutral-1000">변경 완료</DisplayH4>

          {/* 설명 텍스트 */}
          <div className="flex flex-col gap-2 items-center">
            <BodyDefault className="text-neutral-600 text-center">
              휴대폰 번호 변경이 완료되었어요
            </BodyDefault>
            <BodyDefault className="text-neutral-600 text-center">
              변경된 정보는 마이페이지에서 확인해주세요
            </BodyDefault>
          </div>

          {/* 닫기 버튼 */}
          <div className="w-full pt-4">
            <Button variant="primary" onClick={handleCloseCompleteModal} active>
              <BodySmall>닫기</BodySmall>
            </Button>
          </div>
        </div>
      </Modal>
    </RoomMainTemplate>
  );
}
