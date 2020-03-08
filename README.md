# Build Instructions
1. Install C# dependencies with command `dotnet restore` in the root directory.
2. Install client dependencies with command `yarn` in the client directory.
3. Running the application can be done with the `F5` `.vscode/launch.json` command.

# Building With Docker
1. Build the `Dockerfile` with the below command in the root directory.
```
docker image build -t {image_name} .
``` 
2. To see all the images run the command
```
docker images
```
3. Run the container with the command 
```
docker container run --publish 8888:80 --detach --name {container_name} {image_name}
```
```
--publish asks Docker to forward traffic incoming on the host’s port 8888, to the container’s port 80 (containers have their own private set of ports, so if we want to reach one from the network, we have to forward traffic to it in this way; otherwise, firewall rules will prevent all network traffic from reaching your container, as a default security posture).

--detach asks Docker to run this container in the background.
```

---
# Docker Clean Up
## Remove Images/Repositories
1. List images with command
```
docker images
```
2. Remove repository by name
```
docker rmi {image_name}
```

## Remove Container 
### Remove by container name
```
docker container rm --force {container_name}
```
### Remove by container id
1. List container ids
```
docker container ls -a
```
2. Remove the container with the id
```
docker container rm --force {container_id}
```

## Remove Others
1. This command will remove all stopped containers, all dangling images, and all unused networks
```
docker system prune
```