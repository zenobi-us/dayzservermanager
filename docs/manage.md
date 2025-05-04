# Manage

## Maps

Installing another map requires installing its mod and mpmissions files. Some maps maintain github repositories or public web sites for their mpmissions, while others do not. This project aims to support DayZ maps whose mpmissions are easily accessible "Out of the box" by maintaining configuration files for them.

The following management commands presume the server has been brought [up](#run).

## RCON

A terminal-based RCON client is included: <https://github.com/indepth666/py3rcon>.
The dz script manages what's necessary to configure and run it:

```shell
docker compose exec server dz rcon
```

To reset the RCON password in the Battle Eye configuration file, simply delete it, and a random one will be generated on the next server startup:

```shell
docker compose run --rm server rm serverfiles/battleye/baserver_x64_active*
```

Don't expect much from this RCON at this time.

## Update the DayZ server files

It's probably not a good idea to update the server files while a server is running. Bring everything down first:

```shell
docker compose down
```

Then run the command:

```shell
docker compose run --rm web dz update
```

This will update the server base files as well as all installed mods.

Don't forget to [bring it back up](#run).

## Stop the DayZ server

To stop the server:

```shell
docker compose exec server dz stop
```

The above sends the SIGINT signal to the server process. The server sometimes fails to stop with this signal. It may be necessary to force stop it with the SIGKILL:

```shell
docker compose exec server dz force
```

When the server exits cleanly, i.e. exit code 0, the container also stops. Otherwise, a crash is presumed, and the server will be automatically restarted.

To bring the entire stack down:

```shell
docker compose down
```

### Workshop - Add / List / Remove / Update mods

Interactive interface for managing mods.

```
docker compose exec server dz activate id | add id1 | deactivate id | list | modupdate | remove id
docker compose exec server dz a id | add id1 | d id | l | m | r id
```

Look for mods in the [DayZ Workshop](https://steamcommunity.com/app/221100/workshop/). Browse to one. In its URL will be
an `id` parameter. Here is the URL to SimpleAutoRun: <https://steamcommunity.com/sharedfiles/filedetails/?id=2264162971>. To
add it:

```
docker compose exec web dz add 2264162971
```

Adding and removing mods will add and remove their names from the `-mod=` parameter.

Optionally, to avoid re-downloading large mods, the `activate` and `deactivate` workshop commands will
simply disable the mod but keep its files. Keep in mind that mod updates will also update deactivated
mods.

The above is a bad example, as SimpleAutorun depends on Community Framework, which must also be installed, as well as made to load first.

### Looking under the hood

All the server files persist in a docker volume that represents the container's unprivileged user's home directory. Open a bash shell in
the running container:

```
docker compose exec web bash
```

Or open a shell into a new container if the docker stack is not up:

```
docker compose run --rm web bash
```

All the files used by the server are in a docker volume. Any change made will be reflected upon the next container startup.

Use this shell cautiously.

# Development mode

Add the following to the `.env` file:

```shell
export DEVELOPMENT=1
```

Bring the stack down then back up. Now, instead of the server starting when the server container comes up it will simply block, keeping the container up and accessible.

This allows access to the server container using exec. You can then start and stop the server manually, using `dz`:

```shell
# Go into the server container
docker compose exec shell bash
# Because this is now in the environment and keeping the server from starting, it'd still keep the server from starting unless we unset it
unset DEVELOPMENT
# See what the server status is
dz s
# Start it
dz start
```

To stop the server, hit control c.

Caveat: Some times the server doesn't stop with control c. If that's the case, control z, exit, then `dz f`. YMMV.

## TODO

- Create web management tool:
  - It shells out to `dz` (for now) for all the heavy lifting.
- Create some way to send messages to players on the server using RCON.
- Implement multiple ids for mod commands. (In progress)
