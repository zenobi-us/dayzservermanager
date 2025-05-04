# Architecture

[Docs]('./index.md) > [Architecture](./architecture.md)

## Overview

- Two or more containers: Manager and Game Server(s)
- Manager can create/stop/stop/remove game server containers via `DOCKER_HOST`
- File storage is managed in separate volumes
  - base server files installed from steam are in `STORE_SERVERFILES/<serverid>/`
  - mod files installed from steam are in `STORE_STEAM/workshop/<clientid>/content/`
  - mods installed to a server are in `STORE_SERVERMODS/<serverid>/`
  - profiles are stored in `STORE_SERVERPROFILES/<serverid>/`
  - customisations for mods provided by this projects are in `STORE_CUSTOMISATIONS`

- Download mods involves:
  - downloading mods to `STORE_STEAM/workshop/<clientid>/content/`

- Installing mods involves:
  - symlinking `STORE_STEAM/workshop/<clientid>/content/<modid>` to `STORE_SERVERMODS/<serverid>/<modid>`
  - running any `STORE_CUSTOMISATIONS/<modid>/install.sh` logic

- Starting a server involves:
  - mounting:
    - `STORE_STEAM` as `/store/steam`
    - `STORE_SERVERFILES` as `/store/serverfiles`
    - `STORE_SERVERMODS` as `/store/mods`
  - on startup, symlink:
    - `/store/serverfiles/<serverid>/` to `/serverfiles`
    - `/store/mods/<serverid>/` to `/serverfiles/mods`

## System Services

Controlled by S6 Overlay

## Authentication

Very simple local for now, based on steamcmd login. So not really auth, but more of a prerequisite check

## File Replication

Not handled, left up to docker volume strategy, so you could make use of docker plugins for this.
