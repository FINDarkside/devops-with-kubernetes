#!/usr/bin/env bash
set -e
if [ $URL ]
then
    TODO=$(curl -w "%{redirect_url}" -o /dev/null -s "https://en.wikipedia.org/wiki/Special:Random")
    curl --header "Content-Type: application/json" \
        --request POST \
        --data '{"text":"Read '"$TODO"'"}' \
        $URL
fi
