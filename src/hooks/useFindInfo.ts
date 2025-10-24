import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

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
    watch,
    formState: { errors },
    clearErrors,
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

  // 상태 관리
  const [activeTab, setActiveTab] = useState<'id' | 'password'>('id');
  const [idStep, setIdStep] = useState<'input' | 'result'>('input');
  const [passwordStep, setPasswordStep] = useState<'input' | 'reset' | 'complete'>('input');
  const [foundId, setFoundId] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

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
   * - isCodeSent 플래그를 true로 설정하여 인증번호 입력 UI를 노출
   * - 타이머(timeLeft)를 180초(3분)으로 설정
   */
  const handleSendCode = () => {
    clearErrors('phone');
    setIsCodeSent(true);
    setTimeLeft(180);
  };

  /**
   * 인증번호 재전송
   * - 타이머를 180초 리셋
   */
  const handleResendCode = () => {
    setTimeLeft(180);
  };

  /**
   * 인증번호 확인 함수
   *
   * 사용자가 입력한 인증번호를 확인(검증)합니다.
   */
  const handleVerifyCode = () => {
    clearErrors('verificationCode');
    setIsVerified(true);
    // 성공 시 setIsVerified(true), 실패 시 setIsVerified(false) 및 에러 처리
  };

  /**
   * 아이디 찾기 함수
   *
   * 아이디 찾기 요청 후 결과를 상태(foundId)에 저장
   */
  const handleIdFind = () => {
    // foundId를 받아와 setFoundId(value) 처리
    setIdStep('result');
  };

  /**
   * 비밀번호 재설정로 이동
   */
  const handlePasswordReset = () => {
    setPasswordStep('reset');
  };

  /**
   * 비밀번호 재설정 완료
   */
  const handlePasswordResetComplete = () => {
    setPasswordStep('complete');
    // 비밀번호 재설정 요청
  };

  return {
    register,
    handleSubmit,
    errors,
    watchedValues,
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
