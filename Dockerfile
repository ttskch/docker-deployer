ARG PHP_VERSION
FROM php:$PHP_VERSION-cli-alpine

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ARG DEPLOYER_VERSION

RUN \
    if [ `echo $DEPLOYER_VERSION | grep -e "*" -e "@"` ] ; then \
        composer global require deployer/deployer:$DEPLOYER_VERSION ; \
        ln -sf ~/.composer/vendor/bin/dep /usr/bin/dep ; \
    else \
        curl -LO https://deployer.org/releases/v$DEPLOYER_VERSION/deployer.phar ; \
        mv deployer.phar /usr/bin/dep ; \
        chmod +x /usr/bin/dep ; \
    fi \
    && apk add --update bash openssh
