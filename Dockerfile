FROM php:7-cli-alpine

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN \
    composer global require deployer/deployer deployer/recipes \
    && ln -sf ~/.composer/vendor/bin/dep /usr/bin/dep \
    && apk add --update openssh
