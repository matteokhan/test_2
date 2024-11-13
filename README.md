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

## How to contribute

We follow a simple git flow process:

1. Create new branches from `main`
2. Work on your feature or bug fix
3. Create a pull request to merge your branch into `main`
4. Request code review from the team
5. After successful merge, delete the branch

## How to deploy

### Build an image

Checkout to `main` branch. All the container images are created from this branch. Then create a image.

Notice this image is a production build, not intended for local development.

```bash
docker build -t leclerc-website --platform linux/amd64 .
```

### Run locally with Docker

This build will ignore the `.env` file. So you need to set environment variables when running the container.

```bash
docker run -p 80:8080 -e <ENV_VAR1=VALUE> -e <ENV_VAR2=VALUE2> leclerc-website
```

### Publish to registry

In order to run this image on a cloud environment, it needs to be published to our registry.

Assign a `VERSION` number. Use semver.

```bash
gcloud auth login
gcloud auth configure-docker europe-west9-docker.pkg.dev
docker tag leclerc-website europe-west9-docker.pkg.dev/lec-lvo-refonteb2c-qua/leclerc-website/website:VERSION
docker push europe-west9-docker.pkg.dev/lec-lvo-refonteb2c-qua/leclerc-website/website:VERSION
```
