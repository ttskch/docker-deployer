# docker-deployer

[![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/ttskch/deployer?style=flat-square)](https://hub.docker.com/r/ttskch/deployer)
[![Docker Pulls](https://img.shields.io/docker/pulls/ttskch/deployer?style=flat-square)](https://hub.docker.com/r/ttskch/deployer)

Docker image for [deployer.org](https://deployer.org/), a deployment tool written in PHP.

## Usage

```bash
$ docker run -v `pwd`:/wd ttskch/deployer dep deploy
```

## Tags

You can specify the version of deployer by docker image tag like below.

```bash
$ docker run -v `pwd`:/wd ttskch/deployer dep deploy # newest
$ docker run -v `pwd`:/wd ttskch/deployer:6 dep deploy # 6.*
$ docker run -v `pwd`:/wd ttskch/deployer:6.8 dep deploy # 6.8.*
$ docker run -v `pwd`:/wd ttskch/deployer:6.8.0 dep deploy # 6.8.0
$ docker run -v `pwd`:/wd ttskch/deployer:7.0.0-beta.13 dep deploy # 7.0.0-beta.13
```

Available tags are listed on [here](https://hub.docker.com/r/ttskch/deployer/tags?page=1&ordering=name).

When some new versions are published onto [deployer/deployer](https://packagist.org/packages/deployer/deployer), the corresponding tags will be pushed to this repository automatically within 1 day 👍
