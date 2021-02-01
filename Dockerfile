ARG PHP_VERSION
FROM php:$PHP_VERSION-cli-alpine

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ARG DEPLOYER_VERSION

RUN \
    composer global require deployer/deployer:$DEPLOYER_VERSION \
    && composer global require deployer/recipes \
    && ln -sf ~/.composer/vendor/bin/dep /usr/bin/dep \
    && apk add --update openssh
