ARG VERSION=local
ARG BASE_IMAGE=dayzserver:base-${VERSION:-local}
FROM "$BASE_IMAGE" AS base

USER root

# Add bercon https://github.com/WoozyMasta/bercon
RUN wget https://github.com/WoozyMasta/bercon/releases/download/1.0.0/bercon \
    && chmod +x bercon \
    && mv bercon /usr/bin

RUN mkdir -p /serverfiles/steamapps/workshop/content && \
    chown -R user:user /serverfiles

COPY ./apps/manager/s6/services/* /etc/s6-overlay/s6-rc.d/

# Shut steamcmd up
COPY ./apps/manager/bin/steamservice.so /usr/lib/i386-linux-gnu/

FROM base AS build

USER root

WORKDIR /home/user/repo

COPY ./mise.toml ./
COPY ./.mise/tasks/setup ./.mise/tasks/setup
COPY ./.mise/tasks/core ./.mise/tasks/core
COPY .yarn/ ./.yarn/
COPY ./.yarnrc.yml ./yarn.lock ./package.json ./
COPY ./apps/manager/package.json ./apps/manager/
COPY ./pkgs/sdk/package.json ./pkgs/sdk/

RUN mise trust --yes --silent
RUN mise install
RUN mise run setup

COPY ./apps/manager/ ./apps/manager/
COPY ./pkgs/sdk/ ./pkgs/sdk/
COPY ./.mise ./.mise

RUN mise run core:tasks
RUN mise run manager:build

RUN chown -R user:user /home/user

USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

ENV MODE=manager
ENV STEAM_STORE=/store/steam
ENV SERVER_FILES=/store/serverfiles
ENV SERVER_MODS=/store/servermods
ENV SERVER_MISSIONS=/store/servermissions
ENV SERVER_PROFILES=/store/serverprofiles

# s6 handles the rest of the lifecycle.
ENTRYPOINT ["/init"]