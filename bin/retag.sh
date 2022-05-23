#!/bin/sh

git pull

gh workflow disable build

for TAG in `git tag`; do
  git tag -d $TAG
  git push origin :$TAG
  git tag $TAG
  git push origin $TAG
done

gh workflow enable build
