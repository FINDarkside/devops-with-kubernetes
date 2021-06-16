KEY=$(openssl rand -hex 12)
docker build -t findarkside/app2:$(echo $KEY) .
docker push findarkside/app2:$(echo $KEY)