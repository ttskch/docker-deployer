# Vercel

* When https://docker-deployer.vercel.app/api/cron is requested, check Packagist and create tags for all Deployer versions to GitHub repo.

# GitHub Actions

* `cron` Send request to https://docker-deployer.vercel.app/api/cron everyday.
* `build` When some tags is pushed to GitHub repo, build Dockerfile for the specified versions of PHP and Deployer and push the image to Docker Hub.

# Local utilities

* `bin/reguild.sh` Re-build all Docker images and push them to Docker Hub.
* `bin/retag.sh` Delete all tags from GitHub repo and re-create all tags to main branch and push them to GitHub repo.

# Tips

* How to list all tags for a Docker Hub image:
  ```shell
  $ wget -q https://registry.hub.docker.com/v1/repositories/ttskch/deployer/tags -O - | sed -e 's/[][]//g' -e 's/"//g' -e 's/ //g' | tr '}' '\n' | awk -F: '{print $3}'
  ```
  > [How can I list all tags for a Docker image on a remote registry? - Stack Overflow `#answer-39454426`](https://stackoverflow.com/questions/28320134/how-can-i-list-all-tags-for-a-docker-image-on-a-remote-registry#answer-39454426)
* How to delete tag for Docker Hub image via CLI:
  ```shell
  $ export HUB_TOKEN=$(curl -s -H "Content-Type: application/json" -X POST -d '{"username": "ttskch", "password": "{password}"}' https://hub.docker.com/v2/users/login/ | jq -r .token)
  
  $ wget -q https://registry.hub.docker.com/v1/repositories/ttskch/deployer/tags -O - | sed -e 's/[][]//g' -e 's/"//g' -e 's/ //g' | tr '}' '\n' | awk -F: '{print $3}' | xargs -I{} curl -i -X DELETE -H "Accept: application/json" -H "Authorization: JWT $HUB_TOKEN" https://hub.docker.com/v2/repositories/ttskch/deployer/tags/{}/
  ```
  > [How do I delete a docker image from docker hub via command line? - Stack Overflow `#answer-59334315`](https://stackoverflow.com/questions/44209644/how-do-i-delete-a-docker-image-from-docker-hub-via-command-line#answer-59334315)
