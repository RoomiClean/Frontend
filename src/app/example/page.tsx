'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '../_components/atoms/Button';
import { Input } from '../_components/atoms/Input';
import {
  BodyDefault,
  BodyLarge,
  BodySmall,
  DisplayH3,
  DisplayH4,
  TitleDefault,
  TitleLarge,
  TitleSmall,
} from '../_components/atoms/Typography';
import { Dropdown } from '../_components/atoms/DropDown';
import { Textarea } from '../_components/atoms/Textarea';
import { Calendar } from '../_components/molecules/Calendar';
import Modal from '../_components/atoms/Modal';

interface FormValues {
  id: string;
}

export default function ExamplePage() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [textareaWithError, setTextareaWithError] = useState('');
  const [textareaDisabled, setTextareaDisabled] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const accommodationSchedulesData = [
    {
      id: 1,
      startDate: '2025년 11월 7일',
      endDate: '2025년 11월 11일',
    },
    {
      id: 2,
      startDate: '2025년 11월 18일',
      endDate: '2025년 11월 20일',
    },
  ];

  const lastCleaningScheduleData = {
    id: 1,
    date: '2025년 11월 5일',
    cleanerName: '김청소',
  };

  const reservedCleaningSchedulesData = [
    {
      id: 1,
      date: '2025년 11월 12일',
      cleanerName: '이청소',
      price: 50000,
    },
    {
      id: 2,
      date: '2025년 11월 22일',
      cleanerName: '박청소',
      price: 55000,
    },
    {
      id: 3,
      date: '2025년 11월 28일',
      cleanerName: '최청소',
      price: 50000,
    },
  ];

  const {
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      id: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
  };

  const options = [
    { value: 'woori', label: '우리은행' },
    { value: 'kookmin', label: '국민은행' },
    { value: 'nonghyeop', label: '농협은행' },
    { value: 'shinhan', label: '신한은행' },
  ];
  return (
    <div className="p-8 space-y-12">
      {/* Section: Title */}
      <section className="space-y-4">
        <TitleSmall className="text-primary-500">Title Small</TitleSmall>
        <TitleDefault className="text-secondary-500">Title Default</TitleDefault>
        <TitleLarge className="text-red-100">Title Large</TitleLarge>
      </section>

      {/* Section: Display */}
      <section className="space-y-4">
        <DisplayH4 className="text-green-200">Display H4</DisplayH4>
        <DisplayH3 className="text-yellow-200">Display H3</DisplayH3>
      </section>

      {/* Section: Body */}
      <section className="space-y-2">
        <BodySmall className="text-neutral-600">
          Body Small - 에어비앤비 호스트가 청소를 신속히 요청·관리하고, 개인/업체 청소자가 손쉽게
          매칭되어 수익을 창출하는 양면 플랫폼 구축
        </BodySmall>
        <BodyDefault className="text-neutral-700">
          Body Default - 호스트: 숙소 등록 → 달력/체크아웃 일정 연결 → 지도에서 숙소 상태 확인 →
          청소 요청(옵션/시간) → 매칭 확인 → 결제 → 검수/리뷰
        </BodyDefault>
        <BodyLarge className="text-neutral-900">
          Body Large - 청소자: 프로필 등록(가용지역·시간·장비·가격대) → 요청 피드 보기/필터 → 수락 →
          작업 체크리스트 진행(전/후 사진 포함) → 완료 제출 → 정산/리뷰
        </BodyLarge>
      </section>

      {/* Section: Color Preview */}
      <section>
        <h2 className="font-semibold text-2xl mb-4">Primary Colors</h2>
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-lg" />
          <div className="w-16 h-16 bg-primary-300 rounded-lg" />
          <div className="w-16 h-16 bg-primary-500 rounded-lg" />
          <div className="w-16 h-16 bg-primary-700 rounded-lg" />
        </div>
      </section>

      {/* Section: Button */}
      <section className="flex gap-4 w-[350px]">
        <Button active={true}>활성화된 버튼</Button>
        <Button>비활성 버튼</Button>
      </section>

      {/* Section: Input */}
      <section className="flex gap-4 w-[350px]">
        <form className="flex flex-col gap-4 w-[400px]">
          {/**
           * 입력 폼 구현 안내
           * - React Hook Form을 사용합니다.
           * - useForm과 Controller를 통해 value, onChange, onBlur, 에러 상태를 관리해주세요.
           */}
          <div onClick={() => setIsDisabled(prev => !prev)}>
            <Button active={isDisabled}>{isDisabled ? 'Enable Inputs' : 'Disable Inputs'}</Button>
          </div>

          <Controller
            name="id"
            control={control}
            rules={{
              required: '아이디를 입력해주세요.',
              minLength: { value: 4, message: '아이디는 최소 4글자 이상입니다.' },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="아이디를 입력하세요."
                disabled={isDisabled}
                error={!!errors.id}
              />
            )}
          />
          {errors.id && <span className="text-red-100 text-sm">{errors.id.message}</span>}
          <div onClick={() => onSubmit}>
            <Button active={!isDisabled}>제출</Button>
          </div>
        </form>
      </section>

      {/* Section: Dropdown */}
      <section className="w-[400px]">
        <Dropdown
          options={options}
          value={selectedValue}
          onChange={setSelectedValue}
          placeholder="옵션을 선택해주세요"
        />
      </section>

      {/* Section: Textarea */}
      <section className="flex flex-col gap-6 w-[400px]">
        <h2 className="font-semibold text-2xl mb-4">Textarea</h2>

        {/* 기본 Textarea */}
        <div className="space-y-2">
          <h3 className="font-medium text-base">기본 Textarea</h3>
          <Textarea
            placeholder="내용을 입력해주세요"
            value={textareaValue}
            onChange={e => setTextareaValue(e.target.value)}
            maxLength={500}
          />
        </div>

        {/* 에러 상태 Textarea */}
        <div className="space-y-2">
          <h3 className="font-medium text-base">에러 상태 Textarea</h3>
          <Textarea
            placeholder="내용을 입력해주세요"
            value={textareaWithError}
            onChange={e => setTextareaWithError(e.target.value)}
            error={true}
            maxLength={100}
          />
        </div>

        {/* 비활성화 상태 Textarea */}
        <div className="space-y-2">
          <h3 className="font-medium text-base">비활성화 상태 Textarea</h3>
          <Textarea
            placeholder="비활성화된 입력창입니다"
            value={textareaDisabled}
            onChange={e => setTextareaDisabled(e.target.value)}
            disabled={true}
          />
        </div>

        {/* 글자 수 제한 없는 Textarea */}
        <div className="space-y-2">
          <h3 className="font-medium text-base">글자 수 제한 없는 Textarea</h3>
          <Textarea
            placeholder="글자 수 제한이 없는 입력창입니다"
            value={textareaValue}
            onChange={e => setTextareaValue(e.target.value)}
            showCharCount={true}
          />
        </div>
      </section>

      {/* Section: Calendar */}
      <section className="w-full h-[500px]">
        <Calendar
          accommodationSchedules={accommodationSchedulesData}
          lastCleaningSchedule={lastCleaningScheduleData}
          reservedCleaningSchedules={reservedCleaningSchedulesData}
        />
      </section>

      {/* Section: Modal */}
      <section className="space-y-4">
        <h2 className="font-semibold text-2xl mb-4">Modal</h2>
        <div className="w-[350px]">
          <Button onClick={() => setIsModalOpen(true)}>모달 열기</Button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          width="600px"
          height="400px"
          padding="40px"
        >
          <p>예시 모달</p>
        </Modal>
      </section>
    </div>
  );
}
