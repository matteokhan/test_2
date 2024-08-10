## Requirements

First, install `node` using your prefered method. I suggest using `nvm`, you can see the docs [here](https://github.com/nvm-sh/nvm). You need version 20 or greater.

This project uses `pnpm`, refer to the documentation for installation steps.

If you have `npm` already installed, you can install `pnpm` like this:

```bash
npm install -g pnpm
```

## Environment variables

Copy the `.env.example` and rename it to `.env`. Fill the values according.

## Development

Install dependencies, then run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Run with docker

Make sure to set environment variables in the `.env` file according before creating the container image.

```bash
docker build -t leclerc-website --platform linux/amd64 .
docker run -p 80:3000 leclerc-website
```

## Create container image and publish to registry

```bash
gcloud auth login
gcloud auth configure-docker europe-west9-docker.pkg.dev
docker tag leclerc-website europe-west9-docker.pkg.dev/lec-lvo-refonteb2c-qua/leclerc-website/website:VERSION
docker push europe-west9-docker.pkg.dev/lec-lvo-refonteb2c-qua/leclerc-website/website:VERSION
```
