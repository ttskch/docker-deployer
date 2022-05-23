# Vercel

* When https://docker-deployer.vercel.app/api/cron is requested, check Packagist and create tags for all Deployer versions to GitHub repo.

# GitHub Actions

* `cron` Send request to https://docker-deployer.vercel.app/api/cron everyday.
* `build` When some tags is pushed to GitHub repo, build Dockerfile for the specified versions of PHP and Deployer and push the image to Docker Hub.

# Local utilities

* `bin/reguild.sh` Re-build all Docker images and push them to Docker Hub.
* `bin/retag.sh` Delete all tags from GitHub repo and re-create all tags to main branch and push them to GitHub repo.
