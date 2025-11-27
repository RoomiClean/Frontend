import { redirect } from 'next/navigation';

// /request로 직접 접근 시 수동 청소 요청 페이지로 리다이렉트
export default function RequestPage() {
  redirect('/request/manual');
}
