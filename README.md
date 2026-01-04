# 🎮 Gotta Poke App

포켓몬 랜덤 뽑기 및 도감 웹 애플리케이션입니다. 포켓몬을 랜덤으로 뽑고, 마음에 드는 포켓몬을 저장하여 나만의 도감을 만들 수 있습니다.

## ✨ 주요 기능

### 🎰 포켓몬 뽑기
- 랜덤으로 6마리의 포켓몬을 뽑을 수 있습니다
- 전설의 포켓몬만 뽑을 수 있는 특별 모드 제공
- 포켓몬 카드를 클릭하여 상세 정보 확인
- 마음에 드는 포켓몬을 선택하여 저장

### 📚 포켓몬 도감
- 저장한 포켓몬을 한눈에 확인
- 중복된 포켓몬의 개수 표시
- 포켓몬 번호와 이미지로 깔끔한 UI 제공

### 🎵 사운드 기능
- 포켓몬 울음소리 재생 (선택 가능)

## 🛠 기술 스택

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MySQL + Prisma ORM
- **Styling**: CSS Modules
- **External API**: [PokeAPI](https://pokeapi.co/)

## 📦 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd gotta-poke-app
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 데이터베이스 연결 정보를 입력하세요:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### 4. 데이터베이스 마이그레이션
```bash
npx prisma generate
npx prisma db push
```

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
gotta-poke-app/
├── app/
│   ├── api/                    # API 라우트
│   │   └── pokemon/
│   │       ├── save/           # 포켓몬 저장 API
│   │       └── list/           # 포켓몬 조회 API
│   ├── gotta/                  # 포켓몬 뽑기 페이지
│   ├── pokedex/                # 포켓몬 도감 페이지
│   ├── _utils/                 # 유틸리티 함수 및 아이콘
│   └── types/                  # 타입 정의
├── lib/
│   └── prisma.ts               # Prisma 클라이언트 싱글톤
├── prisma/
│   └── schema.prisma           # 데이터베이스 스키마
└── public/                     # 정적 파일
```

## 🎯 사용 방법

1. **메인 화면**: 시작하기 버튼 또는 특별 모드 선택
2. **포켓몬 뽑기**:
   - "뽑기" 버튼을 눌러 포켓몬 6마리를 랜덤으로 뽑습니다
   - 마음에 드는 포켓몬을 선택(체크)합니다
   - 저장 버튼을 눌러 선택한 포켓몬을 도감에 저장합니다
3. **도감 확인**:
   - 메인 화면 왼쪽 하단의 도감 버튼을 클릭
   - 저장한 포켓몬과 보유 개수를 확인할 수 있습니다

## 🚀 배포

### GitHub Pages 배포
GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

```bash
git push origin main
```

## 📝 라이선스

This project is licensed under the MIT License.

## 🙏 감사의 말

- [PokeAPI](https://pokeapi.co/) - 포켓몬 데이터 제공
- [Next.js](https://nextjs.org/) - React 프레임워크
