import { useMutation } from '@tanstack/react-query';
import { registerBusinessVerification } from '../api/business.api';
import type { RegisterBusinessVerificationRequest } from '../types/business.types';
import type { ApiResponse } from '../api-response.types';

// 사업자 정보 등록 뮤테이션
export const useRegisterBusinessVerification = () =>
  useMutation<ApiResponse, Error, RegisterBusinessVerificationRequest>({
    mutationFn: (data: RegisterBusinessVerificationRequest) => registerBusinessVerification(data),
    onSuccess: () => {
      console.log('사업자 정보 등록 완료');
    },
    onError: (err: Error) => {
      console.error('사업자 정보 등록 에러:', err);
    },
  });
