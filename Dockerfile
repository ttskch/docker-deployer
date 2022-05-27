ARG PHP_VERSION
ARG COMPOSER_VERSION
FROM composer:$COMPOSER_VERSION as COMPOSER

FROM php:$PHP_VERSION-cli-alpine

COPY --from=COMPOSER /usr/bin/composer /usr/bin/composer

ARG DEPLOYER_VERSION
RUN \
  composer global require deployer/dist:$DEPLOYER_VERSION \
  && ln -sf ~/.composer/vendor/bin/dep /usr/bin/dep \
  && apk add --update bash openssh

WORKDIR /wd
