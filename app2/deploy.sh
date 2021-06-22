kubeseal -o yaml < secret.yaml > ./manifests/sealedsecret.yaml
kubectl apply -f ./manifests/