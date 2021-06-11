docker build -t findarkside/app2:$(git log -1 --pretty=%H) .
docker push findarkside/app2:$(git log -1 --pretty=%H)