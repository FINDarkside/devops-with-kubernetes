docker build -t findarkside/app3:$(git log -1 --pretty=%H) .
docker push findarkside/app3:$(git log -1 --pretty=%H)