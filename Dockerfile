ARG PHP_VERSION
FROM php:$PHP_VERSION-cli-alpine

ARG DEPLOYER_VERSION

RUN \
    curl -LO https://deployer.org/releases/v$DEPLOYER_VERSION/deployer.phar \
    && mv deployer.phar /usr/bin/dep \
    && chmod +x /usr/bin/dep \
    && apk add --update openssh
