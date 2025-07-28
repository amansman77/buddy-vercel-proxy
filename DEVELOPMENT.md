# Buddy Vercel Proxy - 개발 환경 가이드

## 📋 **프로젝트 개요**

Buddy API의 지역별 라우팅 문제를 해결하기 위한 Vercel 중계 서버입니다.

### **문제 상황**
- **IPv6 요청**이 **홍콩(HKG)** 데이터센터로 라우팅됨
- **IPv4 요청**은 **일본(NRT)** 데이터센터로 라우팅됨
- **홍콩**에서 **OpenAI API** 접근이 제한되어 500 에러 발생

### **해결 방법**
```
단단이 앱 → Buddy API → Vercel Proxy → OpenAI API
```
- **Vercel Proxy**가 **자동 지역 최적화**로 OpenAI API 접근 가능한 지역으로 라우팅
- **투명한 중계**: 모든 파라미터를 그대로 전달

## 🛠️ **기술 스택**

- **언어**: TypeScript (ES2017+)
- **프레임워크**: Next.js 15.4.4 (App Router)
- **런타임**: Node.js (Vercel Functions)
- **배포**: Vercel
- **린터**: ESLint (CODING_STANDARDS.md 적용)

## 🚀 **개발 환경 설정**

### **1단계: 저장소 클론**
```bash
git clone [repository-url]
cd buddy-vercel-proxy
```

### **2단계: 의존성 설치**
```bash
npm install
```

### **3단계: 개발 서버 실행**
```bash
npm run dev
```

### **4단계: 브라우저 접속**
```
http://localhost:3000
```

## 📁 **프로젝트 구조**

```
buddy-vercel-proxy/
├── src/
│   └── app/
│       ├── api/
│       │   └── route.ts          # 핵심 Proxy API
│       ├── page.tsx              # 메인 페이지
│       ├── layout.tsx            # 레이아웃
│       └── globals.css           # 전역 스타일
├── vercel.json                   # Vercel 배포 설정
├── .eslintrc.json               # ESLint 규칙
├── CODING_STANDARDS.md          # 코딩 표준
└── README.md                    # 프로젝트 설명
```

## 🧪 **API 테스트**

### **로컬 테스트**
```bash
# 기본 API 테스트
curl -X POST http://localhost:3000/api \
  -H "Content-Type: application/json" \
  -d '{
    "apiUrl": "https://api.openai.com/v1/chat/completions",
    "apiKey": "sk-...",
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "안녕하세요"}
    ],
    "max_tokens": 100
  }' | jq .

# CORS 테스트
curl -X OPTIONS http://localhost:3000/api \
  -H "Origin: https://dandani.yetimates.com" \
  -v
```

### **배포된 API 테스트**
```bash
# 실제 배포된 URL로 테스트
curl -X POST https://buddy-vercel-proxy.vercel.app/api \
  -H "Content-Type: application/json" \
  -d '{
    "apiUrl": "https://api.openai.com/v1/chat/completions",
    "apiKey": "sk-...",
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "안녕하세요"}
    ],
    "max_tokens": 100
  }' | jq .
```

## 🔧 **코드 구조**

### **핵심 API (src/app/api/route.ts)**
```typescript
// 간결한 Proxy 서버 구현
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json();
    
    // 필수 파라미터 확인
    if (!body.apiUrl || !body.apiKey) {
      return NextResponse.json({
        error: 'API URL과 API 키가 필요합니다.'
      }, { status: 400, headers: corsHeaders });
    }

    // API 호출 - 모든 파라미터 전달
    const response = await fetch(body.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${body.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({
      error: '서버 오류가 발생했습니다.'
    }, { status: 500, headers: corsHeaders });
  }
};
```

## 🚀 **배포**

### **Vercel CLI 배포**
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

### **배포 설정 (vercel.json)**
```json
{
  "name": "buddy-vercel-proxy",
  "version": 2,
  "functions": {
    "src/app/api/route.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

## 📊 **모니터링**

### **Vercel Dashboard**
- **Functions**: API 실행 로그 확인
- **Analytics**: 요청 수, 응답 시간 모니터링
- **Settings**: 환경 변수 관리

### **로컬 로그**
```bash
# 개발 서버 로그 확인
npm run dev
```

## 🔄 **개발 워크플로우**

### **1. 기능 개발**
```bash
# 개발 서버 실행
npm run dev

# 코드 수정
# API 테스트
```

### **2. 코드 품질 확인**
```bash
# ESLint 검사
npm run lint

# CODING_STANDARDS.md 준수 확인
```

### **3. 배포**
```bash
# 변경사항 커밋
git add .
git commit -m "Add new feature"

# Vercel 배포
vercel --prod
```

### **4. 테스트**
```bash
# 배포된 API 테스트
curl -X POST https://buddy-vercel-proxy.vercel.app/api ...
```

## 🐛 **문제 해결**

### **일반적인 문제들**

#### **1. CORS 오류**
- **원인**: 브라우저에서 다른 도메인으로 요청
- **해결**: `vercel.json`의 CORS 헤더 확인

#### **2. API 키 오류**
- **원인**: 잘못된 OpenAI API 키
- **해결**: 유효한 API 키 사용

#### **3. 타임아웃 오류**
- **원인**: OpenAI API 응답 지연
- **해결**: `vercel.json`의 `maxDuration` 증가

### **디버깅 방법**
```bash
# 로컬에서 상세 로그 확인
npm run dev

# Vercel Dashboard에서 함수 로그 확인
# https://vercel.com/dashboard
```

## 📚 **참고 자료**

- [Next.js App Router](https://nextjs.org/docs/app)
- [Vercel Functions](https://vercel.com/docs/functions)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [CODING_STANDARDS.md](./CODING_STANDARDS.md)

## 🤝 **기여 가이드**

### **코딩 표준**
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) 준수
- ESLint 규칙 준수
- TypeScript 타입 정의

### **커밋 메시지**
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 수정
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 프로세스 수정
```

---

**마지막 업데이트**: 2025-07-28
**버전**: 1.0.0 