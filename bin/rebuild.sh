#!/bin/sh

git pull

TAGS=`git tag`
LATEST_TAG=`echo $TAGS | sed -r "s/^(.* )?(.+)$/\2/"`

for TAG in $TAGS; do
  PHP_VERSION=`echo $TAG | sed -r "s/php-(.+)\/deployer-(.+)/\1/"`
  DEPLOYER_VERSION=`echo $TAG | sed -r "s/php-(.+)\/deployer-(.+)/\2/"`
  IMAGE_TAG=$DEPLOYER_VERSION

  if [ $PHP_VERSION = '5' ] || [ $PHP_VERSION = '7.0' ]; then
    COMPOSER_VERSION=2.2
  else
    COMPOSER_VERSION=latest
  fi

  if [[ $DEPLOYER_VERSION =~ ^[0-9]+(\.[0-9]+)?$ ]] ; then
    DEPLOYER_VERSION=$DEPLOYER_VERSION.*
  fi

  docker build \
    --build-arg PHP_VERSION=$PHP_VERSION \
    --build-arg COMPOSER_VERSION=$COMPOSER_VERSION \
    --build-arg DEPLOYER_VERSION=$DEPLOYER_VERSION \
    -t ttskch/deployer:$IMAGE_TAG \
    .

  docker push ttskch/deployer:$IMAGE_TAG

  if [ $TAG = $LATEST_TAG ]; then
    docker tag ttskch/deployer:$IMAGE_TAG ttskch/deployer:latest
    docker push ttskch/deployer:latest
  fi

  docker rmi ttskch/deployer:$IMAGE_TAG
done
