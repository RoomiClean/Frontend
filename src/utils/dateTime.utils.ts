/**
 * 날짜 및 시간 관련 유틸리티 함수
 */

/**
 * 선택한 날짜가 오늘 날짜인지 확인
 * @param selectedDate - 선택한 날짜 (YYYY-MM-DD 형식)
 * @returns 오늘 날짜이면 true, 아니면 false
 */
export const isToday = (selectedDate: string): boolean => {
  if (!selectedDate) return false;
  const today = new Date();
  const date = new Date(selectedDate);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
};

/**
 * 현재 시간을 HH:MM 형식으로 가져오기 (30분 단위로 올림)
 * @returns HH:MM 형식의 시간 문자열
 */
export const getCurrentTimeRounded = (): string => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // 30분 단위로 올림
  if (minutes > 0 && minutes <= 30) {
    minutes = 30;
  } else if (minutes > 30) {
    minutes = 0;
    hours += 1;
  }

  // 23시를 넘으면 23:00으로 제한
  if (hours > 23) {
    hours = 23;
    minutes = 0;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * 시간에서 30분 빼기 (시작 시간이 종료 시간과 같을 수 없도록)
 * @param time - HH:MM 형식의 시간 문자열
 * @returns 30분을 뺀 시간 문자열, 6시 미만이면 undefined
 */
export const subtract30Minutes = (time: string): string | undefined => {
  const [hours, minutes] = time.split(':').map(Number);
  let newHours = hours;
  let newMinutes = minutes - 30;

  if (newMinutes < 0) {
    newMinutes = 30;
    newHours -= 1;
  }

  // 6시 미만이면 undefined 반환 (선택 불가)
  if (newHours < 6) {
    return undefined;
  }

  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

/**
 * 시간에 30분 더하기 (종료 시간이 시작 시간과 같을 수 없도록)
 * @param time - HH:MM 형식의 시간 문자열
 * @returns 30분을 더한 시간 문자열, 23시를 넘으면 undefined
 */
export const add30Minutes = (time: string): string | undefined => {
  const [hours, minutes] = time.split(':').map(Number);
  let newHours = hours;
  let newMinutes = minutes + 30;

  if (newMinutes >= 60) {
    newMinutes = 0;
    newHours += 1;
  }

  // 23시를 넘으면 undefined 반환 (선택 불가)
  if (newHours > 23) {
    return undefined;
  }

  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

/**
 * ISO 날짜 문자열을 표시 형식으로 변환
 * @param isoString - ISO 8601 형식의 날짜 문자열 (예: 2025-11-03T18:00:00.000Z)
 * @returns 표시 형식의 날짜 문자열 (예: 2025/11/3 18:00)
 */
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

/**
 * ISO 날짜 문자열을 "10월 25일 오후 3시" 형식으로 변환
 * @param isoString - ISO 8601 형식의 날짜 문자열 (예: 2025-11-03T18:00:00.000Z)
 * @returns 표시 형식의 날짜 문자열 (예: 10월 25일 오후 3시)
 */
export const formatCheckInOutDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const timeText = minutes === 0 ? `${displayHours}시` : `${displayHours}시 ${minutes}분`;

  return `${month}월 ${day}일 ${period} ${timeText}`;
};
