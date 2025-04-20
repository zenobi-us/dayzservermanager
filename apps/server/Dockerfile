FROM dayzserver:base



# define entrypoint for dayz-server
COPY --chmod=700 <<EOF /etc/s6-overlay/s6-rc.d/dayz-server/run
#!/bin/sh
exec dz start
EOF

# Setup a non-privileged user
ARG USER_ID

RUN groupadd -g ${USER_ID} user && \
    useradd -l -u ${USER_ID} -m -g user user && \
    mkdir -p /home/user /serverfiles/mpmissions /mods /mpmissions /profiles && \
    chown -R user:user /home/user /serverfiles /mods /mpmissions /profiles

# Use our non-privileged user
USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

# Run the server. The use of both ENTRYPOINT and CMD is to allow for development mode.
ENTRYPOINT ["entrypoint.sh"]
CMD ["start.sh"]
