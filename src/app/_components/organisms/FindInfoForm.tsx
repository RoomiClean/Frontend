'use client';
import { DisplayH1, TitleH4 } from '../atoms/Typography';
import { useFindInfo } from '@/hooks/useFindInfo';
import FindId from '../molecules/FindId';
import FindPassword from '../molecules/FindPassword';

/**
 * 아이디 / 비밀번호 찾기 통합 폼
 *
 * - `FindId`와 `FindPassword` 탭 전환 관리
 * - `useFindInfo` 훅을 사용하여 상태 및 단계 제어
 *
 * @component
 */
export default function FindInfoForm() {
  const {
    control,
    handleSubmit,
    errors,
    watchedValues,
    activeTab,
    idStep,
    passwordStep,
    isCodeSent,
    isVerified,
    timeLeft,
    foundId,
    handleTabChange,
    handleSendCode,
    handleResendCode,
    handleVerifyCode,
    handleIdFind,
    handlePasswordReset,
    handlePasswordResetComplete,
  } = useFindInfo();

  return (
    <div className="flex flex-col items-center gap-[48px] w-[440px] px-4">
      <DisplayH1 className="text-neutral-1000">아이디 / 비밀번호 찾기</DisplayH1>

      {/* 탭 메뉴 */}
      <div className="flex w-full border-b">
        <button
          className={`flex-1 py-4 text-center ${
            activeTab === 'id'
              ? 'border-neutral-1000 text-neutral-1000 border-b-2'
              : 'border-neutral-200 text-neutral-1000 border-b-1'
          }`}
          onClick={() => handleTabChange('id')}
        >
          <TitleH4>아이디 찾기</TitleH4>
        </button>
        <button
          className={`flex-1 py-4 text-center ${
            activeTab === 'password'
              ? 'border-neutral-1000 text-neutral-1000 border-b-2'
              : 'border-neutral-200 text-neutral-1000 border-b-1'
          }`}
          onClick={() => handleTabChange('password')}
        >
          <TitleH4>비밀번호 찾기</TitleH4>
        </button>
      </div>

      {/* 아이디 찾기 | 비밀번호 찾기 */}
      <div className="w-full">
        {activeTab === 'id' ? (
          <FindId
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
            watchedValues={watchedValues}
            isCodeSent={isCodeSent}
            isVerified={isVerified}
            timeLeft={timeLeft}
            foundId={foundId}
            idStep={idStep}
            onSendCode={handleSendCode}
            onResendCode={handleResendCode}
            onVerifyCode={handleVerifyCode}
            onIdFind={handleIdFind}
            onTabChange={() => handleTabChange('id')}
          />
        ) : (
          <FindPassword
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
            watchedValues={watchedValues}
            isCodeSent={isCodeSent}
            isVerified={isVerified}
            timeLeft={timeLeft}
            passwordStep={passwordStep}
            onSendCode={handleSendCode}
            onResendCode={handleResendCode}
            onVerifyCode={handleVerifyCode}
            onPasswordReset={handlePasswordReset}
            onPasswordResetComplete={handlePasswordResetComplete}
            onTabChange={() => handleTabChange('password')}
          />
        )}
      </div>
    </div>
  );
}
