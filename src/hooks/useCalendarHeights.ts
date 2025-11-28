import { useEffect, useRef, useState } from 'react';

/**
 * 캘린더와 BottomSheet의 높이를 계산하는 커스텀 훅
 *
 * 캘린더의 위치를 기반으로 BottomSheet의 초기 높이와 최대 높이를 계산합니다.
 * @returns { calendarRef, previewHeight, maxHeight, isMounted }
 */
export const useCalendarHeights = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [previewHeight, setPreviewHeight] = useState<number>(300);
  const [maxHeight, setMaxHeight] = useState<number>(600);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const calculateHeights = () => {
      if (calendarRef.current) {
        const calendarRect = calendarRef.current.getBoundingClientRect();
        const calendarBottom = calendarRect.bottom;
        const calendarTop = calendarRect.top;
        const windowHeight = window.innerHeight;

        // 캘린더 하단에서 24px 떨어진 위치까지의 초기 높이
        const preview = windowHeight - calendarBottom - 24;
        setPreviewHeight(preview > 0 ? preview : 100);

        // 완전히 올렸을 때: 캘린더 상단까지의 높이
        const max = windowHeight - calendarTop;
        setMaxHeight(max > 0 ? max : windowHeight * 0.9);
      }
    };

    calculateHeights();

    window.addEventListener('resize', calculateHeights);

    const timer = setTimeout(calculateHeights, 100);

    return () => {
      window.removeEventListener('resize', calculateHeights);
      clearTimeout(timer);
    };
  }, []);

  return { calendarRef, previewHeight, maxHeight, isMounted };
};
