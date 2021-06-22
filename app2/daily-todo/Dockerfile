#!/usr/bin/env bash
FROM alpine
RUN apk add --no-cache bash curl
WORKDIR /usr/src/app 
COPY add-todo.sh ./
CMD ["./add-todo.sh"]