# Infrastructure

## 🏗️ **아키텍처 개요**

### **시스템 구성**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   단단이 앱     │───▶│   Buddy API     │───▶│ Vercel Proxy    │───▶│  OpenAI API     │
│ (Cloudflare)    │    │ (Cloudflare)    │    │ (Vercel)        │    │ (OpenAI)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **역할 분담**
- **단단이 앱**: 사용자 인터페이스 (React + Cloudflare Pages)
- **Buddy API**: 비즈니스 로직 처리 (Cloudflare Workers)
- **Vercel Proxy**: 지역별 라우팅 문제 해결 (Vercel Functions)
- **OpenAI API**: AI 모델 서비스 (OpenAI)

## 🚀 **Vercel 인프라**

### **플랫폼**
- **서비스**: Vercel
- **타입**: Serverless Functions
- **런타임**: Node.js 18.x
- **리전**: 자동 최적화 (글로벌 CDN)

### **배포 환경**
- **프레임워크**: Next.js 15.4.4
- **라우터**: App Router
- **언어**: TypeScript
- **패키지 매니저**: npm

### **함수 설정**
```json
{
  "functions": {
    "src/app/api/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### **네트워크 설정**
- **CORS**: 모든 도메인 허용
- **헤더**: 자동 설정
- **타임아웃**: 30초
- **메모리**: 자동 할당

## 🌍 **지역 최적화**

### **문제 상황**
- **IPv6 요청**: 홍콩(HKG) 데이터센터로 라우팅
- **OpenAI API**: 홍콩 지역에서 접근 제한
- **결과**: 403 오류 발생

### **해결 방안**
- **Vercel 자동 최적화**: 사용자 위치 기반 최적 지역 선택
- **글로벌 CDN**: 전 세계 엣지 서버 활용
- **지연 시간 최소화**: 가장 가까운 서버로 자동 라우팅

### **지역별 성능**
- **한국**: NRT (일본) 또는 ICN (한국) 서버
- **미국**: SFO, NYC, IAD 등
- **유럽**: FRA, LHR, CDG 등
- **기타**: 자동 최적화

## 🔧 **설정 파일**

### **vercel.json**
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

### **package.json**
```json
{
  "name": "buddy-vercel-proxy",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.4.4",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "15.4.4",
    "typescript": "^5"
  }
}
```

## 📊 **모니터링**

### **Vercel 대시보드**
- **URL**: https://vercel.com/dashboard
- **기능**: 실시간 로그, 성능 메트릭, 에러 추적
- **지역별 통계**: 요청 분포 및 응답 시간

### **로그 확인**
```bash
# 로컬 개발
npm run dev

# 배포된 환경
vercel logs
```

### **성능 메트릭**
- **응답 시간**: < 100ms (캐시된 경우)
- **Cold Start**: < 1초
- **가용성**: 99.9%+
- **처리량**: 자동 스케일링

## 🔒 **보안**

### **CORS 정책**
- **허용 도메인**: 모든 도메인 (`*`)
- **허용 메서드**: GET, POST, PUT, DELETE, OPTIONS
- **허용 헤더**: Content-Type, Authorization

### **API 보안**
- **인증**: OpenAI API 키를 통한 인증
- **요청 검증**: 필수 파라미터 확인
- **에러 처리**: 민감한 정보 노출 방지

### **네트워크 보안**
- **HTTPS**: 자동 SSL/TLS 인증서
- **DDoS 보호**: Vercel 자동 보호
- **Rate Limiting**: 자동 제한

## 🚀 **배포 프로세스**

### **자동 배포**
1. **Git Push**: main 브랜치에 푸시
2. **Vercel 감지**: 자동 빌드 시작
3. **테스트**: 자동 테스트 실행
4. **배포**: 성공 시 자동 배포

### **수동 배포**
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

### **환경 변수**
- **자동 관리**: Vercel 대시보드에서 설정
- **암호화**: 민감한 정보 자동 암호화
- **버전 관리**: 환경별 설정 분리

## 📈 **스케일링**

### **자동 스케일링**
- **트래픽 증가**: 자동 인스턴스 증가
- **트래픽 감소**: 자동 인스턴스 감소
- **비용 최적화**: 사용량 기반 과금

### **성능 최적화**
- **Edge Caching**: 정적 콘텐츠 캐싱
- **Function Caching**: 함수 실행 결과 캐싱
- **CDN**: 글로벌 콘텐츠 전송

## 🔄 **백업 및 복구**

### **자동 백업**
- **코드**: Git 저장소에 자동 백업
- **설정**: Vercel 대시보드에 저장
- **데이터**: 상태 없는 함수 (백업 불필요)

### **복구 절차**
1. **Git 복구**: 코드 롤백
2. **재배포**: 자동 또는 수동 배포
3. **검증**: 기능 테스트

## 💰 **비용 구조**

### **요금 모델**
- **Hobby Plan**: 무료 (개인 프로젝트)
- **Pro Plan**: 월 $20 (팀 프로젝트)
- **Enterprise Plan**: 맞춤형 (대규모 프로젝트)

### **사용량 제한**
- **Hobby**: 월 100GB 대역폭, 100GB 함수 실행
- **Pro**: 월 1TB 대역폭, 1TB 함수 실행
- **Enterprise**: 무제한

## 🛠️ **개발 도구**

### **로컬 개발**
```bash
# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 린트
npm run lint
```

### **디버깅**
- **Vercel CLI**: 로컬 디버깅
- **브라우저 개발자 도구**: 네트워크 모니터링
- **Vercel 대시보드**: 실시간 로그

---

**마지막 업데이트**: 2025-07-28
**버전**: 1.0.0 