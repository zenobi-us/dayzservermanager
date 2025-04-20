# Dayz Server

> [!NOTE]
> based on a project by [Daniel Ceregatti](https://ceregatti.org/git/daniel).

A docker compose project that allows you to define multiple dayz servers and manage them via a simple web interface.

## Usage

1. be on linux or in wsl2.
2. clone the repo.
3. have mise installed.
4. have docker installed.

```sh
mise run start
```

## Architecture

- all files are stored in shared volumes
  - all mods downloaded to a shared volume
  - activated mods are symlinked into a directory named after the server id
- all servers are run in separate containers
- all servers are run in a single docker network

## Development

1. be on linux or in wsl2.
2. clone the repo.
3. have mise installed.
4. have docker installed.

```sh
mise run setup
mise run dev
```

This will:

- install all deps
- build the docker images
- start the containers with the nodejs server and vite ui src files host mounted
