# CleanB Front - K3s 배포 가이드

백엔드 프로젝트와 동일한 방식으로 배포합니다.

## 백엔드 프로젝트 참고

백엔드: `~/Desktop/Project/cleanb`
- ArgoCD로 자동 배포
- Sealed Secrets로 환경 변수 관리
- k8s 폴더 구조 동일

## 사전 준비

### 1. 백엔드 Service 생성 (중요!)

프론트엔드가 백엔드를 호출하려면 백엔드에 Service가 필요합니다.

**백엔드 프로젝트에 Service 추가**:

```bash
cd ~/Desktop/Project/cleanb

# k8s/service.yaml 생성
cat > k8s/service.yaml <<EOF
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
EOF

# 배포
kubectl apply -f k8s/service.yaml
```

### 2. 환경 변수 설정 (Sealed Secret)

**중요**: 환경 변수는 반드시 Sealed Secret으로 관리해야 합니다!

```bash
# 1. k8s/secrets/cleanb-front-secret.yaml 파일 수정
vi k8s/secrets/cleanb-front-secret.yaml

# 2. kubeseal로 암호화
kubeseal -f k8s/secrets/cleanb-front-secret.yaml \
  -w k8s/secrets/cleanb-front-sealed-secret.yaml

# 3. SealedSecret 배포
kubectl apply -f k8s/secrets/cleanb-front-sealed-secret.yaml
```

상세한 가이드:
- [Secret 관리 가이드](./SECRETS.md)
- [백엔드 연동 가이드](./BACKEND_INTEGRATION.md)

2. **Docker 이미지 빌드 및 레지스트리에 푸시**

```bash
# Docker 이미지 빌드
docker build -t your-registry/cleanb-front:latest .

# Docker Hub 또는 프라이빗 레지스트리에 푸시
docker push your-registry/cleanb-front:latest
```

3. **k8s/deployment.yaml 수정**
   - `image` 필드를 실제 이미지 레지스트리 주소로 변경

4. **k8s/ingress.yaml 수정** (외부 접근이 필요한 경우)
   - `host` 필드를 실제 도메인으로 변경

## 배포 방법

### 1. 수동 배포 (Secret + Deployment + Service)

```bash
# 1. SealedSecret 배포 (먼저!)
kubectl apply -f k8s/secrets/cleanb-front-sealed-secret.yaml

# 2. Deployment 배포
kubectl apply -f k8s/deployment.yaml

# 3. Service 배포
kubectl apply -f k8s/service.yaml

# 배포 상태 확인
kubectl get secret cleanb-front-secret
kubectl get pods -l app=cleanb-front
kubectl get svc cleanb-front-service
```

### 2. ArgoCD 자동 배포 (권장)

백엔드처럼 ArgoCD를 사용하면 Git push만으로 자동 배포됩니다.

```bash
# ArgoCD Application 배포
kubectl apply -f argocd/application.yaml

# ArgoCD에서 자동으로 k8s/ 폴더의 모든 리소스를 배포합니다
# - secrets/cleanb-front-sealed-secret.yaml
# - deployment.yaml
# - service.yaml
# - ingress.yaml (옵션)

# ArgoCD UI에서 확인
# 또는 CLI로 확인
kubectl get applications -n argocd
```

**ArgoCD 자동 배포 흐름**:
1. Git에 sealed-secret.yaml 커밋 → ArgoCD가 자동으로 배포
2. deployment.yaml 수정 → ArgoCD가 자동으로 적용
3. 이미지 태그 변경 → ArgoCD가 자동으로 롤아웃

### 2. Ingress 배포 (외부 접근이 필요한 경우)

```bash
kubectl apply -f k8s/ingress.yaml

# Ingress 상태 확인
kubectl get ingress cleanb-front-ingress
```

### 3. 전체 한번에 배포

```bash
kubectl apply -f k8s/
```

## 환경 변수 설정

프론트엔드에서 환경 변수가 필요한 경우:

### ConfigMap 사용

```bash
# ConfigMap 생성
kubectl create configmap cleanb-front-config \
  --from-literal=NEXT_PUBLIC_API_URL=http://backend-service:8080

# deployment.yaml에서 ConfigMap 참조
# env:
# - name: NEXT_PUBLIC_API_URL
#   valueFrom:
#     configMapKeyRef:
#       name: cleanb-front-config
#       key: NEXT_PUBLIC_API_URL
```

### Secret 사용 (민감한 정보)

```bash
# Secret 생성
kubectl create secret generic cleanb-front-secret \
  --from-literal=API_KEY=your-secret-key

# deployment.yaml에서 Secret 참조
# env:
# - name: API_KEY
#   valueFrom:
#     secretKeyRef:
#       name: cleanb-front-secret
#       key: API_KEY
```

## 업데이트 방법

```bash
# 새 이미지 빌드 및 푸시
docker build -t your-registry/cleanb-front:v1.0.1 .
docker push your-registry/cleanb-front:v1.0.1

# Deployment 이미지 업데이트
kubectl set image deployment/cleanb-front cleanb-front=your-registry/cleanb-front:v1.0.1

# 또는 deployment.yaml 수정 후
kubectl apply -f k8s/deployment.yaml

# 롤아웃 상태 확인
kubectl rollout status deployment/cleanb-front
```

## 로그 확인

```bash
# Pod 목록 확인
kubectl get pods -l app=cleanb-front

# 특정 Pod 로그 확인
kubectl logs <pod-name>

# 실시간 로그 확인
kubectl logs -f <pod-name>
```

## 디버깅

```bash
# Pod 상세 정보 확인
kubectl describe pod <pod-name>

# Pod 내부 접속
kubectl exec -it <pod-name> -- sh

# Service 엔드포인트 확인
kubectl get endpoints cleanb-front-service
```

## 삭제

```bash
# 전체 리소스 삭제
kubectl delete -f k8s/

# 개별 리소스 삭제
kubectl delete deployment cleanb-front
kubectl delete service cleanb-front-service
kubectl delete ingress cleanb-front-ingress
```

## 주의사항

1. **이미지 레지스트리**: deployment.yaml의 이미지 주소를 실제 레지스트리 주소로 변경하세요
2. **리소스 제한**: 서버 사양에 맞게 resources 설정을 조정하세요
3. **Replica 수**: 트래픽에 맞게 replicas 수를 조정하세요
4. **백엔드 연결**: 백엔드 서비스와 통신이 필요한 경우 환경 변수로 백엔드 서비스 주소를 설정하세요
5. **HTTPS**: 프로덕션 환경에서는 cert-manager를 설치하여 Let's Encrypt SSL 인증서를 자동으로 발급받는 것을 권장합니다

## 백엔드 서비스와의 연결

백엔드가 k3s에서 `backend-service`라는 이름으로 실행 중이라면:

```yaml
env:
- name: NEXT_PUBLIC_API_URL
  value: "http://backend-service:8080"  # 백엔드 서비스 이름과 포트
```

또는 외부 API를 사용하는 경우:

```yaml
env:
- name: NEXT_PUBLIC_API_URL
  value: "https://api.your-domain.com"
```
