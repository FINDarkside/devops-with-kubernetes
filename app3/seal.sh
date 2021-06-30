kubeseal -o yaml < secret.yaml > ./manifests/sealedsecret.yaml
kubeseal -o yaml < secret.yaml > ./serverlessManifests/sealedsecret.yaml