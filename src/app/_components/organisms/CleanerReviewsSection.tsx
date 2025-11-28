import Image from 'next/image';
import { DisplayH4, TitleH3 } from '@/app/_components/atoms/Typography';
import ReviewCard, { ReviewCardProps } from '@/app/_components/molecules/card/ReviewCard';
import StarIcon from '@/assets/svg/Star.svg';

interface CleanerReviewsSectionProps {
  className?: string;
  averageRating: string;
  totalReviews: number;
  reviews: ReviewCardProps[];
}

export default function CleanerReviewsSection({
  className = '',
  averageRating,
  totalReviews,
  reviews,
}: CleanerReviewsSectionProps) {
  return (
    <section className={`w-full ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <TitleH3 className="text-neutral-1000">리뷰 ({totalReviews})</TitleH3>
        <div className="flex items-center justify-center gap-1">
          <Image src={StarIcon} alt="별점" width={21} height={21} />
          <DisplayH4 className="text-primary-400">{averageRating}</DisplayH4>
        </div>
      </div>

      <div className="border-t border-neutral-300 divide-y divide-neutral-300">
        {reviews.map(review => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </div>
    </section>
  );
}
