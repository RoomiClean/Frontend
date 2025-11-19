# 백엔드-프론트엔드 k8s 아키텍처

## 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│                        k3s Cluster                          │
│                                                             │
│  ┌──────────────────────┐      ┌─────────────────────────┐ │
│  │  Backend (cleanb)    │      │  Frontend (cleanb-front) │ │
│  │                      │      │                          │ │
│  │  - Spring Boot       │◄─────│  - Next.js 15            │ │
│  │  - Port: 8080        │      │  - Port: 3000            │ │
│  │  - 2 replicas        │      │  - 2 replicas            │ │
│  │                      │      │                          │ │
│  │  Secrets:            │      │  Secrets:                │ │
│  │  - DB                │      │  - API URL               │ │
│  │  - JWT               │      │                          │ │
│  │  - S3                │      │                          │ │
│  │  - SMS               │      │                          │ │
│  │  - Redis             │      │                          │ │
│  └──────────────────────┘      └─────────────────────────┘ │
│          ▲                              ▲                   │
│          │                              │                   │
│  ┌───────┴──────┐              ┌───────┴──────┐           │
│  │ cleanb-service│              │cleanb-front- │           │
│  │ ClusterIP     │              │   service    │           │
│  │ :8080         │              │ ClusterIP    │           │
│  └───────────────┘              │ :80→:3000    │           │
│                                 └──────────────┘           │
│                                        ▲                    │
│                                        │                    │
│                                 ┌──────┴──────┐            │
│                                 │   Ingress   │            │
│                                 │  (Traefik)  │            │
│                                 └─────────────┘            │
│                                        ▲                    │
└────────────────────────────────────────┼────────────────────┘
                                         │
                                    ┌────┴────┐
                                    │ Internet│
                                    └─────────┘
```

## 프로젝트 구조 비교

### 백엔드 (`~/Desktop/Project/cleanb`)

```
cleanb/
├── Dockerfile                  # Multi-stage build (Gradle + JDK17)
├── k8s/
│   ├── deployment.yaml         # 메인 애플리케이션
│   ├── service.yaml           # ClusterIP Service (생성 필요)
│   ├── configmap.yaml         # application.yml 설정
│   ├── redis.yaml             # Redis + Service
│   └── secrets/
│       ├── cleanb-db-sealed-secret.yaml
│       ├── cleanb-jwt-sealed-secret.yaml
│       ├── cleanb-redis-sealed-secret.yaml
│       ├── cleanb-s3-sealed-secret.yaml
│       └── cleanb-sms-sealed-secret.yaml
└── argocd/
    └── application.yaml        # ArgoCD 설정 (main 브랜치)
```

### 프론트엔드 (`~/Desktop/Project/CleanB-Front`)

```
CleanB-Front/
├── Dockerfile                  # Multi-stage build (Node 20 + Next.js)
├── next.config.ts              # output: 'standalone'
├── k8s/
│   ├── deployment.yaml         # 메인 애플리케이션
│   ├── service.yaml           # ClusterIP Service
│   ├── ingress.yaml           # 외부 접근
│   ├── secrets/
│   │   ├── cleanb-front-secret.yaml              (Git 제외)
│   │   └── cleanb-front-sealed-secret.yaml       (Git 포함)
│   ├── README.md              # 배포 가이드
│   ├── QUICKSTART.md          # 빠른 시작
│   ├── SECRETS.md             # Secret 관리
│   ├── BACKEND_INTEGRATION.md # 백엔드 연동
│   └── ARCHITECTURE.md        # 이 파일
└── argocd/
    └── application.yaml        # ArgoCD 설정 (dev 브랜치)
```

## 배포 방식

### 1. Sealed Secrets

**백엔드 예시**:
```yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: cleanb-db-secret
  namespace: default
spec:
  encryptedData:
    password: AgAZS4bMDal/7Gh2qhqO+ZOg5BK2v86...
    url: AgBoR5lcWu5AdYkSSLH9Binprd/gshyc...
    username: AgAuFwPPTNKLgosIMn8r/9atGvPQiY...
```

**프론트엔드 예시**:
```yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: cleanb-front-secret
  namespace: default
spec:
  encryptedData:
    NEXT_PUBLIC_API_URL: AgB... (암호화된 값)
```

### 2. ArgoCD 자동 배포

**백엔드**:
- Repo: `https://github.com/RoomiClean/Backend.git`
- Branch: `main`
- Path: `k8s`

**프론트엔드**:
- Repo: `https://github.com/RoomiClean/CleanB-Front.git`
- Branch: `dev`
- Path: `k8s`

**배포 흐름**:
1. 코드 변경 → Git push
2. ArgoCD가 변경 감지
3. 자동으로 클러스터에 적용
4. Pod 재시작 (이미지 변경 시)

### 3. Docker 이미지

**백엔드**:
```
hyunwoo12/cleanb:abb3fe00f96a43d4f3bea61ef6b808551f294461
```

**프론트엔드**:
```
your-registry/cleanb-front:latest
```

## 네트워크 통신

### 프론트엔드 → 백엔드

**브라우저에서 호출** (NEXT_PUBLIC_* 환경 변수 사용):

```
브라우저
  ↓
https://cleanb.lion.it.kr (외부 도메인)
  ↓
Ingress/LoadBalancer
  ↓
cleanb-service:80 (Service)
  ↓
백엔드 Pod:8080
```

**서버 사이드에서 호출** (Next.js API Routes, 선택사항):

```
Next.js Pod
  ↓
http://cleanb-service:80 (클러스터 내부)
  ↓
백엔드 Pod:8080
```

### 환경 변수 설정

**프론트엔드 Secret**:
```yaml
stringData:
  # 브라우저에서 사용 (외부 도메인)
  NEXT_PUBLIC_API_URL: "https://cleanb.lion.it.kr"

  # 서버 사이드에서 사용 (클러스터 내부, 선택사항)
  # BACKEND_API_URL: "http://cleanb-service:80"
```

**Next.js 클라이언트 코드**:
```typescript
// 브라우저에서 실행
const API_URL = process.env.NEXT_PUBLIC_API_URL; // https://cleanb.lion.it.kr
fetch(`${API_URL}/api/endpoint`);
```

## 리소스 설정

### 백엔드

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### 프론트엔드

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## Health Check

### 백엔드 (Spring Actuator)

```yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 60

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 30
```

### 프론트엔드

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 30

readinessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 5
```

## 보안 정책

### Secret 관리

1. ✅ 암호화되지 않은 Secret은 **절대** Git에 커밋하지 않음
2. ✅ `kubeseal`로 암호화한 파일만 Git에 포함
3. ✅ `.gitignore`에 secret.yaml 추가
4. ✅ Secret은 기능별로 분리 (DB, JWT, S3 등)

### 환경 변수

1. ✅ `NEXT_PUBLIC_*`: 빌드 타임 (민감하지 않은 정보만)
2. ✅ 일반 환경 변수: 런타임 (민감한 정보 가능)
3. ✅ Secret으로 관리
4. ✅ ConfigMap은 비민감 설정만

## 배포 체크리스트

### 초기 설정 (1회)

- [ ] kubeseal CLI 설치
- [ ] Sealed Secrets Controller 설치 (k3s)
- [ ] ArgoCD 설치 및 설정
- [ ] Docker Registry 설정

### 백엔드 배포

- [ ] Secret 생성 및 암호화
- [ ] Service 생성 (`cleanb-service`)
- [ ] ArgoCD Application 배포
- [ ] 이미지 빌드 및 푸시
- [ ] 배포 확인

### 프론트엔드 배포

- [ ] Secret 생성 및 암호화 (백엔드 URL 포함)
- [ ] ArgoCD Application 배포
- [ ] 이미지 빌드 및 푸시
- [ ] 배포 확인
- [ ] 백엔드 연결 테스트

## 트러블슈팅

### 백엔드에 연결 안 됨

```bash
# Service 확인
kubectl get svc cleanb-service

# 엔드포인트 확인
kubectl get endpoints cleanb-service

# Pod에서 테스트
kubectl exec -it <front-pod> -- wget -O- http://cleanb-service:8080/actuator/health
```

### ArgoCD 동기화 실패

```bash
# Application 상태 확인
kubectl describe application cleanb-front -n argocd

# 수동 동기화
kubectl patch application cleanb-front -n argocd --type merge -p '{"operation": {"initiatedBy": {"username": "admin"}, "sync": {"revision": "HEAD"}}}'
```

### Secret 복호화 실패

```bash
# SealedSecret 상태 확인
kubectl describe sealedsecret cleanb-front-secret

# Controller 로그 확인
kubectl logs -n kube-system -l name=sealed-secrets-controller
```

## 참고 문서

- [배포 가이드](./README.md)
- [빠른 시작](./QUICKSTART.md)
- [Secret 관리](./SECRETS.md)
- [백엔드 연동](./BACKEND_INTEGRATION.md)
