#!/bin/sh

git pull

TAGS=`git tag`
LATEST_TAG=`echo $TAGS | sed -r "s/^(.* )?(.+)$/\2/"`

for TAG in $TAGS; do
  PHP_VERSION=`echo $TAG | sed -r "s/php-(.+)\/deployer-(.+)/\1/"`
  DEPLOYER_VERSION=`echo $TAG | sed -r "s/php-(.+)\/deployer-(.+)/\2/"`

  if [[ $DEPLOYER_VERSION =~ ^[0-9]+(\.[0-9]+)?$ ]] ; then
    DEPLOYER_VERSION=$DEPLOYER_VERSION.*
  fi

  docker build \
    --build-arg PHP_VERSION=$PHP_VERSION \
    --build-arg DEPLOYER_VERSION=$DEPLOYER_VERSION \
    -t ttskch/deployer:$DEPLOYER_VERSION \
    .
  docker push ttskch/deployer:$DEPLOYER_VERSION

  if [ $TAG = $LATEST_TAG ]; then
    docker tag ttskch/deployer:$DEPLOYER_VERSION ttskch/deployer:latest
    docker push ttskch/deployer:latest
  fi

  docker rmi ttskch/deployer:$DEPLOYER_VERSION
done
