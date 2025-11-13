import { useState } from 'react';
import { generateCalendarDates } from '@/utils/calendar.utils';

interface UseCalendarProps {
  initialYear?: number;
  initialMonth?: number;
}

/**
 * 캘린더 상태 관리 훅
 *
 * 년/월 상태와 월 이동 기능을 제공합니다.
 *
 * @param props - 초기 년도와 월 설정
 * @returns 현재 년도, 월, 날짜 배열, 월 이동 핸들러
 *
 * @example
 * ```tsx
 * const { currentYear, currentMonth, dates, handlePrevMonth, handleNextMonth } = useCalendar({
 *   initialYear: 2025,
 *   initialMonth: 11
 * });
 * ```
 */
export const useCalendar = ({ initialYear, initialMonth }: UseCalendarProps = {}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(initialYear ?? today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? today.getMonth() + 1);

  // 이전 월로 이동
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 다음 월로 이동
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 날짜 배열 생성
  const dates = generateCalendarDates(currentYear, currentMonth);

  return {
    currentYear,
    currentMonth,
    dates,
    handlePrevMonth,
    handleNextMonth,
  };
};
