# RumiClean - 에어비앤비 청소 매칭 앱

## 👥 팀원 구성
### Frontend
| 이다은 | 이예림 | 신상현 |
|--------|--------|--------|
| FE 팀장 | FE 팀원 | FE 팀원 |


## 📂 프로젝트 구조
```
RUMICLEAN
├── public/                   # 정적 파일
│   ├── assets/               # 일반 이미지, svg 아이콘 등
│   └── fonts/                # 웹 폰트 파일 (프리텐다드)
├── src/
│   ├── app/                  
│   │   ├── _components/      # 아토믹 디자인 컴포넌트 모음
│   │   │   ├── atoms/        # 최소 단위 UI (Button, Input 등)
│   │   │   ├── molecules/    # 작은 단위 조합 (SearchBar, Card 등)
│   │   │   ├── organisms/    # 더 큰 UI 블록 (Header, Form 등)
│   │   │   └── templates/    # 레이아웃 구조를 가진 템플릿 컴포넌트
│   │   ├── _lib/             # 비즈니스 로직, API, Query 등
│   │   │   ├── api/          # API 호출 함수 (도메인별)
│   │   │   ├── queries/      # 쿼리 훅
│   │   │   ...
│   │   ├── (main)/           # 도메인별 route 그룹
│   │   │   ├── login/
│   │   │   │   └── page.tsx  # 로그인 페이지
│   │   │   └── signup/
│   │   ├── globals.css       # 전역 스타일
│   │   ├── page.tsx          # 메인(기본) 페이지
│   │   └── layout.tsx        # 최상위 레이아웃
│   ├── constants/            # business, devlop 상수
│   ├── hooks/                # 커스텀 훅
│   ├── styles/               # 전역 스타일 파일
│   ├── types/                # 타입 정의
│   └── utils/                # 범용 유틸 함수 모음
...
```

## ⚙️ 설치 및 실행 방법

1. 저장소 클론
```bash
git clone https://github.com/RumiClean/Frontend.git
```

2. 의존성 패키지 설치
```bash
yarn
```

3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 개발 환경에서 프록시 사용 (쿠키 도메인 문제 해결)
NEXT_PUBLIC_USE_PROXY=true

# 백엔드 API 서버 주소
NEXT_PUBLIC_API_URL=https://cleanb.lion.it.kr
```

4. 개발 서버 실행
```bash
yarn dev
```

## 🔧 개발 환경 프록시 설정

### 개요

개발 환경(`localhost:3000`)에서 프로덕션 서버(`https://cleanb.lion.it.kr`)로 API를 호출할 때, **쿠키 도메인 불일치 문제**를 해결하기 위해 Next.js의 `rewrites` 기능을 사용하여 프록시를 구성했습니다.

### 문제 상황

- 백엔드 서버가 쿠키를 `cleanb.lion.it.kr` 도메인으로 설정
- 프론트엔드는 `localhost:3000`에서 실행
- 도메인이 다르면 브라우저가 쿠키를 저장하지 않거나 새로고침 시 쿠키가 사라짐

### 해결 방법

`next.config.ts`에서 개발 환경일 때만 프록시를 활성화:

```typescript
async rewrites() {
  if (process.env.NODE_ENV === 'development') {
    const apiTarget = process.env.NEXT_PUBLIC_API_URL;
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/api/:path*`,
      },
    ];
  }
  return [];
}
```

### 작동 방식

1. **개발 환경** (`yarn dev`):
   - 프론트엔드: `http://localhost:3000`
   - API 요청: `http://localhost:3000/api/*` 
   - → Next.js 프록시가 `https://cleanb.lion.it.kr/api/*`로 전달
   - 쿠키는 `localhost` 도메인으로 저장되어 새로고침해도 유지됨

2. **프로덕션 환경**:
   - 프록시 없이 직접 `https://cleanb.lion.it.kr`로 요청
   - 쿠키는 `cleanb.lion.it.kr` 도메인으로 저장

### 설정 파일

- `next.config.ts`: 프록시 설정 (rewrites)
- `src/constants/develop.constants.ts`: 프록시 사용 시 `API_BASE_URL`을 빈 문자열로 설정하여 상대 경로 사용
- `.env.local`: 환경 변수 설정

### 주의사항

- 프록시는 **개발 환경에서만** 활성화됩니다 (`NODE_ENV === 'development'`)
- `NEXT_PUBLIC_USE_PROXY=true`로 설정해야 프록시가 작동합니다
- 백엔드가 쿠키 도메인을 고정 설정한 경우, 프록시를 통해서도 동일한 도메인으로 설정될 수 있습니다
