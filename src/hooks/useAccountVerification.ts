import { useState, useCallback } from 'react';

interface UseAccountVerificationReturn {
  isVerified: boolean;
  verifyAccount: (accountNumber: string, bank?: string) => Promise<boolean>;
  resetVerification: () => void;
  verificationMessage: string;
}

export function useAccountVerification(): UseAccountVerificationReturn {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const verifyAccount = useCallback(
    async (accountNumber: string, bank?: string): Promise<boolean> => {
      if (!accountNumber) {
        setVerificationMessage('계좌번호를 입력해주세요');
        return false;
      }

      if (accountNumber.length < 10) {
        setVerificationMessage('올바른 계좌번호가 아닙니다');
        return false;
      }

      // TODO: 실제 API 호출로 계좌 검증
      try {
        // 예시: API 호출
        // const response = await verifyAccountAPI({ accountNumber, bank });
        // setIsVerified(response.isValid);

        // 현재는 검증 성공으로 간주
        setIsVerified(true);
        setVerificationMessage('');
        return true;
      } catch (error) {
        setVerificationMessage('계좌 검증에 실패했습니다');
        setIsVerified(false);
        return false;
      }
    },
    [],
  );

  const resetVerification = useCallback(() => {
    setIsVerified(false);
    setVerificationMessage('');
  }, []);

  return {
    isVerified,
    verifyAccount,
    resetVerification,
    verificationMessage,
  };
}
