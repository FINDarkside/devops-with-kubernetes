kubeseal -o yaml < pg-secret.yaml > ./manifests/pg-sealedsecret.yaml
kubeseal -o yaml < tg-secret.yaml > ./manifests/tg-sealedsecret.yaml