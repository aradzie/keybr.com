# Getting Started

This is a [nodejs](https://nodejs.org/) application, so proficiency with the node ecosystem is required.

### Prerequisites

**NodeJS v22 or v20 must be installed.**\
You can get NodeJS v22 or v20 without impacting other Node installations using [Node Version Manager](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) (`nvm`)
<details>
  <summary>
  Get NodeJS v22 with nvm
  </summary>

  ```shell
  nvm install 22 && nvm use 22
  ```
</details>

### Install and setup

Clone this repository:

```shell
git clone https://github.com/aradzie/keybr.com.git
cd keybr.com
```

Install dependencies:

```shell
npm install
```

Create your own config file by copying `.env.example` to either `.env` or to a global location `/etc/keybr/env`. The latter is better because it allows you to run scripts from any location, not only from the root directory of the repository.

```shell
sudo mkdir -p /etc/keybr
sudo cp .env.example /etc/keybr/env
```

Run basic sanity checks, compile, bundle and test the application:

```shell
npm run compile
npm run build-dev
env DATABASE_CLIENT=sqlite npm test
```

When running the application for the first time, make sure that database tables are created and example users exist:

```shell
  ./packages/devenv/lib/initdb.ts
```

Finally, start the web server:

```shell
npm start
```

With the default config the application should be accessible at [http://localhost:3000/](http://localhost:3000/)

While actively developing, you may want your changes to be automatically built and
visible on page refresh.\
Run the following command at the same time as `npm start` in another shell:

```shell
npm run watch
```


### Docker
There is also an ability to deploy app with Docker or Docker Compose, `Dockerfile` and `docker-compose.yaml` are provided.

There are some limitations: exposed port should always be 3000
