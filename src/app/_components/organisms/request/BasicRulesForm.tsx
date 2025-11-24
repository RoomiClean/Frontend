'use client';

import {
  Control,
  Controller,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from 'react-hook-form';
import { Input } from '@/app/_components/atoms/Input';
import { DatePicker } from '@/app/_components/atoms/DatePicker';
import { TimePicker } from '@/app/_components/atoms/TimePicker';
import { Dropdown } from '@/app/_components/atoms/DropDown';
import {
  BodyDefault,
  Caption,
  TitleDefault,
  TitleH4,
  TitleSmall,
} from '@/app/_components/atoms/Typography';
import type { RequestFormData } from '@/types/requestForm.types';
import type { DropdownOption } from '@/types/dropdown.types';
import { LAUNDRY_TYPES } from '@/constants/requestForm.constants';
import {
  isToday as checkIsToday,
  getCurrentTimeRounded,
  subtract30Minutes,
  add30Minutes,
} from '@/utils/dateTime.utils';

interface BasicRulesFormProps {
  isAutomatic: boolean;
  control: Control<RequestFormData>;
  register: UseFormRegister<RequestFormData>;
  watch: UseFormWatch<RequestFormData>;
  setValue: UseFormSetValue<RequestFormData>;
  errors: FieldErrors<RequestFormData>;
  accommodationOptions: DropdownOption[];
}

export const BasicRulesForm = ({
  isAutomatic,
  control,
  register,
  watch,
  setValue,
  errors,
  accommodationOptions,
}: BasicRulesFormProps) => {
  const cleaningType = watch('cleaningType');
  const triggerType = watch('triggerType');
  const requestDate = watch('requestDate');
  const requestStartTime = watch('requestStartTime');
  const requestEndTime = watch('requestEndTime');
  const requestPeriodStart = watch('requestPeriodStart');
  const requestPeriodEnd = watch('requestPeriodEnd');
  const laundryItems = watch('laundryItems');

  // 오늘 날짜인지 확인
  const isToday = () => checkIsToday(requestDate);

  // 세탁물 수량이 하나라도 입력되었는지 확인
  const hasLaundryItems = () => {
    if (!laundryItems || typeof laundryItems !== 'object') return false;
    return Object.values(laundryItems).some(value => value > 0);
  };

  // 세탁물 수량 업데이트
  const updateLaundryQuantity = (itemId: string, quantity: number) => {
    const currentItems = watch('laundryItems') || {};
    setValue('laundryItems', {
      ...currentItems,
      [itemId]: quantity >= 0 ? quantity : 0,
    });
  };

  const handleAccommodationChange = (value: string) => {
    setValue('accommodationId', value);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <TitleH4 className="text-neutral-1000">기본 규칙 설정</TitleH4>
        <div className="flex items-center gap-1">
          <span className="text-red-500">*</span>
          <TitleSmall className="text-neutral-1000">필수입력사항</TitleSmall>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          {/* 숙소 선택 */}
          <TitleDefault className="text-neutral-1000">
            {isAutomatic ? '자동 요청 활성화' : '숙소 선택'}
            <span className="text-red-500">*</span>
          </TitleDefault>
          <div>
            <Controller
              name="accommodationId"
              control={control}
              rules={{ required: '숙소를 선택해주세요' }}
              render={({ field }) => (
                <Dropdown
                  options={accommodationOptions}
                  value={field.value}
                  onChange={value => {
                    field.onChange(value);
                    handleAccommodationChange(value);
                  }}
                  placeholder="요청하실 숙소를 선택해주세요"
                  error={!!errors.accommodationId}
                />
              )}
            />
            {errors.accommodationId && (
              <Caption className="text-red-500 mt-1">{errors.accommodationId.message}</Caption>
            )}
          </div>
        </div>

        {/* 자동 요청 전용: 트리거 시점 */}
        {isAutomatic && (
          <div>
            <div className="mb-3">
              <TitleSmall className="text-neutral-1000">청소 요청 트리거 시점 *</TitleSmall>
            </div>

            <Controller
              name="triggerType"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="immediate"
                      checked={field.value === 'immediate'}
                      onChange={() => field.onChange('immediate')}
                      className="w-4 h-4 accent-neutral-1000"
                    />
                    <BodyDefault className="text-neutral-1000">체크아웃 즉시</BodyDefault>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="hours-after"
                      checked={field.value === 'hours-after'}
                      onChange={() => field.onChange('hours-after')}
                      className="w-4 h-4 accent-neutral-1000"
                    />
                    <BodyDefault className="text-neutral-600">체크아웃</BodyDefault>
                    <Controller
                      name="triggerHours"
                      control={control}
                      rules={{
                        validate: value => {
                          if (triggerType === 'hours-after' && (!value || value === '')) {
                            return '시간을 입력해주세요';
                          }
                          if (triggerType === 'hours-after' && value) {
                            const numValue = Number(value);
                            if (numValue < 1 || numValue > 12) {
                              return '1 이상 12 이하의 숫자를 입력해주세요';
                            }
                          }
                          return true;
                        },
                      }}
                      render={({ field: hoursField }) => (
                        <input
                          type="number"
                          min="1"
                          max="12"
                          disabled={triggerType !== 'hours-after'}
                          value={triggerType === 'hours-after' ? hoursField.value || '' : ''}
                          onChange={e => {
                            const value = e.target.value;
                            if (value === '') {
                              hoursField.onChange('');
                              return;
                            }
                            const numValue = Number(value);
                            if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
                              hoursField.onChange(numValue);
                            } else if (numValue > 12) {
                              hoursField.onChange(12);
                            } else if (numValue < 1 && numValue > 0) {
                              hoursField.onChange(1);
                            }
                          }}
                          onBlur={hoursField.onBlur}
                          className="w-[41px] h-[28px] px-2 py-0 border border-neutral-300 rounded-lg text-center text-neutral-1000 bg-neutral-100 disabled:bg-neutral-200/50 disabled:text-neutral-500 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      )}
                    />
                    <BodyDefault className="text-neutral-600">시간 후</BodyDefault>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="hours-before"
                      checked={field.value === 'hours-before'}
                      onChange={() => field.onChange('hours-before')}
                      className="w-4 h-4 accent-neutral-1000"
                    />
                    <BodyDefault className="text-neutral-600">다음 체크인</BodyDefault>
                    <Controller
                      name="triggerHours"
                      control={control}
                      rules={{
                        validate: value => {
                          if (triggerType === 'hours-before' && (!value || value === '')) {
                            return '시간을 입력해주세요';
                          }
                          if (triggerType === 'hours-before' && value) {
                            const numValue = Number(value);
                            if (numValue < 2 || numValue > 24) {
                              return '2 이상 24 이하의 숫자를 입력해주세요';
                            }
                          }
                          return true;
                        },
                      }}
                      render={({ field: hoursField }) => (
                        <input
                          type="number"
                          min="2"
                          max="24"
                          disabled={triggerType !== 'hours-before'}
                          value={triggerType === 'hours-before' ? hoursField.value || '' : ''}
                          onChange={e => {
                            const value = e.target.value;
                            if (value === '') {
                              hoursField.onChange('');
                              return;
                            }
                            const numValue = Number(value);
                            if (!isNaN(numValue) && numValue >= 1 && numValue <= 24) {
                              hoursField.onChange(numValue);
                            } else if (numValue > 24) {
                              hoursField.onChange(24);
                            } else if (numValue < 2 && numValue > 0) {
                              hoursField.onChange(2);
                            }
                          }}
                          onBlur={hoursField.onBlur}
                          className="w-[41px] h-[28px] px-2 py-0 border border-neutral-300 rounded-lg text-center text-neutral-1000 bg-neutral-100 disabled:bg-neutral-200/50 disabled:text-neutral-500 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      )}
                    />
                    <BodyDefault className="text-neutral-600">시간 전</BodyDefault>
                  </label>
                </div>
              )}
            />

            {errors.triggerType && (
              <Caption className="text-system-error mt-1.5">{errors.triggerType.message}</Caption>
            )}
            {errors.triggerHours && (
              <Caption className="text-system-error mt-1.5">{errors.triggerHours.message}</Caption>
            )}
          </div>
        )}

        {/* 수동 요청: 요청 날짜 */}
        {!isAutomatic && (
          <div className="space-y-4">
            <TitleDefault className="text-neutral-1000">
              요청날짜 선택 <span className="text-red-500">*</span>
            </TitleDefault>
            <div>
              <Controller
                name="requestDate"
                control={control}
                rules={{ required: '청소를 진행하실 날짜를 선택해주세요' }}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="청소를 진행하실 날짜를 선택해주세요"
                    error={!!errors.requestDate}
                  />
                )}
              />
              {errors.requestDate && (
                <Caption className="text-red-500 mt-1">{errors.requestDate.message}</Caption>
              )}
            </div>
          </div>
        )}

        {/* 자동 요청: 요청 기간 */}
        {isAutomatic && (
          <div className="flex flex-col gap-3">
            <TitleDefault className="text-neutral-1000">
              요청 기간 선택 <span className="text-red-500">*</span>
            </TitleDefault>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Controller
                  name="requestPeriodStart"
                  control={control}
                  rules={{
                    required: '시작 날짜를 선택해주세요',
                    validate: value => {
                      if (requestPeriodEnd && value && value > requestPeriodEnd) {
                        return '시작 날짜는 종료 날짜보다 이전이어야 합니다';
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={value => {
                        field.onChange(value);
                        // 시작 날짜가 종료 날짜보다 나중이면 종료 날짜 초기화
                        if (requestPeriodEnd && value && value > requestPeriodEnd) {
                          setValue('requestPeriodEnd', '');
                        }
                      }}
                      maxDate={requestPeriodEnd || undefined}
                      error={!!errors.requestPeriodStart}
                    />
                  )}
                />
              </div>
              <span className="text-neutral-600">-</span>
              <div className="relative flex-1">
                <Controller
                  name="requestPeriodEnd"
                  control={control}
                  rules={{
                    required: '종료 날짜를 선택해주세요',
                    validate: value => {
                      if (requestPeriodStart && value && value < requestPeriodStart) {
                        return '종료 날짜는 시작 날짜보다 이후여야 합니다';
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={value => {
                        field.onChange(value);
                        // 종료 날짜가 시작 날짜보다 이전이면 시작 날짜 초기화
                        if (requestPeriodStart && value && value < requestPeriodStart) {
                          setValue('requestPeriodStart', '');
                        }
                      }}
                      minDate={requestPeriodStart || undefined}
                      error={!!errors.requestPeriodEnd}
                    />
                  )}
                />
              </div>
            </div>
            {errors.requestPeriodStart && (
              <Caption className="text-red-500 mt-1">{errors.requestPeriodStart.message}</Caption>
            )}
            {errors.requestPeriodEnd && (
              <Caption className="text-red-500 mt-1">{errors.requestPeriodEnd.message}</Caption>
            )}
          </div>
        )}

        {/* 수동 요청: 요청 시간 */}
        {!isAutomatic && (
          <div className="space-y-4">
            <TitleDefault className="text-neutral-1000">
              요청시간 선택 <span className="text-red-500">*</span>
            </TitleDefault>
            <div>
              <div className="flex items-center gap-4">
                <Controller
                  name="requestStartTime"
                  control={control}
                  rules={{ required: '시간을 입력해주세요' }}
                  render={({ field }) => {
                    let minTime: string | undefined;
                    let maxTime: string | undefined;

                    if (isToday()) {
                      const currentTime = getCurrentTimeRounded();
                      minTime = currentTime;
                    }

                    if (requestEndTime) {
                      maxTime = subtract30Minutes(requestEndTime);
                      if (isToday() && minTime && requestEndTime < minTime) {
                        minTime = undefined;
                        maxTime = subtract30Minutes(requestEndTime);
                      }
                    }

                    return (
                      <div className="relative flex-1">
                        <TimePicker
                          value={field.value}
                          onChange={value => {
                            field.onChange(value);
                            if (requestEndTime && value > requestEndTime) {
                              setValue('requestEndTime', '');
                            }
                          }}
                          placeholder="시작 시간"
                          error={!!errors.requestStartTime}
                          minTime={minTime}
                          maxTime={maxTime}
                        />
                      </div>
                    );
                  }}
                />
                <span className="text-neutral-600">-</span>
                <Controller
                  name="requestEndTime"
                  control={control}
                  rules={{ required: '시간을 입력해주세요' }}
                  render={({ field }) => {
                    let minTime: string | undefined;

                    if (requestStartTime) {
                      minTime = add30Minutes(requestStartTime);
                    }

                    if (isToday()) {
                      const currentTime = getCurrentTimeRounded();
                      if (minTime) {
                        minTime = minTime > currentTime ? minTime : currentTime;
                      } else {
                        minTime = currentTime;
                      }
                    }

                    return (
                      <div className="relative flex-1">
                        <TimePicker
                          value={field.value}
                          onChange={value => {
                            field.onChange(value);
                            if (requestStartTime && value < requestStartTime) {
                              setValue('requestStartTime', '');
                            }
                          }}
                          placeholder="종료 시간"
                          error={!!errors.requestEndTime}
                          minTime={minTime}
                        />
                      </div>
                    );
                  }}
                />
              </div>
              {(errors.requestStartTime || errors.requestEndTime) && (
                <Caption className="text-red-500 mt-1">
                  {errors.requestStartTime?.message ||
                    errors.requestEndTime?.message ||
                    '시간을 입력해주세요'}
                </Caption>
              )}
            </div>
          </div>
        )}

        {/* 자동 요청: 청소 완료 희망 시각 */}
        {isAutomatic && (
          <div className="flex flex-col gap-3">
            <TitleDefault className="text-neutral-1000">청소 완료 희망 시각</TitleDefault>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register('completionTimeType')}
                  value="auto"
                  className="w-4 h-4 accent-neutral-1000"
                />
                <BodyDefault>자동 계산(체크인 2시간 전)</BodyDefault>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register('completionTimeType')}
                  value="fixed"
                  className="w-4 h-4 accent-neutral-1000"
                />
                <BodyDefault>고정 시간</BodyDefault>
                <Controller
                  name="completionTime"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="시간을 설정해주세요"
                      disabled={watch('completionTimeType') !== 'fixed'}
                      className="w-[161px]"
                      options={[]}
                    />
                  )}
                />
              </label>
            </div>
          </div>
        )}

        {/* 청소 타입 선택 */}
        <div className="space-y-4">
          <TitleDefault className="text-neutral-1000">청소 타입 선택</TitleDefault>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                {...register('cleaningType')}
                value="basic"
                className="w-4 h-4 accent-neutral-1000"
              />
              <BodyDefault className="text-neutral-1000">기본 청소만</BodyDefault>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                {...register('cleaningType')}
                value="basic-laundry"
                className="w-4 h-4 accent-neutral-1000"
              />
              <BodyDefault className="text-neutral-1000">기본 청소 + 세탁</BodyDefault>
            </label>
          </div>
        </div>

        {/* 세탁물 종류 선택 (기본 청소 + 세탁 선택 시) */}
        {cleaningType === 'basic-laundry' && (
          <div className="space-y-3">
            <TitleDefault className="text-neutral-1000">
              세탁물 종류 선택 <span className="text-red-500">*</span>
            </TitleDefault>
            <div className="flex flex-col gap-[10px] w-[221px]">
              {LAUNDRY_TYPES.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <BodyDefault className="text-neutral-1000">{item.label}</BodyDefault>
                  <div className="w-[118px]">
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={watch(`laundryItems.${item.id}`) || ''}
                      onChange={e => {
                        const inputValue = e.target.value;
                        if (inputValue === '') {
                          updateLaundryQuantity(item.id, 0);
                          return;
                        }
                        const numValue = parseInt(inputValue, 10);
                        if (!isNaN(numValue) && numValue >= 0) {
                          updateLaundryQuantity(item.id, numValue);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {cleaningType === 'basic-laundry' && !hasLaundryItems() && (
              <Caption className="text-red-500 mt-1">수량을 입력해주세요</Caption>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
