/**
 * 문자열 날짜를 Date 객체로 변환하는 헬퍼 함수
 * @param date - Date 객체 또는 "2025년 11월 12일" 형식의 문자열
 * @returns Date 객체
 */
export const parseDate = (date: Date | string): Date => {
  if (date instanceof Date) {
    return date;
  }
  // "2025년 11월 12일" 형식 파싱
  const match = date.match(/(\d+)년\s*(\d+)월\s*(\d+)일/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JavaScript는 월이 0부터 시작
    const day = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  // 파싱 실패 시 현재 날짜 반환
  return new Date();
};

/**
 * 두 날짜가 같은 날인지 확인
 * @param date1 - 비교할 첫 번째 날짜
 * @param date2 - 비교할 두 번째 날짜
 * @returns 같은 날이면 true, 아니면 false
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 날짜가 특정 범위 내에 있는지 확인
 * @param date - 확인할 날짜
 * @param start - 시작 날짜
 * @param end - 종료 날짜
 * @returns 범위 내에 있으면 true, 아니면 false
 */
export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  const dateTime = date.getTime();
  const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return dateTime >= startTime && dateTime <= endTime;
};

/**
 * 특정 년월의 캘린더 날짜 배열 생성
 * @param year - 년도
 * @param month - 월 (1-12)
 * @returns 날짜 배열 (빈 칸은 null)
 */
export const generateCalendarDates = (year: number, month: number): (number | null)[] => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (일요일) ~ 6 (토요일)

  const dates: (number | null)[] = [];
  
  // 빈 칸 채우기
  for (let i = 0; i < startDayOfWeek; i++) {
    dates.push(null);
  }
  
  // 날짜 채우기
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i);
  }

  return dates;
};

/**
 * 특정 년월의 정보 반환
 * @param year - 년도
 * @param month - 월 (1-12)
 * @returns 월 정보 객체
 */
export const getMonthInfo = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();

  return {
    firstDayOfMonth,
    lastDayOfMonth,
    daysInMonth,
    startDayOfWeek,
  };
};

