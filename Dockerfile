ARG PHP_VERSION
ARG COMPOSER_VERSION
FROM composer:$COMPOSER_VERSION as COMPOSER

FROM php:$PHP_VERSION-cli-alpine

COPY --from=COMPOSER /usr/bin/composer /usr/bin/composer

ARG DEPLOYER_VERSION
RUN \
  # attempt to download from http://deployer.org
  if curl -LOkf http://deployer.org/releases/v$DEPLOYER_VERSION/deployer.phar >/dev/null 2>&1; then \
    mv deployer.phar /usr/bin/dep \
    && chmod +x /usr/bin/dep; \
  # attempt to download from https://github.com/deployphp/deployer
  elif curl -LOkf https://github.com/deployphp/deployer/releases/download/v$DEPLOYER_VERSION/deployer.phar >/dev/null 2>&1; then \
    mv deployer.phar /usr/bin/dep \
    && chmod +x /usr/bin/dep; \
  # attempt to install with composer require deployer/dist
  elif composer global require --dry-run deployer/dist:$DEPLOYER_VERSION >/dev/null 2>&1; then \
    composer global require deployer/dist:$DEPLOYER_VERSION \
    && ln -sf ~/.composer/vendor/bin/dep /usr/bin/dep; \
  # attempt to install with composer require deployer/deployer
  else \
    composer global require deployer/deployer:$DEPLOYER_VERSION \
    && ln -sf ~/.composer/vendor/bin/deployer.phar /usr/bin/dep; \
  fi \
  && apk add --update bash openssh

WORKDIR /wd
