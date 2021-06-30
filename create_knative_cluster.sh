k3d cluster create --port '8082:30080@agent[0]' -p 8081:80@loadbalancer --agents 2 --k3s-server-arg '--no-deploy=traefik'
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.12.1/controller.yaml
kubectl create namespace main-app
kubectl create namespace project
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube/pv3
kubectl apply -f https://github.com/knative/serving/releases/download/v0.18.0/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/v0.18.0/serving-core.yaml

kubectl apply -f https://github.com/knative/net-contour/releases/download/v0.18.0/contour.yaml \
            -f https://github.com/knative/net-contour/releases/download/v0.18.0/net-contour.yaml
kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress.class":"contour.ingress.networking.knative.dev"}}'
