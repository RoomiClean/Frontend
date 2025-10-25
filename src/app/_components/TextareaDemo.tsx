'use client';

import { useState } from 'react';
import { Textarea } from './atoms/Textarea';

export default function TextareaDemo() {
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <Textarea
      placeholder="내용을 입력해주세요."
      maxLength={500}
      value={textareaValue}
      onChange={e => setTextareaValue(e.target.value)}
    />
  );
}
