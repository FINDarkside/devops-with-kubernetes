gcloud container clusters create dwk-cluster --zone=europe-north1-b
gcloud container clusters get-credentials dwk-cluster --zone=europe-north1-b
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.12.1/controller.yaml