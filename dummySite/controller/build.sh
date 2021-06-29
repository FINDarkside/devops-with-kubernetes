KEY=$(openssl rand -hex 12)
docker build -t findarkside/dummysite-controller:$(echo $KEY) .
docker push findarkside/dummysite-controller:$(echo $KEY)