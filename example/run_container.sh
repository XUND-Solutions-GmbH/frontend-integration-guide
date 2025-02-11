#!/bin/sh
cd $(dirname "$0")
docker run --rm -d -p 3000:80 --env-file .env -v "$PWD/src":/var/www/html --name spike php:7.2-apache
