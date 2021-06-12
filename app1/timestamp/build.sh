KEY=$(openssl rand -hex 12)
docker build -t findarkside/app1-timestamp:$(echo $KEY) .
docker push findarkside/app1-timestamp:$(echo $KEY)