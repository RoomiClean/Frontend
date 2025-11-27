import { useMutation } from '@tanstack/react-query';
import { createAccommodation } from '../api/accommodation.api';
import type { CreateAccommodationRequest } from '../types/accommodation.types';
import type { ApiResponse } from '../api-response.types';

// 숙소 등록 뮤테이션
export const useCreateAccommodation = () =>
  useMutation<ApiResponse, Error, CreateAccommodationRequest>({
    mutationFn: (data: CreateAccommodationRequest) => createAccommodation(data),
    onSuccess: () => {
      console.log('숙소 등록 완료');
    },
    onError: (err: Error) => {
      console.error('숙소 등록 에러:', err);
    },
  });
