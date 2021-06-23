k3d cluster create --port '8082:30080@agent[0]' -p 8081:80@loadbalancer --agents 2
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.12.1/controller.yaml
kubectl create namespace main-app
kubectl create namespace project
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube/pv3

kubectl create namespace prometheus
helm install prometheus-community/kube-prometheus-stack --generate-name --namespace prometheus
kubectl create namespace loki-stack
helm upgrade --install loki --namespace=loki-stack loki/loki-stack

kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://raw.githubusercontent.com/argoproj/argo-rollouts/stable/manifests/install.yaml

helm install my-nats nats/nats -n project2
