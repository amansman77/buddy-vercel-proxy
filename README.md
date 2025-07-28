# Buddy Vercel Proxy

Buddy API의 지역별 라우팅 문제를 해결하기 위한 Vercel 중계 서버입니다.

## 🎯 **목적**

- **홍콩 지역 라우팅 문제 해결**: IPv6 요청이 홍콩으로 라우팅되어 OpenAI API 접근이 제한되는 문제
- **Vercel의 자동 지역 최적화**: Vercel이 OpenAI API 접근 가능한 지역으로 자동 라우팅
- **사용자 경험 개선**: 지역 제한 시 명확한 안내 메시지 제공

## 🚀 **배포**

### 1. Vercel CLI 설치
```bash
npm i -g vercel
```

### 2. 로그인
```bash
vercel login
```

### 3. 배포
```bash
vercel --prod
```

## 🔧 **로컬 개발**

```bash
npm run dev
```

## 📊 **모니터링**

- Vercel Dashboard에서 함수 실행 로그 확인
- 지역별 응답 시간 모니터링
- 오류율 추적

## 🔄 **다음 단계**

1. **배포 후 테스트**: 5G 네트워크에서 API 호출 테스트
2. **단단이 앱 업데이트**: API URL을 Vercel 프록시로 변경
3. **성능 모니터링**: 응답 시간 및 안정성 확인
