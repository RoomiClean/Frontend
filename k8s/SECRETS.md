# Secret 관리 가이드 (Kubeseal 사용)

백엔드와 동일하게 Sealed Secrets를 사용하여 환경 변수를 안전하게 관리합니다.

## 백엔드 구조 참고

백엔드 프로젝트(`~/Desktop/Project/cleanb`)는 다음과 같이 Secret을 관리합니다:

```
k8s/secrets/
├── cleanb-db-sealed-secret.yaml
├── cleanb-jwt-sealed-secret.yaml
├── cleanb-redis-sealed-secret.yaml
├── cleanb-s3-sealed-secret.yaml
└── cleanb-sms-sealed-secret.yaml
```

프론트엔드도 동일한 구조로 관리:
```
k8s/secrets/
├── cleanb-front-secret.yaml              (Git에 커밋하지 않음)
└── cleanb-front-sealed-secret.yaml       (Git에 커밋)
```

## 사전 준비

### 1. kubeseal CLI 설치 (로컬 머신)

```bash
# macOS
brew install kubeseal

# Linux
wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/kubeseal-0.24.0-linux-amd64.tar.gz
tar -xvzf kubeseal-0.24.0-linux-amd64.tar.gz
sudo install -m 755 kubeseal /usr/local/bin/kubeseal
```

### 2. Sealed Secrets Controller 설치 확인 (k3s 클러스터)

백엔드에서 이미 설치했다면 생략 가능:

```bash
kubectl get pods -n kube-system | grep sealed-secrets
```

설치되지 않았다면:

```bash
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml
```

## Secret 생성 및 암호화

### 방법 1: Secret YAML 파일로부터 생성 (권장)

1. **k8s/secrets/cleanb-front-secret.yaml 파일 수정**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cleanb-front-secret
  namespace: default
type: Opaque
stringData:
  NEXT_PUBLIC_API_URL: "http://backend-service:8080"
  # 필요한 다른 환경 변수 추가
  # API_SECRET_KEY: "your-secret-key"
```

2. **kubeseal로 암호화**

```bash
kubeseal -f k8s/secrets/cleanb-front-secret.yaml \
  -w k8s/secrets/cleanb-front-sealed-secret.yaml
```

3. **암호화된 파일 확인 및 Git에 커밋**

```bash
# 암호화된 파일 확인
cat k8s/secrets/cleanb-front-sealed-secret.yaml

# Git에 커밋 (암호화된 파일만!)
git add k8s/secrets/cleanb-front-sealed-secret.yaml
git commit -m "Add sealed secret for frontend"
git push
```

### 방법 2: kubectl로 직접 생성 후 암호화

```bash
# Secret 생성 (적용하지 않고 YAML 출력)
kubectl create secret generic cleanb-front-secret \
  --from-literal=NEXT_PUBLIC_API_URL=http://backend-service:8080 \
  --dry-run=client -o yaml > k8s/secret.yaml

# kubeseal로 암호화
kubeseal -f k8s/secret.yaml -w k8s/sealed-secret.yaml

# Git에 커밋
git add k8s/sealed-secret.yaml
git commit -m "Add sealed secret for frontend"
```

### 방법 3: .env 파일로부터 생성

```bash
# .env 파일 생성
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=http://backend-service:8080
API_SECRET_KEY=your-secret-key
EOF

# Secret 생성
kubectl create secret generic cleanb-front-secret \
  --from-env-file=.env.production \
  --dry-run=client -o yaml > k8s/secret.yaml

# kubeseal로 암호화
kubeseal -f k8s/secret.yaml -w k8s/sealed-secret.yaml

# 원본 .env 파일 삭제 (보안)
rm .env.production
```

## 배포

```bash
# SealedSecret 배포
kubectl apply -f k8s/sealed-secret.yaml

# Sealed Secrets Controller가 자동으로 복호화하여 Secret 생성
# 확인
kubectl get secret cleanb-front-secret
```

## Secret 업데이트

```bash
# 1. secret.yaml 수정
# 2. 다시 암호화
kubeseal -f k8s/secret.yaml -w k8s/sealed-secret.yaml

# 3. 재배포
kubectl apply -f k8s/sealed-secret.yaml

# 4. Pod 재시작 (환경 변수 반영)
kubectl rollout restart deployment/cleanb-front
```

## 주의사항

### Next.js 환경 변수의 특성

Next.js는 두 가지 타입의 환경 변수가 있습니다:

1. **`NEXT_PUBLIC_*` 환경 변수**
   - 클라이언트 사이드 코드에서 접근 가능
   - **빌드 타임**에 번들에 포함됨
   - 민감하지 않은 정보만 포함 (API URL 등)
   - **중요**: 빌드 시점에 값이 결정되므로 Docker 이미지에 포함됨

2. **일반 환경 변수**
   - 서버 사이드 코드에서만 접근 가능
   - 런타임에 주입 가능
   - 민감한 정보 포함 가능 (API 키, DB 연결 문자열 등)

### 권장 사항

**빌드 타임 환경 변수 (`NEXT_PUBLIC_*`)**:
- 환경별로 다른 이미지를 빌드하거나
- ConfigMap을 사용하거나
- 빌드 인자로 전달

```dockerfile
# Dockerfile에서
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
```

**런타임 환경 변수**:
- SealedSecret으로 관리
- Deployment에서 Secret을 참조

## 디버깅

```bash
# SealedSecret 확인
kubectl get sealedsecrets

# SealedSecret 상세 정보
kubectl describe sealedsecret cleanb-front-secret

# 복호화된 Secret 확인 (base64 인코딩됨)
kubectl get secret cleanb-front-secret -o yaml

# Secret 값 확인 (복호화)
kubectl get secret cleanb-front-secret -o jsonpath='{.data.NEXT_PUBLIC_API_URL}' | base64 -d
```

## 보안 모범 사례

1. ✅ **절대 암호화되지 않은 Secret을 Git에 커밋하지 마세요**
2. ✅ `k8s/.gitignore`에 `secret.yaml` 추가됨
3. ✅ `NEXT_PUBLIC_*` 변수에는 민감하지 않은 정보만 포함
4. ✅ API 키, DB 연결 문자열 등은 일반 환경 변수로 관리
5. ✅ 프로덕션 환경에서는 각 네임스페이스별로 별도의 Secret 사용
6. ✅ Sealed Secret은 특정 네임스페이스에 바인딩됨 (보안 강화)
