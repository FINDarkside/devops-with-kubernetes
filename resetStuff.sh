k3d cluster delete
./create_cluster.sh
git add ./app2/manifests/pg-sealedsecret.yaml
git add ./app2/manifests/tg-sealedsecret.yaml
git commit -m "re-seal secrets"
git push
./bootstrap_flux.sh