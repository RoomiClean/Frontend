type OngoingStatus = 'pending' | 'scheduled' | 'in-progress';
type PastStatus = 'completed' | 'canceled';
type CleaningRequestStatus = OngoingStatus | PastStatus;

export interface StatusLabelConfig {
  label: string;
  textColor: string;
  bgColor: string;
}

/**
 * 청소 요청 상태에 따른 라벨 설정을 반환하는 함수
 * @param requestStatus - 청소 요청 상태
 * @param isPastRequest - 과거 요청 여부
 * @returns 상태 라벨 설정 객체 또는 null
 */
export const getStatusLabelConfig = (
  requestStatus: CleaningRequestStatus,
  isPastRequest: boolean,
): StatusLabelConfig | null => {
  if (isPastRequest) {
    const pastStatusConfig: Record<PastStatus, StatusLabelConfig> = {
      completed: {
        label: '청소 완료',
        textColor: 'text-primary-500',
        bgColor: 'bg-primary-alpha10',
      },
      canceled: {
        label: '요청 취소',
        textColor: 'text-red-100',
        bgColor: 'bg-red-alpha10',
      },
    };

    return pastStatusConfig[requestStatus as PastStatus] || null;
  }

  const ongoingStatusConfig: Record<OngoingStatus, StatusLabelConfig> = {
    pending: {
      label: '요청 대기 중',
      textColor: 'text-red-100',
      bgColor: 'bg-red-alpha10',
    },
    scheduled: {
      label: '청소 진행 예정',
      textColor: 'text-secondary-400',
      bgColor: 'bg-secondary-alpha10',
    },
    'in-progress': {
      label: '청소 진행 중',
      textColor: 'text-primary-500',
      bgColor: 'bg-primary-alpha10',
    },
  };

  return ongoingStatusConfig[requestStatus as OngoingStatus] || null;
};
