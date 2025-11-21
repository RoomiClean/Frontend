# 빠른 시작 가이드

백엔드와 동일한 방식으로 kubeseal을 사용하여 배포합니다.

## 전제 조건

- k3s 클러스터 실행 중
- kubeseal CLI 설치됨
- kubectl 설정 완료
- 백엔드 Service(`cleanb-service`) 생성됨

## ArgoCD 자동 배포 (권장)

### 1단계: Secret 생성 및 암호화

```bash
# 1. secrets/cleanb-front-secret.yaml 파일 수정 (환경 변수 입력)
vi k8s/secrets/cleanb-front-secret.yaml

# 2. kubeseal로 암호화
kubeseal -f k8s/secrets/cleanb-front-secret.yaml \
  -w k8s/secrets/cleanb-front-sealed-secret.yaml

# 3. Git에 커밋 (암호화된 파일만!)
git add k8s/secrets/cleanb-front-sealed-secret.yaml
git commit -m "Add sealed secret for frontend"
git push
```

### 2단계: ArgoCD Application 배포 (처음 1회만)

```bash
# ArgoCD Application 생성
kubectl apply -f argocd/application.yaml

# ArgoCD가 자동으로 k8s/ 폴더의 모든 리소스를 배포합니다
```

### 3단계: Docker 이미지 빌드 및 푸시

```bash
# 이미지 빌드
docker build -t your-registry/cleanb-front:latest .

# 푸시
docker push your-registry/cleanb-front:latest
```

### 4단계: deployment.yaml 이미지 주소 변경 및 커밋

```bash
# k8s/deployment.yaml 수정
vi k8s/deployment.yaml
# image: your-registry/cleanb-front:latest  # 실제 주소로 변경

# Git 커밋
git add k8s/deployment.yaml
git commit -m "Update image"
git push

# ArgoCD가 자동으로 감지하고 배포합니다!
```

### 5단계: 배포 확인

```bash
# ArgoCD Application 상태 확인
kubectl get applications -n argocd

# Pod 상태 확인
kubectl get pods -l app=cleanb-front

# 로그 확인
kubectl logs -f -l app=cleanb-front
```

## 수동 배포 (ArgoCD 없이)

```bash
# 1. SealedSecret 먼저 배포
kubectl apply -f k8s/secrets/cleanb-front-sealed-secret.yaml

# 2. 나머지 리소스 배포
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml  # 외부 접근이 필요한 경우

# 3. 상태 확인
kubectl get pods -l app=cleanb-front
```

## 주의사항

### Next.js 환경 변수

- `NEXT_PUBLIC_*`: 빌드 타임에 번들에 포함 (민감하지 않은 정보만)
- 일반 환경 변수: 런타임에 Secret으로 주입 가능

### Secret 업데이트 시

```bash
# secret.yaml 수정 후
kubeseal -f k8s/secret.yaml -w k8s/sealed-secret.yaml
kubectl apply -f k8s/sealed-secret.yaml

# Pod 재시작
kubectl rollout restart deployment/cleanb-front
```

## 디버깅

```bash
# Pod 로그
kubectl logs -f -l app=cleanb-front

# Pod 상태
kubectl describe pod -l app=cleanb-front

# Secret 확인
kubectl get secret cleanb-front-secret
```

---

상세한 가이드:
- [배포 가이드](./README.md)
- [Secret 관리](./SECRETS.md)
