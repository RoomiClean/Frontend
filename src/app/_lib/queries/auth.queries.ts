import { useMutation } from '@tanstack/react-query';
import {
  checkEmail,
  sendSmsCode,
  verifySmsCode,
  signupHost,
  signupCleaner,
  findEmail,
  forgotPassword,
  resetPassword,
} from '../api/auth.api';
import type { SignupHostRequest, SignupCleanerRequest } from '../types/auth.types';
import type { ApiResponse } from '../api-response.types';

// 이메일 중복 확인
export const useCheckEmail = () =>
  useMutation<ApiResponse, Error, string>({
    mutationFn: (email: string) => checkEmail(email),
    onSuccess: () => {
      console.log('이메일 중복 확인 완료');
    },
    onError: (err: Error) => {
      console.error('이메일 중복 확인 에러:', err);
    },
  });

// SMS 인증번호 전송
export const useSendSmsCode = () =>
  useMutation<ApiResponse, Error, string>({
    mutationFn: (phone: string) => sendSmsCode(phone),
    onSuccess: () => {
      console.log('SMS 인증번호 전송 완료');
    },
    onError: (err: Error) => {
      console.error('SMS 인증번호 전송 에러:', err);
    },
  });

// SMS 인증번호 확인
export const useVerifySmsCode = () =>
  useMutation<ApiResponse, Error, { phone: string; code: string }>({
    mutationFn: ({ phone, code }) => verifySmsCode(phone, code),
    onSuccess: () => {
      console.log('SMS 인증번호 확인 완료');
    },
    onError: (err: Error) => {
      console.error('SMS 인증번호 확인 에러:', err);
    },
  });

// 호스트 회원가입
export const useSignupHost = () =>
  useMutation<ApiResponse, Error, SignupHostRequest>({
    mutationFn: (data: SignupHostRequest) => signupHost(data),
    onSuccess: () => {
      console.log('호스트 회원가입 완료');
    },
    onError: (err: Error) => {
      console.error('호스트 회원가입 에러:', err);
    },
  });

// 청소자 회원가입
export const useSignupCleaner = () =>
  useMutation<ApiResponse, Error, SignupCleanerRequest>({
    mutationFn: (data: SignupCleanerRequest) => signupCleaner(data),
    onSuccess: () => {
      console.log('청소자 회원가입 완료');
    },
    onError: (err: Error) => {
      console.error('청소자 회원가입 에러:', err);
    },
  });

// 이메일 찾기
export const useFindEmail = () =>
  useMutation<ApiResponse<{ email: string }>, Error, { name: string; phone: string }>({
    mutationFn: ({ name, phone }) => findEmail(name, phone),
    onSuccess: () => {
      console.log('이메일 찾기 완료');
    },
    onError: (err: Error) => {
      console.error('이메일 찾기 에러:', err);
    },
  });

// 비밀번호 재설정 요청
export const useForgotPassword = () =>
  useMutation<ApiResponse<{ token: string }>, Error, { email: string; phone: string }>({
    mutationFn: ({ email, phone }) => forgotPassword(email, phone),
    onSuccess: () => {
      console.log('비밀번호 재설정 요청 완료');
    },
    onError: (err: Error) => {
      console.error('비밀번호 재설정 요청 에러:', err);
    },
  });

// 비밀번호 재설정 실행
export const useResetPassword = () =>
  useMutation<ApiResponse, Error, { token: string; newPassword: string }>({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
    onSuccess: () => {
      console.log('비밀번호 재설정 완료');
    },
    onError: (err: Error) => {
      console.error('비밀번호 재설정 에러:', err);
    },
  });
