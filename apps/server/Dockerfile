ARG BASE_IMAGE=dayzserver:base
FROM "$BASE_IMAGE" AS base


# Setup a non-privileged user
ARG USER_ID

RUN groupadd -g ${USER_ID} user && \
    useradd -l -u ${USER_ID} -m -g user user && \
    mkdir -p /home/user /serverfiles/mpmissions /mods /mpmissions /profiles /opt/repo && \
    chown -R user:user /home/user /serverfiles /mods /mpmissions /profiles /opt/repo


COPY ./apps/server/s6/services/* /etc/s6-overlay/s6-rc.d/
COPY ./apps/server/s6/contents.d/* /etc/s6-overlay/s6-rc.d/user/contents.d/


FROM base AS build

WORKDIR /opt/repo

COPY ./mise.toml ./
COPY ./.mise/tasks/setup ./.mise/tasks/
COPY .yarn/ ./.yarn/
COPY ./.yarnrc.yml ./yarn.lock ./package.json ./
COPY ./apps/server/package.json ./apps/server/
COPY ./apps/sdk/package.json ./apps/sdk/

RUN mise trust --yes --silent
RUN mise install
RUN mise run setup

COPY ./apps/manager/ ./apps/manager/
COPY ./apps/sdk/ ./apps/sdk/
COPY .mise/ ./.mise/

RUN mise run core:tasks
RUN mise run server:build

# Use our non-privileged user
USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

# s6 handles the rest of the lifecycle. 
ENTRYPOINT ["/opt/repo/apps/server/bin/entrypoint.sh"]