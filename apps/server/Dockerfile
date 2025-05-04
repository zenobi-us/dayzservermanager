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
COPY ./pkgs/ ./pkgs/
COPY ./.mise/ ./.mise/

RUN mise run core:tasks
RUN mise run server:build

RUN mkdir -p /store/steam /serverfiles/{mpmissions,mods,profiles}

ENV MODE=server

ENV STEAMSTORE=/store/steam
ENV STEAMSTORE_MODS=/store/steam/workshop/content
ENV SERVERSTORE_FILES=/store/serverfiles
ENV SERVERSTORE_MODS=/store/servermods
ENV SERVERSTORE_MISSIONS=/store/servermissions
ENV SERVERSTORE_PROFILES=/store/serverprofiles

#
# Mounted from subpath volume
# serverfiles:/<serverid>/
ENV SERVERFILES=/serverfiles
#
# Mounted from subpath volume
# servermods:/<serverid>/ 
ENV SERVERFILES_MODS=/serverfiles/mods
#
# Mounted from subpath volume
# servermissions:/<serverid>/
ENV SERVERFILES_MISSIONS=/serverfiles/mpmissions
#
# Mounted from subpath volume
# serverprofiles:/<serverid>/ 
ENV SERVERFILES_PROFILES=/serverfiles/profiles

# s6 handles the rest of the lifecycle. 
ENTRYPOINT ["/init"]