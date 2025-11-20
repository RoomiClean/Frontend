'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DisplayH3, BodySmall, BodyDefault, TitleH4, TitleDefault } from '../atoms/Typography';
import StarRating from '../atoms/StarRating';
import { Textarea } from '../atoms/Textarea';
import Button from '../atoms/Button';
import Modal from '../atoms/Modal';
import { useFileUpload } from '@/hooks/useFileUpload';
import CloseIcon from '@/assets/svg/close.svg';
import RowLogo from '@/assets/svg/RowLogo.svg';
import { BiSolidCamera } from 'react-icons/bi';

interface CleanerInfo {
  imageUrl: string;
  name: string;
  gender: string;
  contact: string;
  experience: string;
  rating: number;
  introduction: string;
}

interface ReviewRatings {
  overall: number;
  cleanliness: number;
  punctuality: number;
  communication: number;
  reliability: number;
}

interface ReviewFormProps {
  cleanerInfo: CleanerInfo;
  onSubmit: (data: { ratings: ReviewRatings; reviewText: string; photos: File[] }) => void;
}

/**
 * 리뷰 작성 폼 컴포넌트
 *
 * 청소자 정보, 만족도 평가, 텍스트 리뷰, 참고 사진을 포함한 리뷰 작성 폼
 */
export default function ReviewForm({ cleanerInfo, onSubmit }: ReviewFormProps) {
  const [ratings, setRatings] = useState<ReviewRatings>({
    overall: 0,
    cleanliness: 0,
    punctuality: 0,
    communication: 0,
    reliability: 0,
  });
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const { files, uploadFile, removeFile } = useFileUpload({
    maxFiles: 3,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    onError: message => {
      setError(message);
    },
  });

  const totalFileSize = files.reduce((sum, file) => sum + file.size, 0);
  const maxTotalSize = 15 * 1024 * 1024; // 15MB

  const uploadPhotoToServer = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // TODO: 실제 API 엔드포인트로 변경 필요
      // const response = await apiInstance.post('/reviews/photos', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // return response.data;

      // 임시: API 호출 시뮬레이션
      console.log('사진 업로드 API 호출:', file.name);
      return { url: URL.createObjectURL(file), id: Date.now().toString() };
    } catch (error) {
      console.error('사진 업로드 실패:', error);
      throw error;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const newFiles = Array.from(uploadedFiles);
    const newTotalSize = totalFileSize + newFiles.reduce((sum, file) => sum + file.size, 0);

    if (newTotalSize > maxTotalSize) {
      setError('전체 사진 크기가 15MB를 초과할 수 없습니다.');
      return;
    }

    // 파일 추가
    uploadFile(e);

    // 각 파일에 대해 API 호출
    for (const file of newFiles) {
      try {
        await uploadPhotoToServer(file);
      } catch (error) {
        setError('사진 업로드 중 오류가 발생했습니다.');
        // 업로드 실패한 파일 제거
        const fileIndex = files.findIndex(f => f.name === file.name);
        if (fileIndex !== -1) {
          removeFile(fileIndex);
        }
      }
    }
  };

  const handleRatingChange = (category: keyof ReviewRatings, rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmit = () => {
    // 유효성 검사
    if (ratings.overall === 0) {
      setIsErrorModalOpen(true);
      return;
    }
    if (reviewText.trim().length < 10) {
      setIsErrorModalOpen(true);
      return;
    }
    if (totalFileSize > maxTotalSize) {
      setError('전체 사진 크기가 15MB를 초과할 수 없습니다.');
      return;
    }

    setError('');
    onSubmit({
      ratings,
      reviewText: reviewText.trim(),
      photos: files,
    });
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <DisplayH3 className="text-neutral-1000 md:text-[28px] lg:text-[32px]">리뷰 작성</DisplayH3>

      {/* 리뷰 작성 폼 박스 */}
      <div className="flex flex-col items-end gap-8 py-8 px-6 rounded-[20px] bg-neutral-100 shadow-[0_6px_15px_0_rgba(0,0,0,0.20)]">
        {/* 청소자 정보 */}
        <div className="flex flex-col gap-4 w-full">
          <TitleH4 className="text-neutral-1000">청소자 정보</TitleH4>
          <div className="flex flex-col items-center gap-6">
            <div className="overflow-hidden rounded-[20px] w-[219px] h-[219px] bg-neutral-200">
              <Image
                src={cleanerInfo.imageUrl}
                alt={cleanerInfo.name}
                width={219}
                height={219}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 w-full flex flex-col items-center">
              <DisplayH3 className="text-neutral-1000 mb-4 text-center">
                {cleanerInfo.name}
              </DisplayH3>
              <div className="flex flex-col gap-1 items-center">
                <div className="flex justify-center">
                  <BodyDefault className="text-neutral-600">성별: </BodyDefault>
                  <BodyDefault className="text-neutral-800 ml-1">{cleanerInfo.gender}</BodyDefault>
                </div>
                <div className="flex justify-center">
                  <BodyDefault className="text-neutral-600">연락처: </BodyDefault>
                  <BodyDefault className="text-neutral-800 ml-1">{cleanerInfo.contact}</BodyDefault>
                </div>
                <div className="flex justify-center">
                  <BodyDefault className="text-neutral-600">경력 정보: </BodyDefault>
                  <BodyDefault className="text-neutral-800 ml-1">
                    {cleanerInfo.experience}
                  </BodyDefault>
                </div>
                <div className="flex justify-center">
                  <BodyDefault className="text-neutral-600">평점: </BodyDefault>
                  <BodyDefault className="text-neutral-800 ml-1">
                    {cleanerInfo.rating}/5.0
                  </BodyDefault>
                </div>
                <div className="flex justify-center">
                  <BodyDefault className="text-neutral-600 whitespace-nowrap">
                    자기소개:{' '}
                  </BodyDefault>
                  <BodyDefault className="text-neutral-800 ml-1">
                    {cleanerInfo.introduction}
                  </BodyDefault>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 만족도 평가 */}
        <div className="flex flex-col gap-6 w-full">
          <TitleH4 className="text-neutral-1000">만족도 평가</TitleH4>

          {/* 종합적인 만족도 */}
          <div className="flex flex-col gap-3 items-center">
            <DisplayH3 className="text-neutral-1000 text-center">
              청소자 분에 대한 종합적인 만족도를 알려주세요
            </DisplayH3>
            <StarRating
              rating={ratings.overall}
              onRatingChange={rating => handleRatingChange('overall', rating)}
              size="large"
            />
          </div>

          {/* 청결도 */}
          <div className="flex flex-col gap-3 items-center">
            <DisplayH3 className="text-neutral-1000 text-center">
              청결도에 대한 만족도를 평가해주세요
            </DisplayH3>
            <ul className="list-disc list-inside flex flex-col gap-1 items-center">
              <BodyDefault className="text-neutral-600">
                약속된 청소 범위를 전부 완수하였나요?
              </BodyDefault>
              <BodyDefault className="text-neutral-600">
                세부 구역별 청결 상태가 양호한가요?
              </BodyDefault>
            </ul>
            <StarRating
              rating={ratings.cleanliness}
              onRatingChange={rating => handleRatingChange('cleanliness', rating)}
              size="large"
            />
          </div>

          {/* 시간 준수 */}
          <div className="flex flex-col gap-3 items-center">
            <DisplayH3 className="text-neutral-1000 text-center">
              시간 준수에 대한 만족도를 평가해주세요
            </DisplayH3>
            <ul className="list-disc list-inside flex flex-col gap-1 items-center">
              <BodyDefault className="text-neutral-600">약속 시간에 맞춰 도착하였나요?</BodyDefault>
              <BodyDefault className="text-neutral-600">
                일정 변경 시 사전에 고지하였나요?
              </BodyDefault>
            </ul>
            <StarRating
              rating={ratings.punctuality}
              onRatingChange={rating => handleRatingChange('punctuality', rating)}
              size="large"
            />
          </div>

          {/* 의사소통 */}
          <div className="flex flex-col gap-3 items-center">
            <DisplayH3 className="text-neutral-1000 text-center">
              의사소통에 대한 만족도를 평가해주세요
            </DisplayH3>
            <ul className="list-disc list-inside flex flex-col gap-1 items-center">
              <BodyDefault className="text-neutral-600">사전에 연락이 잘 이루어졌나요?</BodyDefault>
              <BodyDefault className="text-neutral-600">
                특이사항에 대한 보고를 성실하게 수행하였나요?
              </BodyDefault>
            </ul>
            <StarRating
              rating={ratings.communication}
              onRatingChange={rating => handleRatingChange('communication', rating)}
              size="large"
            />
          </div>

          {/* 신뢰도 및 전문성 */}
          <div className="flex flex-col gap-3 items-center">
            <DisplayH3 className="text-neutral-1000 text-center">
              신뢰도 및 전문성에 대한 만족도를 평가해주세요
            </DisplayH3>
            <ul className="list-disc list-inside flex flex-col gap-1 items-center">
              <BodyDefault className="text-neutral-600">
                시설물 보호 및 관리를 잘 수행하였나요?
              </BodyDefault>
              <BodyDefault className="text-neutral-600">
                문제 상황이 발생한 경우 제대로 된 대처를 수행하였나요?
              </BodyDefault>
              <BodyDefault className="text-neutral-600">서비스 품질에 일관성이 있나요?</BodyDefault>
            </ul>
            <StarRating
              rating={ratings.reliability}
              onRatingChange={rating => handleRatingChange('reliability', rating)}
              size="large"
            />
          </div>
        </div>

        {/* 텍스트 리뷰 */}
        <div className="flex flex-col gap-4 w-full">
          <TitleH4 className="text-neutral-1000">텍스트 리뷰</TitleH4>
          <Textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="어떤 점이 좋았나요? 최소 10자 이상 작성해주세요."
            maxLength={500}
            showCharCount={true}
            className="min-h-[200px]"
          />
        </div>

        {/* 참고 사진 */}
        <div className="flex flex-col gap-4 w-full">
          <TitleH4 className="text-neutral-1000">참고 사진</TitleH4>
          <div className="flex flex-nowrap gap-4 overflow-x-auto overflow-y-hidden pb-2">
            {files.length < 3 && (
              <div className="flex-shrink-0">
                <label className="w-[120px] h-[120px] rounded-lg border-2 border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 transition-colors gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    multiple
                    onChange={e => {
                      handleFileUpload(e);
                      setError('');
                    }}
                    className="hidden"
                  />
                  <BiSolidCamera />
                  <TitleDefault>사진첨부</TitleDefault>
                </label>
              </div>
            )}
            {files.map((file, index) => (
              <div
                key={index}
                className="relative w-[120px] h-[120px] flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded ${index + 1}`}
                  width={120}
                  height={120}
                  unoptimized
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-neutral-900/50 rounded-full flex items-center justify-center hover:bg-neutral-900/70"
                >
                  <Image src={CloseIcon} alt="삭제" width={12} height={12} />
                </button>
              </div>
            ))}
          </div>
          <BodySmall className="text-neutral-600">
            사진은 최대 3장, 각각 5MB, 전체 15MB를 넘을 수 없습니다. (JPG, PNG, GIF 가능)
          </BodySmall>
        </div>

        {/* 에러 메시지 */}
        {error && <div className="text-red-100 text-[14px] w-full">{error}</div>}

        {/* 등록하기 버튼 */}
        <div className="flex justify-end w-full">
          <Button
            onClick={handleSubmit}
            variant="primary"
            active
            className="w-full md:w-[151px] h-[46px]"
          >
            등록하기
          </Button>
        </div>
      </div>

      {/* 에러 모달 */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        width="500px"
        height="auto"
        padding="40px"
        className="flex flex-col items-center gap-6"
      >
        <div className="flex flex-col items-center gap-6">
          <Image src={RowLogo} alt="RumiClean 로고" width={181} height={45} />
          <div className="flex flex-col items-center gap-2">
            <BodyDefault className="text-neutral-1000 text-center whitespace-pre-line">
              아직 리뷰작성이 완료되지 않았어요{'\n'}작성 후 다시 등록하기를 눌러주세요
            </BodyDefault>
          </div>
          <Button
            onClick={() => setIsErrorModalOpen(false)}
            variant="primary"
            active
            className="w-full md:w-[151px] h-[46px]"
          >
            확인
          </Button>
        </div>
      </Modal>
    </div>
  );
}
