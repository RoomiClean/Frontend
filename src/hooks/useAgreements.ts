import { useState, useCallback } from 'react';

export interface AgreementState {
  all: boolean;
  service: boolean;
  privacy: boolean;
  location: boolean;
  marketing: boolean;
}

interface UseAgreementsOptions {
  required?: (keyof Omit<AgreementState, 'all' | 'marketing'>)[];
}

interface UseAgreementsReturn {
  agreements: AgreementState;
  toggleAgreement: (type: keyof AgreementState, checked: boolean) => void;
  isRequiredMet: boolean;
  reset: () => void;
}

export function useAgreements(options: UseAgreementsOptions = {}): UseAgreementsReturn {
  const { required = ['service', 'privacy', 'location'] } = options;

  const [agreements, setAgreements] = useState<AgreementState>({
    all: false,
    service: false,
    privacy: false,
    location: false,
    marketing: false,
  });

  const toggleAgreement = useCallback(
    (type: keyof AgreementState, checked: boolean) => {
      if (type === 'all') {
        setAgreements({
          all: checked,
          service: checked,
          privacy: checked,
          location: checked,
          marketing: checked,
        });
      } else {
        const newAgreements = { ...agreements, [type]: checked };
        newAgreements.all = required.every(key => newAgreements[key]);
        setAgreements(newAgreements);
      }
    },
    [agreements, required],
  );

  const isRequiredMet = required.every(key => agreements[key]);

  const reset = useCallback(() => {
    setAgreements({
      all: false,
      service: false,
      privacy: false,
      location: false,
      marketing: false,
    });
  }, []);

  return {
    agreements,
    toggleAgreement,
    isRequiredMet,
    reset,
  };
}
