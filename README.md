# Real Estate Manager (부동산 매물 관리 시스템)

이 프로젝트는 "리액트, Next.js로 완성하는 프론트엔드" 도서의 9장, 10장 실전 프로젝트 완성본입니다.

## 기능 (Features)

- **대시보드**: 매물 현황 통계 및 차트 시각화 (Recharts)
- **매물 관리**: 리스트 조회, 검색, 필터링, 상세 조회, 삭제
- **매물 등록**: 개별 등록 및 엑셀 대량 등록 (Bulk Insert)
- **엑셀 내보내기**: 매물 목록 엑셀 다운로드 (xlsx)
- **반응형 디자인**: Tailwind CSS + Shadcn UI 스타일

## 기술 스택 (Tech Stack)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase 권장)
- **ORM**: Prisma
- **State Management**: Server Actions (Server State), URL Search Params (Client State)

## 시작하기 (Getting Started)

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 데이터베이스 URL을 입력하세요.

```env
DATABASE_URL="postgresql://user:password@localhost:5432/real_estate_db"
```

### 3. 데이터베이스 마이그레이션

Prisma 스키마를 DB에 반영합니다.

```bash
npx prisma db push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 폴더 구조 (Folder Structure)

```
app/              # Next.js App Router 페이지
actions/          # Server Actions (API 로직)
components/       # UI 컴포넌트
lib/              # 유틸리티 (Prisma Client 등)
prisma/           # DB 스키마
```
