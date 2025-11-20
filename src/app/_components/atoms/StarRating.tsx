'use client';

import { useState } from 'react';
import { BiSolidStar } from 'react-icons/bi';

interface StarRatingProps {
  /** 현재 선택된 별점 (1-5) */
  rating: number;
  /** 별점 변경 핸들러 */
  onRatingChange: (rating: number) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 별 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 별점 평가 컴포넌트
 *
 * @description
 * - 1-5점까지 별점을 선택할 수 있는 컴포넌트
 * - 호버 시 미리보기 제공
 * - 클릭으로 별점 선택
 */
export default function StarRating({
  rating,
  onRatingChange,
  disabled = false,
  size = 'medium',
  className = '',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-9 h-9',
  };

  const handleStarClick = (value: number) => {
    if (!disabled) {
      onRatingChange(value);
    }
  };

  const handleStarHover = (value: number) => {
    if (!disabled) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex gap-1 ${className}`} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          disabled={disabled}
          className={`${sizeClasses[size]} transition-colors ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <BiSolidStar
            className={`${sizeClasses[size]} ${
              star <= displayRating ? 'text-primary-400' : 'text-neutral-500'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
