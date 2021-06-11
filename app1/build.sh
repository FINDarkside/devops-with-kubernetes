docker build -t findarkside/app1:$(git log -1 --pretty=%H) .
docker push findarkside/app1:$(git log -1 --pretty=%H)