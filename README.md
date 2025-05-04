# DayZDockerServer

A Linux [DayZ](https://dayz.com) server in a [Docker](https://docs.docker.com/) container.

## Requirements

- Docker
- Yq (yaml version of JQ)
- Linux
- A steam account that owns Dayz

## Usage

For local usage, just run run the manager server with the `docker.sock` mounted.

```sh
docker run --rm -it -v /var/run/docker.dock:/var/run/docker.sock -e DOCKER_HOST=/var/run/docker.sock themanagerimage
```

## Development

- have docker and docker compose installed
- have mise installed
- have devcontainers (vscode)

```shell
git clone https://ceregatti.org/git/daniel/dayzdockerserver.git
cd dayzdockerserver
./setup images
```

Then reopen in container.
