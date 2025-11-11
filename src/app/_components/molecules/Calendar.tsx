'use client';

import Image from 'next/image';
import { DisplaySmall, TitleSmall, BodyDefault, TitleDefault } from '../atoms/Typography';
import ArrowLeft from '@/assets/svg/ArrowLeft.svg';
import ArrowRight from '@/assets/svg/ArrowRight.svg';
import BulletPointIcon from '@/assets/svg/Bullet.svg';
import { useCalendar } from '@/hooks/useCalendar';
import { useCalendarMarkers } from '@/hooks/useCalendarMarkers';

/**
 * 숙소 예약 일정 인터페이스 (나중에 api 연동할 때 응답 구조보고 수정해야함!)
 */
export interface AccommodationSchedule {
  startDate: Date | string;
  endDate: Date | string;
}

/**
 * 청소 일정 인터페이스
 */
export interface CleaningSchedule {
  date: Date | string;
}

/**
 * Calendar 컴포넌트 Props
 */
interface CalendarProps {
  /** 숙소 예약 일정 배열 */
  accommodationSchedules?: AccommodationSchedule[];
  /** 마지막 청소 일정 */
  lastCleaningSchedule?: CleaningSchedule;
  /** 예약된 청소 일정 배열 */
  reservedCleaningSchedules?: CleaningSchedule[];
  /** 캘린더 하단에 표시할 메모 목록 */
  memos?: string[];
  initialYear?: number;
  initialMonth?: number;
  className?: string;
}

/**
 * 월력 캘린더 컴포넌트
 *
 * 숙소 예약 일정과 청소 일정을 표시하는 캘린더입니다.
 *
 * @component
 * @example
 * ```tsx
 * <Calendar
 *   accommodationSchedules={[
 *     { startDate: '2025년 11월 7일', endDate: '2025년 11월 11일' }
 *   ]}
 *   lastCleaningSchedule={{ date: '2025년 11월 5일' }}
 *   reservedCleaningSchedules={[
 *     { date: '2025년 11월 12일' },
 *     { date: '2025년 11월 22일' }
 *   ]}
 *   initialYear={2025}
 *   initialMonth={11}
 * />
 * ```
 *
 * @features
 * - 좌우 화살표로 이전/다음 월 이동
 * - 숙소 예약 일정: 파란색 연속 마커 (시작~종료)
 * - 마지막 청소 일정: 녹색 원형 마커 (단일)
 * - 예약된 청소 일정: 빨간색 원형 마커 (단일)
 * - 오늘 날짜: 빨간색 테두리로 표시
 * - 각 마커 타입 설명 표시
 */
export const Calendar = ({
  accommodationSchedules = [],
  lastCleaningSchedule,
  reservedCleaningSchedules = [],
  memos = [],
  initialYear,
  initialMonth,
  className = '',
}: CalendarProps) => {
  const { currentYear, currentMonth, dates, handlePrevMonth, handleNextMonth } = useCalendar({
    initialYear,
    initialMonth,
  });

  const { getDateMarkers } = useCalendarMarkers({
    currentYear,
    currentMonth,
    accommodationSchedules,
    lastCleaningSchedule,
    reservedCleaningSchedules,
  });

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div
      className={`w-full h-full bg-neutral-100 border border-neutral-300 rounded-[20px] shadow-[0_6px_15px_0_rgba(0,0,0,0.1)] p-6 flex flex-col  overflow-visible ${className}`}
    >
      <div className="flex items-center justify-center gap-[57px] mb-4">
        <button
          onClick={handlePrevMonth}
          className="cursor-pointer hover:opacity-70 transition-opacity"
        >
          <Image src={ArrowLeft} alt="이전 월" />
        </button>
        <DisplaySmall className="text-neutral-1000 text-center">
          {currentYear}년 {currentMonth}월
        </DisplaySmall>
        <button
          onClick={handleNextMonth}
          className="cursor-pointer hover:opacity-70 transition-opacity"
        >
          <Image src={ArrowRight} alt="다음 월" />
        </button>
      </div>

      {/* 요일 행 */}
      <div className="grid grid-cols-7 mb-4">
        {weekdays.map(day => (
          <div key={day} className="flex items-center justify-center p-1">
            <TitleSmall className="text-neutral-500">{day}</TitleSmall>
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 flex-1">
        {dates.map((date, index) => {
          if (date === null) {
            return <div key={`empty-${index}`} className="p-1" />;
          }

          const markers = getDateMarkers(date);

          return (
            <div key={`date-${date}`} className="p-1 flex items-center justify-center relative">
              {/* 숙소 예약 일정 */}
              {markers.isAccommodation && (
                <div
                  className={`absolute inset-x-0 bg-primary-alpha30
                      ${
                        markers.accommodationPosition === 'single'
                          ? 'rounded-full mx-1 border border-primary-alpha50 w-[2.6em] h-[2.6em] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'
                          : markers.accommodationPosition === 'start'
                            ? 'rounded-l-full ml-1 border-l border-t border-b border-primary-alpha50 h-[2.6em] top-1/2 -translate-y-1/2'
                            : markers.accommodationPosition === 'end'
                              ? 'rounded-r-full mr-1 border-r border-t border-b border-primary-alpha50 h-[2.6em] top-1/2 -translate-y-1/2'
                              : 'border-t border-b border-primary-alpha50 h-[2.6em] top-1/2 -translate-y-1/2'
                      }
                    `}
                />
              )}

              {/* 마지막 청소 일정 마커 */}
              {markers.isLastCleaning && !markers.isAccommodation && (
                <div className="absolute w-[2em] h-[2em] bg-green-alpha30 border border-green-alpha50 rounded-full" />
              )}

              {/* 예약된 청소 일정 마커 */}
              {markers.isReservedCleaning && !markers.isAccommodation && (
                <div className="absolute w-[2em] h-[2em] bg-red-alpha30 border border-red-alpha50 rounded-full" />
              )}

              {/* 오늘 날짜 테두리 */}
              {markers.isToday && (
                <div className="absolute w-[2em] h-[2em] border-[1px] border-red-100 rounded-full" />
              )}

              {/* 날짜 텍스트 */}
              <BodyDefault className="text-neutral-1000 relative z-10">{date}</BodyDefault>
            </div>
          );
        })}
      </div>

      {memos && memos.length > 0 && (
        <>
          <div className="border-t border-neutral-300 my-4" />
          <div className="space-y-2">
            {memos.map((memo, index) => (
              <div key={index} className="flex items-start gap-2">
                <Image src={BulletPointIcon} alt="bullet-point" className="mt-[3px]" />
                <TitleDefault className="text-neutral-1000 flex-1">{memo}</TitleDefault>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * 캘린더 마커 설명 부분
 */
export const CalendarMarkerNotes = () => {
  return (
    <div className="flex items-center justify-end gap-6 mt-6 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-primary-alpha30 border border-primary-alpha50 rounded-full" />
        <TitleSmall className="text-neutral-1000">숙소 예약 일정</TitleSmall>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-green-alpha30 border border-green-alpha50 rounded-full" />
        <TitleSmall className="text-neutral-1000">마지막 청소 일정</TitleSmall>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-red-alpha30 border border-red-alpha50 rounded-full" />
        <TitleSmall className="text-neutral-1000">예약된 청소 일정</TitleSmall>
      </div>
    </div>
  );
};
