KEY=$(openssl rand -hex 12)
docker build -t findarkside/app2-broadcaster:$(echo $KEY) .
docker push findarkside/app2-broadcaster:$(echo $KEY)