KEY=$(openssl rand -hex 12)
docker build -t findarkside/dummysite-app:$(echo $KEY) .
docker push findarkside/dummysite-app:$(echo $KEY)