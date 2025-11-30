'use client';
import { useState } from 'react';
import Image from 'next/image';
import { LabeledInput } from '@/app/_components/molecules/LabeledInput';
import Button from '@/app/_components/atoms/Button';
import ColumnLogo from '@/assets/svg/ColumnLogo.svg';
import { BodyDefault, BodySmall, DisplayDefault } from '../atoms/Typography';
import Link from 'next/link';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export default function LoginForm({ onLogin, isLoading = false, errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoginEnabled = email.trim() !== '' && password.trim() !== '' && !isLoading;

  return (
    <div className="flex flex-col items-center gap-16 w-[392px] px-4 mt-10 md:mt-[100px]">
      <Image src={ColumnLogo} alt="ColumnLogo" />

      <div className="flex flex-col gap-6 w-full">
        <LabeledInput
          label="아이디"
          placeholder="아이디를 입력해주세요"
          required
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <LabeledInput
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            required
            invisible
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {errorMessage && <BodySmall className="text-red-100">{errorMessage}</BodySmall>}
        </div>
        <div onClick={() => isLoginEnabled && !isLoading && onLogin(email, password)}>
          <Button active={isLoginEnabled} disabled={isLoading}>
            <DisplayDefault>{isLoading ? '로그인 중...' : '로그인'}</DisplayDefault>
          </Button>
        </div>
        <div className="flex justify-between text-neutral-1000">
          <Link href="/find-info">
            <BodyDefault>아이디/비밀번호 찾기</BodyDefault>
          </Link>
          <Link href="/signup">
            <BodyDefault>회원가입</BodyDefault>
          </Link>
        </div>
      </div>
    </div>
  );
}
