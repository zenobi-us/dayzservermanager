ARG VERSION=local
ARG BASE_IMAGE=dayzserver:base-${VERSION:-local}
FROM "$BASE_IMAGE" AS base

COPY ./apps/server/s6/services/* /etc/s6-overlay/s6-rc.d/

WORKDIR /opt/repo

COPY ./mise.toml ./
COPY ./.mise/tasks/setup ./.mise/tasks/setup
COPY ./.mise/tasks/core ./.mise/tasks/core
COPY .yarn/ ./.yarn/
COPY ./.yarnrc.yml ./yarn.lock ./package.json ./
COPY ./apps/server/package.json ./apps/server/
COPY ./pkgs/sdk/package.json ./pkgs/sdk/

RUN mise trust --yes --silent
RUN mise install
RUN mise run setup

COPY ./apps/manager/ ./apps/manager/
COPY ./pkgs/sdk/ ./pkgs/sdk/
COPY ./.mise ./.mise

RUN mise run core:tasks
RUN mise run server:build

RUN mkdir -p /store/steam /serverfiles/{mpmissions, mods, profiles}

ENV MODE=server
ENV STEAM_STORE=/store/steam
ENV STEAM_STORE_MODS=/store/steam/workshop/content
ENV SERVER_FILES=/serverfiles
ENV SERVER_MODS=/serverfiles/mods
ENV SERVER_MISSIONS=/serverfiles/mpmissions
ENV SERVER_PROFILES=/serverfiles/profiles

# s6 handles the rest of the lifecycle. 
ENTRYPOINT ["/init"]