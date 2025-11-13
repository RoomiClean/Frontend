import { parseDate, isSameDate, isDateInRange } from '@/utils/calendar.utils';
import { AccommodationSchedule, CleaningSchedule } from '../app/_components/molecules/Calendar';

interface UseCalendarMarkersProps {
  /** 현재 년도 */
  currentYear: number;
  /** 현재 월 (1-12) */
  currentMonth: number;
  /** 숙소 예약 일정 배열 */
  accommodationSchedules?: AccommodationSchedule[];
  /** 마지막 청소 일정 */
  lastCleaningSchedule?: CleaningSchedule;
  /** 예약된 청소 일정 배열 */
  reservedCleaningSchedules?: CleaningSchedule[];
}

/**
 * 캘린더 날짜별 마커 정보를 계산하는 훅
 *
 * 특정 날짜에 표시될 마커(숙소 예약, 청소 일정 등)의 종류와 위치를 계산합니다.
 *
 * @param props - 년/월과 일정 데이터
 * @returns 날짜별 마커 정보를 반환하는 함수
 *
 * @example
 * ```tsx
 * const { getDateMarkers } = useCalendarMarkers({
 *   currentYear: 2025,
 *   currentMonth: 11,
 *   accommodationSchedules: [...],
 *   lastCleaningSchedule: {...},
 *   reservedCleaningSchedules: [...]
 * });
 *
 * const markers = getDateMarkers(15); // 15일의 마커 정보
 * ```
 */
export const useCalendarMarkers = ({
  currentYear,
  currentMonth,
  accommodationSchedules = [],
  lastCleaningSchedule,
  reservedCleaningSchedules = [],
}: UseCalendarMarkersProps) => {
  // 특정 날짜의 마커 타입 확인
  const getDateMarkers = (day: number) => {
    const currentDate = new Date(currentYear, currentMonth - 1, day);
    const today = new Date();
    const markers = {
      isToday: isSameDate(currentDate, today),
      isAccommodation: false,
      isLastCleaning: false,
      isReservedCleaning: false,
      accommodationPosition: null as 'start' | 'middle' | 'end' | 'single' | null,
    };

    // 숙소 예약 일정 확인
    for (const schedule of accommodationSchedules) {
      const startDate = parseDate(schedule.startDate);
      const endDate = parseDate(schedule.endDate);

      if (isDateInRange(currentDate, startDate, endDate)) {
        markers.isAccommodation = true;

        if (isSameDate(currentDate, startDate) && isSameDate(currentDate, endDate)) {
          markers.accommodationPosition = 'single';
        } else if (isSameDate(currentDate, startDate)) {
          markers.accommodationPosition = 'start';
        } else if (isSameDate(currentDate, endDate)) {
          markers.accommodationPosition = 'end';
        } else {
          markers.accommodationPosition = 'middle';
        }
        break;
      }
    }

    // 마지막 청소 일정 확인
    if (lastCleaningSchedule) {
      const lastCleaningDate = parseDate(lastCleaningSchedule.date);
      if (isSameDate(currentDate, lastCleaningDate)) {
        markers.isLastCleaning = true;
      }
    }

    // 예약된 청소 일정 확인
    for (const schedule of reservedCleaningSchedules) {
      const reservedDate = parseDate(schedule.date);
      if (isSameDate(currentDate, reservedDate)) {
        markers.isReservedCleaning = true;
        break;
      }
    }

    return markers;
  };

  return { getDateMarkers };
};
