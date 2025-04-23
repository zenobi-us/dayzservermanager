# DayZDockerServer

A Linux [DayZ](https://dayz.com) server in a [Docker](https://docs.docker.com/) container.

# Requirements

- Docker
- Yq (yaml version of JQ)
- Linux
- A steam account that owns Dayz

## Usage

- Have docker and docker compose installed.
- [Create an env file](#create-an-env-file).
- [Build the images](#build-the-images).
- [Create a server](#create-a-server)

## Development

- have docker and docker compose installed
- have mise installed

```shell
git clone https://ceregatti.org/git/daniel/dayzdockerserver.git
cd dayzdockerserver
```

### Create an Env File

Create a `.env` file that contains your user id. Usually the `${UID}` shell variable has this:

```shell
echo "export USER_ID=${UID}" | tee .env
```

### Build the Images

There are two images, the manager and the game server.

```shell
./setup images
```

Install the server files. This will download about 2.9G of files.

```shell
./setup install
```

### Create more servers

Clone the `example.docker-compose.serverone.yml` file to create a new service:

1. rename the file to `docker-compose.<service_name>.yml`.
2. replace all occurrences of `SERVERNAME` with your `<service_name>`.
3. increment the ports by one. `2302:2302/udp` -> `2303:2302/udp`, etc...

### Steam Integration

[SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) is used to manage Steam downloads. A vanilla DayZ server can be installed with the `anonymous` Steam user, but most mods cannot. If the goal is to add mods, a real Steam login must be used.

Login:

```shell
docker compose run --rm manager dz login
```

- Follow the prompts.
- Hit enter to accept the defaults. Or not.

If you want to use your real steam username, then the process will wait indefinitely until the login is complete.

The credentials will be managed by [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD).
This will store a session token in the `homedir` docker volume. All subsequent SteamCMD commands will use this.
so this process does not need to be repeated unless the session expires or the docker volume is deleted.

To manage the login credentials, simply run the above command again. See [Manage](#manage).

## Run

Edit `files/serverDZ.cfg` and set the values of any variables there. See the [documentation](https://forums.dayz.com/topic/239635-dayz-server-files-documentation/) if you want, but most of the default values are fine. At the very least, change the server name:

```
hostname = "Something other than Server Name";   // Server name
```

Install the server config file:

```shell
docker compose run --rm server dz c
```

The maintenance of the config file is a work in progress. The goal is to create a facility for merging changes into the config file and maintain a paper trail of changes.

Launch the stack into the background:

```shell
docker compose up -d
```

There will be nothing in mpmissions when the server container starts for the first time. A pristine copy of `dayzOffline.chernarusplus` will be copied from the `mpmission` volume to the server container. This will be the default map. To install other maps, see [Maps](#maps).

To see the server log:

```shell
docker compose logs -f server
```

## Stopping the server

To stop the DayZ server:

```shell
docker compose exec server dz stop
```

If it exits cleanly, the container will also stop. Otherwise a crash is presumed and the server will restart. Ideally, the server would always exit cleanly, but... it's DayZ.

To stop the containers:

```shell
docker compose stop
```

To bring the entire stack down:

```shell
docker compose down
```

## Manage

### Maps

Installing another map requires installing its mod and mpmissions files. Some maps maintain github repositories or public web sites for their mpmissions, while others do not. This project aims to support DayZ maps whose mpmissions are easily accessible "Out of the box" by maintaining configuration files for them.

The following management commands presume the server has been brought [up](#run).

### RCON

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

### Update the DayZ server files

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

### Stop the DayZ server

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
