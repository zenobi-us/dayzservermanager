FROM steamcmd/steamcmd:debian-bookworm AS base

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install _only_ the necessary packages
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install --no-install-recommends \
        binutils \
        bash \
        curl \
        git \
        gwenhywfar-tools \
        jq \
        libxml2-utils \
        ltrace \
        nano \
        patch \
        procps \
        rename \
        strace \
        wget \
        xmlstarlet \
        gpg gpg-agent gnupg2 \
        xz-utils

RUN apt-get update  \
    && apt-get -y --no-install-recommends install  \
    # install any other dependencies you might need
    sudo curl git ca-certificates build-essential \
    && rm -rf /var/lib/apt/lists/*


ARG S6_OVERLAY_VERSION=3.2.0.2

# Install s6-overlay
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz

ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV MISE_INSTALL_PATH="/usr/local/bin/mise"
ENV PATH="/mise/shims:/local/bin:$PATH"
RUN curl https://mise.run | sh

COPY ./pkgs/docker/bin/ /opt/repo/pkgs/docker/bin/

ENV PATH="/opt/repo/pkgs/docker/bin:$PATH"

SHELL ["/bin/bash", "-c"]