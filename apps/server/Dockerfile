ARG VERSION=local
ARG BASE_IMAGE=dayzserver:base-${VERSION:-local}
FROM "$BASE_IMAGE" AS base

USER root

RUN mkdir -p /serverfiles/mpmissions /mods /mpmissions /profiles && \
    chown -R user:user /serverfiles /mods /mpmissions /profiles

COPY ./apps/server/s6/services/* /etc/s6-overlay/s6-rc.d/


FROM base AS build

USER root

WORKDIR /home/user/repo

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


RUN chown -R user:user /home/user

USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

ENV MODE=server
ENV STEAM_STORE=/store/steam
ENV SERVER_FILES=/store/serverfiles
ENV SERVER_MODS=/store/serverfiles/mods
ENV SERVER_MISSIONS=/store/serverfiles/mpmissions
ENV SERVER_PROFILES=/store/serverfiles/profiles

# s6 handles the rest of the lifecycle. 
ENTRYPOINT ["/init"]