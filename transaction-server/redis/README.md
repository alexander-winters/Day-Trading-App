# Redis Docker Container

This repository contains a Dockerfile for running Redis in a Docker container, along with a custom Redis configuration file and a Lua script for setting a default time-to-live (TTL) for keys.


## Building the Redis Docker image

To build the Redis Docker image, run the following command in the root directory of this repository:

  `docker build -t my-redis-image .`


## Starting the Redis container

To start the Redis container, run the following command:

`docker run --name my-redis-container -d redis`

This will start a Redis container with the default configuration and give it the name `my-redis-container`.


## Connecting to the Redis container using sh

To connect to the Redis container using `sh` so that you can `chmod +x` the `set_default_ttl` script, use the following command:

`docker exec -it my-redis-container sh`

This will start a shell inside the Redis container.

Once inside the container, navigate to `/usr/lib/redis/modules directory`:

`cd /usr/lib/redis/modules`

Execute:

`chmod +x set_default_ttl.lua`

Exit the container's shell by running the `exit` command.

Restart the Redis container to apply the changes:

`docker restart my-redis-container`


## Getting the IP address of the container

To get the IP address of the Redis container, use the following command:
`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my-redis-container`


## Connecting to the container using `-h <container-ip>`:
`docker run --rm -it redis redis-cli -h <redis-container-ip-address>`

This will start the Redis CLI inside a container and connect it to the same network as the Redis container.

## Interacting with Redis using the CLI

Once you are connected to the Redis container using the Redis CLI, you can use various commands to interact with the stored data. Here are a few common commands:

- `keys *`: List all the keys in the Redis database.
- `get <key>`: Get the value of a specific key.
- `ttl <key>`: Get the remaining time-to-live (TTL) of a specific key.
