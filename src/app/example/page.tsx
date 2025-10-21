import Button from '../_components/atoms/Button';
import {
  BodyDefault,
  BodyLarge,
  BodySmall,
  DisplayH3,
  DisplayH4,
  TitleDefault,
  TitleLarge,
  TitleSmall,
} from '../_components/atoms/Typography';

export default function TypographyExamplePage() {
  return (
    <div className="p-8 space-y-12">
      {/* Section: Title */}
      <section className="space-y-4">
        <TitleSmall className="text-primary-500">Title Small</TitleSmall>
        <TitleDefault className="text-secondary-500">Title Default</TitleDefault>
        <TitleLarge className="text-red-100">Title Large</TitleLarge>
      </section>

      {/* Section: Display */}
      <section className="space-y-4">
        <DisplayH4 className="text-green-200">Display H4</DisplayH4>
        <DisplayH3 className="text-yellow-200">Display H3</DisplayH3>
      </section>

      {/* Section: Body */}
      <section className="space-y-2">
        <BodySmall className="text-neutral-600">
          Body Small - 에어비앤비 호스트가 청소를 신속히 요청·관리하고, 개인/업체 청소자가 손쉽게
          매칭되어 수익을 창출하는 양면 플랫폼 구축
        </BodySmall>
        <BodyDefault className="text-neutral-700">
          Body Default - 호스트: 숙소 등록 → 달력/체크아웃 일정 연결 → 지도에서 숙소 상태 확인 →
          청소 요청(옵션/시간) → 매칭 확인 → 결제 → 검수/리뷰
        </BodyDefault>
        <BodyLarge className="text-neutral-900">
          Body Large - 청소자: 프로필 등록(가용지역·시간·장비·가격대) → 요청 피드 보기/필터 → 수락 →
          작업 체크리스트 진행(전/후 사진 포함) → 완료 제출 → 정산/리뷰
        </BodyLarge>
      </section>

      {/* Section: Color Preview */}
      <section>
        <h2 className="font-semibold text-2xl mb-4">Primary Colors</h2>
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-lg" />
          <div className="w-16 h-16 bg-primary-300 rounded-lg" />
          <div className="w-16 h-16 bg-primary-500 rounded-lg" />
          <div className="w-16 h-16 bg-primary-700 rounded-lg" />
        </div>
      </section>
      {/* Section: Button */}
      <section className="flex gap-4">
        <Button active={true}>활성화된 버튼</Button>
        <Button>비활성 버튼</Button>
      </section>
    </div>
  );
}
