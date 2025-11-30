import { useMutation } from '@tanstack/react-query';
import { validateBusinessVerification, registerBusinessVerification } from '../api/business.api';
import type {
  ValidateBusinessVerificationRequest,
  RegisterBusinessVerificationRequest,
} from '../types/business.types';
import type { ApiResponse } from '../api-response.types';

// 사업자 번호 검증
export const useValidateBusinessVerification = () =>
  useMutation<ApiResponse, Error, ValidateBusinessVerificationRequest>({
    mutationFn: (data: ValidateBusinessVerificationRequest) => validateBusinessVerification(data),
    onSuccess: () => {
      console.log('사업자 번호 검증 완료');
    },
    onError: (err: Error) => {
      console.error('사업자 번호 검증 에러:', err);
    },
  });

// 사업자 정보 등록
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
