KEY=$(openssl rand -hex 12)
docker build -t findarkside/app3:$(echo $KEY) .
docker push findarkside/app3:$(echo $KEY)