import { ReactNode } from 'react';

interface TypographyProps {
  /** 컴포넌트에 표시될 텍스트나 JSX */
  children: ReactNode;
  /** 추가적인 TailwindCSS 클래스 적용 가능 */
  className?: string;
}

// ----------------- Caption -----------------
export const Caption = ({ children, className }: TypographyProps) => (
  <p className={`font-normal text-[12px] leading-[140%] ${className}`}>{children}</p>
);

// ----------------- Body -----------------

/**
 * 작은 본문 텍스트
 */
export const BodySmall = ({ children, className }: TypographyProps) => (
  <p className={`font-normal text-[14px] leading-[140%] ${className}`}>{children}</p>
);

/**
 * 기본 본문 텍스트
 */
export const BodyDefault = ({ children, className }: TypographyProps) => (
  <p className={`font-normal text-[16px] leading-[140%] ${className}`}>{children}</p>
);

/**
 * 큰 본문 텍스트
 */
export const BodyLarge = ({ children, className }: TypographyProps) => (
  <p className={`font-normal text-[18px] leading-[140%] ${className}`}>{children}</p>
);

/**
 * Body H4 스타일 텍스트
 */
export const BodyH4 = ({ children, className }: TypographyProps) => (
  <p className={`font-normal text-[20px] leading-[140%] ${className}`}>{children}</p>
);

/**
 * Body H3 스타일 텍스트
 */
export const BodyH3 = ({ children, className }: TypographyProps) => (
  <p className={`font-normal text-[24px] leading-[140%] ${className}`}>{children}</p>
);

/**
 * Body H2 스타일 텍스트
 */
export const BodyH2 = ({ children, className }: TypographyProps) => (
  <p className={`font-normal text-[28px] leading-[140%] ${className}`}>{children}</p>
);

/**
 * Body H1 스타일 텍스트
 */
export const BodyH1 = ({ children, className }: TypographyProps) => (
  <p className={`font-normal text-[32px] leading-[140%] ${className}`}>{children}</p>
);

// ----------------- Title -----------------

/**
 * 작은 제목
 */
export const TitleSmall = ({ children, className }: TypographyProps) => (
  <h6 className={`font-medium text-[14px] leading-[140%] ${className}`}>{children}</h6>
);

/**
 * 기본 제목
 */
export const TitleDefault = ({ children, className }: TypographyProps) => (
  <h6 className={`font-medium text-[16px] leading-[140%] ${className}`}>{children}</h6>
);

/**
 * 큰 제목
 */
export const TitleLarge = ({ children, className }: TypographyProps) => (
  <h5 className={`font-medium text-[18px] leading-[140%] ${className}`}>{children}</h5>
);

/**
 * Title H4 스타일
 */
export const TitleH4 = ({ children, className }: TypographyProps) => (
  <h4 className={`font-medium text-[20px] leading-[140%] ${className}`}>{children}</h4>
);

/**
 * Title H3 스타일
 */
export const TitleH3 = ({ children, className }: TypographyProps) => (
  <h3 className={`font-medium text-[24px] leading-[140%] ${className}`}>{children}</h3>
);

/**
 * Title H2 스타일
 */
export const TitleH2 = ({ children, className }: TypographyProps) => (
  <h2 className={`font-medium text-[28px] leading-[140%] ${className}`}>{children}</h2>
);

/**
 * Title H1 스타일
 */
export const TitleH1 = ({ children, className }: TypographyProps) => (
  <h1 className={`font-medium text-[32px] leading-[140%] ${className}`}>{children}</h1>
);

// ----------------- Display -----------------

/**
 * 작은 디스플레이 텍스트
 */
export const DisplaySmall = ({ children, className }: TypographyProps) => (
  <h6 className={`font-semibold text-[14px] leading-[140%] ${className}`}>{children}</h6>
);

/**
 * 기본 디스플레이 텍스트
 */
export const DisplayDefault = ({ children, className }: TypographyProps) => (
  <h6 className={`font-semibold text-[16px] leading-[140%] ${className}`}>{children}</h6>
);

/**
 * 큰 디스플레이 텍스트
 */
export const DisplayLarge = ({ children, className }: TypographyProps) => (
  <h5 className={`font-semibold text-[18px] leading-[140%] ${className}`}>{children}</h5>
);

/**
 * Display H4 스타일
 */
export const DisplayH4 = ({ children, className }: TypographyProps) => (
  <h4 className={`font-semibold text-[20px] leading-[140%] ${className}`}>{children}</h4>
);

/**
 * Display H3 스타일
 */
export const DisplayH3 = ({ children, className }: TypographyProps) => (
  <h3 className={`font-semibold text-[24px] leading-[140%] ${className}`}>{children}</h3>
);

/**
 * Display H2 스타일
 */
export const DisplayH2 = ({ children, className }: TypographyProps) => (
  <h2 className={`font-semibold text-[28px] leading-[140%] ${className}`}>{children}</h2>
);

/**
 * Display H1 스타일
 */
export const DisplayH1 = ({ children, className }: TypographyProps) => (
  <h1 className={`font-semibold text-[32px] leading-[140%] ${className}`}>{children}</h1>
);

/**
 * Display H0 스타일 (가장 큰 디스플레이)
 */
export const DisplayH0 = ({ children, className }: TypographyProps) => (
  <h1 className={`font-semibold text-[36px] leading-[140%] ${className}`}>{children}</h1>
);
