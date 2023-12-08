# Getting Started

This is a [nodejs](https://nodejs.org/) application, so proficiency with the node ecosystem is required.

Clone this repository:

```shell
git clone git@github.com:aradzie/keybr.com.git
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
