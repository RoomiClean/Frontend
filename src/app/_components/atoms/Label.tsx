import { TitleDefault } from './Typography';

interface LabelProps {
  children: React.ReactNode;
}

/**
 * 라벨 컴포넌트
 */
export const Label = ({ children }: LabelProps) => {
  return <TitleDefault className="text-neutral-1000">{children}</TitleDefault>;
};
