import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import {
  useSendSmsCode,
  useVerifySmsCode,
  useFindEmail,
  useForgotPassword,
  useResetPassword,
} from '@/app/_lib/queries';
import type { ApiErrorResponse } from '@/app/_lib/api-response.types';

export interface FindInfoFormData {
  name: string;
  phone: string;
  id: string;
  newPassword: string;
  confirmPassword: string;
  verificationCode: string;
}

/**
 * useFindInfo
 *
 * 아이디/비밀번호 찾기 컴포넌트에서 사용하는 상태와 동작을 제공하는 커스텀 훅.
 * - 폼 상태 관리는 react-hook-form을 사용.
 * - 인증번호 전송 여부, 인증 완료 여부, 타이머, 단계 전환(id/password) 등을 관리.
 *
 */
export const useFindInfo = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<FindInfoFormData>({
    defaultValues: {
      name: '',
      phone: '',
      id: '',
      newPassword: '',
      confirmPassword: '',
      verificationCode: '',
    },
  });

  const watchedValues = watch();

  const { mutateAsync: sendSmsCodeMutate } = useSendSmsCode();
  const { mutateAsync: verifySmsCodeMutate } = useVerifySmsCode();
  const { mutateAsync: findEmailMutate } = useFindEmail();
  const { mutateAsync: forgotPasswordMutate } = useForgotPassword();
  const { mutateAsync: resetPasswordMutate } = useResetPassword();

  // 상태 관리
  const [activeTab, setActiveTab] = useState<'id' | 'password'>('id');
  const [idStep, setIdStep] = useState<'input' | 'result'>('input');
  const [passwordStep, setPasswordStep] = useState<'input' | 'reset' | 'complete'>('input');
  const [foundId, setFoundId] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [resetToken, setResetToken] = useState<string>('');

  // 타이머 효과: timeLeft가 0보다 큰 동안 1초마다 감소
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  /**
   * 상태 초기화 함수
   *
   * 훅 내부에서 사용되는 상태들을 초기화합니다.
   * - 인증 관련 상태(isCodeSent, isVerified, timeLeft)를 초기화
   * - react-hook-form의 에러를 모두 지움
   *
   */
  const resetState = () => {
    setIsVerified(false);
    setIsCodeSent(false);
    setTimeLeft(0);
    setResetToken('');
    clearErrors();
  };

  /**
   * 탭 변경 함수
   *
   * 탭(id | password)을 전환합니다. 탭 전환 시 관련 단계들을 초기화합니다.
   *
   * @param {'id'|'password'} tab - 이동할 탭 이름
   *
   * - activeTab을 변경
   * - 아이디/비밀번호 단계(idStep/passwordStep)를 각각 초기 상태로 설정
   * - foundId 초기화
   * - 인증 관련 상태들을 resetState로 초기화
   */
  const handleTabChange = (tab: 'id' | 'password') => {
    setActiveTab(tab);
    setIdStep('input');
    setPasswordStep('input');
    setFoundId('');
    resetState();
  };

  /**
   * 인증번호 전송 함수
   * - SMS 인증번호 전송 API 호출
   * - isCodeSent 플래그를 true로 설정하여 인증번호 입력 UI를 노출
   * - 타이머(timeLeft)를 180초(3분)으로 설정
   */
  const handleSendCode = async (phone?: string) => {
    const phoneNumber = phone || watchedValues.phone;
    if (!phoneNumber) {
      setError('phone', { type: 'manual', message: '전화번호를 입력해주세요' });
      return;
    }

    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('phone', { type: 'manual', message: '올바른 전화번호 형식이 아닙니다' });
      return;
    }

    try {
      clearErrors('phone');
      const response = await sendSmsCodeMutate(phoneNumber);
      if (response.success) {
        setIsCodeSent(true);
        setTimeLeft(180);
        clearErrors('phone');
      } else {
        setIsCodeSent(false);
        const errorMessage = response.message || '인증번호 전송에 실패했습니다.';
        setError('phone', { type: 'manual', message: errorMessage });
      }
    } catch {
      setIsCodeSent(false);
      const errorMessage = '인증번호 전송에 실패했습니다.';
      setError('phone', { type: 'manual', message: errorMessage });
    }
  };

  /**
   * 인증번호 재전송
   * - SMS 인증번호 재전송 API 호출
   * - 타이머를 180초 리셋
   */
  const handleResendCode = async (phone?: string) => {
    const phoneNumber = phone || watchedValues.phone;
    if (!phoneNumber) {
      setError('phone', { type: 'manual', message: '전화번호를 입력해주세요' });
      return;
    }

    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('phone', { type: 'manual', message: '올바른 전화번호 형식이 아닙니다' });
      return;
    }

    try {
      clearErrors('phone');
      const response = await sendSmsCodeMutate(phoneNumber);
      if (response.success) {
        setIsCodeSent(true);
        setTimeLeft(180);
        clearErrors('phone');
      } else {
        const errorMessage = response.message || '인증번호 재전송에 실패했습니다.';
        setError('phone', { type: 'manual', message: errorMessage });
      }
    } catch {
      const errorMessage = '인증번호 재전송에 실패했습니다.';
      setError('phone', { type: 'manual', message: errorMessage });
    }
  };

  /**
   * 인증번호 확인 함수
   *
   * 사용자가 입력한 인증번호를 확인(검증)합니다.
   */
  const handleVerifyCode = async (phone?: string, code?: string) => {
    const phoneNumber = phone || watchedValues.phone;
    const verificationCode = code || watchedValues.verificationCode;

    if (!phoneNumber || !verificationCode) {
      return;
    }

    try {
      clearErrors('verificationCode');
      const response = await verifySmsCodeMutate({ phone: phoneNumber, code: verificationCode });

      console.log('인증번호 확인 응답:', response);
      if (response && 'success' in response && response.success === true) {
        setIsVerified(true);
        clearErrors('verificationCode');
      } else {
        setIsVerified(false);
        const errorMessage = response.message || '인증번호가 일치하지 않습니다.';
        setError('verificationCode', { type: 'manual', message: errorMessage });
      }
    } catch (error) {
      console.error('인증번호 확인 에러:', error);
      setIsVerified(false);

      let errorMessage = '인증번호 확인에 실패했습니다.';
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          errorMessage = '인증번호가 일치하지 않습니다.';
        } else if (error.response?.data) {
          const apiError = error.response.data as ApiErrorResponse;
          if (apiError && 'message' in apiError) {
            errorMessage = apiError.message || errorMessage;
          }
        }
      }

      setError('verificationCode', { type: 'manual', message: errorMessage });
    }
  };

  /**
   * 아이디 찾기 함수
   *
   * 아이디 찾기 요청 후 결과를 상태(foundId)에 저장
   */
  const handleIdFind = async (data: FindInfoFormData) => {
    if (!isVerified) {
      const errorMessage = '휴대폰 인증을 완료해주세요.';
      setError('verificationCode', { type: 'manual', message: errorMessage });
      return;
    }

    try {
      clearErrors('name');
      const response = await findEmailMutate({ name: data.name, phone: data.phone });
      if (response.success && 'data' in response && response.data?.email) {
        setFoundId(response.data.email);
        setIdStep('result');
      } else {
        const errorMessage = response.message || '아이디 찾기에 실패했습니다.';
        setError('name', { type: 'manual', message: errorMessage });
      }
    } catch {
      const errorMessage = '아이디 찾기에 실패했습니다.';
      setError('name', { type: 'manual', message: errorMessage });
    }
  };

  /**
   * 비밀번호 재설정 요청
   * - 이메일과 전화번호로 비밀번호 재설정 토큰 요청
   * - 토큰을 받아서 저장하고 재설정 단계로 이동
   */
  const handlePasswordReset = async (data: FindInfoFormData) => {
    if (!isVerified) {
      const errorMessage = '휴대폰 인증을 완료해주세요.';
      setError('verificationCode', { type: 'manual', message: errorMessage });
      return;
    }

    try {
      clearErrors('id');
      const response = await forgotPasswordMutate({ email: data.id, phone: data.phone });
      if (response.success && 'data' in response && response.data?.token) {
        setResetToken(response.data.token);
        setPasswordStep('reset');
      } else {
        const errorMessage = response.message || '비밀번호 재설정 요청에 실패했습니다.';
        setError('id', { type: 'manual', message: errorMessage });
      }
    } catch {
      const errorMessage = '비밀번호 재설정 요청에 실패했습니다.';
      setError('id', { type: 'manual', message: errorMessage });
    }
  };

  /**
   * 비밀번호 재설정 완료
   * - 토큰과 새 비밀번호로 비밀번호 재설정 실행
   */
  const handlePasswordResetComplete = async (data: FindInfoFormData) => {
    if (!resetToken) {
      const errorMessage = '비밀번호 재설정 토큰이 없습니다. 다시 시도해주세요.';
      setError('newPassword', { type: 'manual', message: errorMessage });
      return;
    }

    if (!data.newPassword) {
      const errorMessage = '새 비밀번호를 입력해주세요.';
      setError('newPassword', { type: 'manual', message: errorMessage });
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      const errorMessage = '비밀번호가 일치하지 않습니다.';
      setError('confirmPassword', { type: 'manual', message: errorMessage });
      return;
    }

    try {
      clearErrors('newPassword');
      clearErrors('confirmPassword');
      const response = await resetPasswordMutate({
        token: resetToken,
        newPassword: data.newPassword,
      });
      if (response.success) {
        setPasswordStep('complete');
      } else {
        const errorMessage = response.message || '비밀번호 재설정에 실패했습니다.';
        setError('newPassword', { type: 'manual', message: errorMessage });
      }
    } catch {
      const errorMessage = '비밀번호 재설정에 실패했습니다.';
      setError('newPassword', { type: 'manual', message: errorMessage });
    }
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    watchedValues,
    clearErrors,
    setError,
    activeTab,
    idStep,
    passwordStep,
    foundId,
    isCodeSent,
    isVerified,
    timeLeft,

    handleTabChange,
    handleSendCode,
    handleResendCode,
    handleVerifyCode,
    handleIdFind,
    handlePasswordReset,
    handlePasswordResetComplete,
  };
};
