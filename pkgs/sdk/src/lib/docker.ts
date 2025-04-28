import Dockerode from 'dockerode';

// DockerModem will use DOCKER_HOST from process.env by default
export const dockerClient = new Dockerode();
