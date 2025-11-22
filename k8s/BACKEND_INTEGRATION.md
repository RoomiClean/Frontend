# 백엔드 연동 가이드

## 네트워크 아키텍처

### 브라우저에서 백엔드 API 호출

Next.js는 **브라우저**에서 백엔드 API를 직접 호출하므로:
- ❌ 클러스터 내부 주소 사용 불가 (`http://cleanb-service:80`)
- ✅ 외부 도메인 사용 필요 (`https://cleanb.lion.it.kr`)

**네트워크 흐름**:
```
브라우저
  ↓ NEXT_PUBLIC_API_URL
https://cleanb.lion.it.kr
  ↓ (Ingress/LoadBalancer)
cleanb-service (Service)
  ↓
백엔드 Pod :8080
```

## 백엔드 Service 확인

백엔드에 Service가 있어야 Ingress가 트래픽을 전달할 수 있습니다.

### 1. 백엔드 Service 생성 (필요한 경우)

백엔드 프로젝트(`~/Desktop/Project/cleanb`)에 Service가 없다면 생성해야 합니다:

**파일**: `~/Desktop/Project/cleanb/k8s/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: cleanb-service
  namespace: default
  labels:
    app: cleanb
spec:
  type: ClusterIP
  selector:
    app: cleanb
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
```

배포:
```bash
cd ~/Desktop/Project/cleanb
kubectl apply -f k8s/service.yaml
```

### 2. 프론트엔드에서 백엔드 호출

**브라우저에서 호출** (NEXT_PUBLIC_* 환경 변수):

```
https://cleanb.lion.it.kr
```

이 주소는 k8s/secrets/cleanb-front-secret.yaml에 설정되어 있습니다:

```yaml
stringData:
  NEXT_PUBLIC_API_URL: "https://cleanb.lion.it.kr"
```

**백엔드 Ingress 설정 확인**:

백엔드 프로젝트에 Ingress가 있어야 외부 도메인으로 접근 가능합니다:

```bash
# 서버에서 확인
kubectl get ingress -n default | grep cleanb
```

### 3. Next.js에서 사용

**클라이언트 사이드 (브라우저)**:
```typescript
// 브라우저에서 실행 - 외부 도메인 사용
const API_URL = process.env.NEXT_PUBLIC_API_URL; // https://cleanb.lion.it.kr

// API 호출
const response = await fetch(`${API_URL}/api/endpoint`);
```

**서버 사이드 (Next.js API Routes)** - 선택사항:
```typescript
// pages/api/proxy.ts
// 서버에서 실행 - 클러스터 내부 주소 사용 가능
const API_URL = process.env.BACKEND_API_URL || 'http://cleanb-service:80';

export default async function handler(req, res) {
  const response = await fetch(`${API_URL}/api/endpoint`);
  const data = await response.json();
  res.json(data);
}
```

## 주의사항

### NEXT_PUBLIC_* 환경 변수의 특성

1. **빌드 타임에 번들에 포함**됨
   - Docker 이미지를 빌드할 때 값이 결정됨
   - 런타임에 변경 불가

2. **클라이언트에 노출**됨
   - 브라우저 JavaScript 코드에서 접근 가능
   - 민감한 정보는 포함하지 말 것

### 해결 방법

#### 방법 1: 환경별로 다른 이미지 빌드 (권장)

```bash
# 프로덕션 이미지 빌드
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://cleanb-service:8080 \
  -t your-registry/cleanb-front:prod .

# 개발 이미지 빌드
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080 \
  -t your-registry/cleanb-front:dev .
```

Dockerfile 수정 필요:
```dockerfile
# Builder stage에 추가
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
```

#### 방법 2: 서버 사이드에서만 API 호출

클라이언트에서 직접 백엔드 API를 호출하지 않고, Next.js API Routes를 통해 호출:

```typescript
// pages/api/proxy.ts
export default async function handler(req, res) {
  // 서버 사이드에서만 실행되므로 일반 환경 변수 사용 가능
  const API_URL = process.env.BACKEND_API_URL;
  const response = await fetch(`${API_URL}/api/endpoint`);
  const data = await response.json();
  res.json(data);
}
```

이 경우 Secret 설정:
```yaml
stringData:
  BACKEND_API_URL: "http://cleanb-service:8080"
```

#### 방법 3: 런타임 환경 변수 주입 (고급)

런타임에 환경 변수를 주입하려면 추가 설정이 필요합니다:

1. `public/config.js` 파일 생성
2. ConfigMap으로 설정 관리
3. InitContainer로 파일 생성

자세한 내용은 별도로 문의하세요.

## 네트워크 확인

### Pod 간 통신 테스트

```bash
# 프론트엔드 Pod에서 백엔드 Service 호출 테스트
kubectl exec -it <cleanb-front-pod> -- sh
wget -O- http://cleanb-service:8080/actuator/health
```

### Service 엔드포인트 확인

```bash
kubectl get endpoints cleanb-service
```

## 트러블슈팅

### 1. 백엔드에 연결할 수 없음

```bash
# Service 확인
kubectl get svc cleanb-service

# Pod 확인
kubectl get pods -l app=cleanb

# 네트워크 정책 확인
kubectl get networkpolicies
```

### 2. CORS 에러

백엔드에서 CORS 설정 필요:

```java
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("*")  // 또는 특정 도메인
                    .allowedMethods("*");
            }
        };
    }
}
```

### 3. 환경 변수가 적용되지 않음

```bash
# Pod 내부 환경 변수 확인
kubectl exec -it <cleanb-front-pod> -- env | grep NEXT_PUBLIC
```

빌드 타임 변수이므로 이미지를 다시 빌드해야 합니다.
