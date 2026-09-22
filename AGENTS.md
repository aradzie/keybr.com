# AGENTS.md

This file provides guidance to coding agents (Claude, Codex, etc) when working with code in this repository.

## What this is

keybr.com is a NodeJS/React web app that teaches touch typing by generating lessons targeting a
user's weakest keys. It's an npm workspaces monorepo built with `lage` as the
task runner across ~75 packages under `packages/*`.

## Common commands

Run from the repo root unless noted otherwise.

```shell
npm install                          # installs deps, then runs husky + patch-package via postinstall
npm run compile                      # tsc across all packages (via lage, incremental)
npm run build-dev                    # webpack dev build
npm run build                        # webpack production build
npm test                             # runs every package's `test` script via lage (defaults to MySQL, see below)
npm run lint                         # eslint over the whole repo
npm run lint-fix
npm run stylelint                    # stylelint over *.less/*.css
npm run format                       # prettier --write
npm start                            # starts the server (root/index.js), needs compile+build first
npm run watch                        # webpack --watch, run alongside `npm start` for live rebuilds
```

Config comes from `.env` (or a global `/etc/keybr/env`) copied from `.env.example`. The default
`DATABASE_CLIENT=sqlite` is enough for local dev; `./packages/devenv/lib/initdb.ts` seeds example
users/tables on first run.

By default, tests that touch the database (`@keybr/database` and its dependents, e.g.
`@keybr/server`) run against MySQL, which may not be running locally. The fastest way to run tests
is to point them at an in-memory sqlite database instead:

```shell
env DATABASE_CLIENT=sqlite npm test
```

Some of these packages also expose a `fast-test` script that already sets `DATABASE_CLIENT=sqlite`
for you — check `packages/<name>/package.json` first.

### Running a single package or test

Each package has its own `compile`/`test` scripts (see `packages/<name>/package.json`). Tests run
on Node's built-in test runner via the repo's own `tstest` wrapper (`packages/tsl/tstest`), not
Jest/Vitest:

```shell
cd packages/keybr-lesson
npx tstest --test 'lib/**/*.test.{ts,tsx}'      # all tests in this package
npx tstest --test lib/some/File.test.ts          # a single test file
```

Some packages need extra environment setup, loaded via `--import`, e.g. React/DOM-dependent
packages add `--import=@keybr/test-env-bundler` and/or `--import=@keybr/test-env-browser`, and
`@keybr/server` adds `--import=@keybr/test-env-server` (see that package's `test`/`fast-test`
scripts). Copy the exact `test` script from the target package's `package.json` rather than
guessing the imports.

To run compile/test for one package (with its dependency graph) instead of the whole repo, use
lage's scoping, e.g. `npx lage test --scope @keybr/lesson`.

## Architecture

### Workspace layout

- `packages/keybr-*` — shared library packages (`@keybr/foo`), each with `lib/` source,
  `tsconfig.json`, and its own `package.json` declaring intra-repo deps via `"@keybr/x": "*"`.
  Compiled output/types land in `.types/` (gitignored).
- `packages/page-*` — one package per top-level app section (`page-practice`, `page-profile`,
  `page-account`, `page-multiplayer`, `page-highscores`, `page-help`, `page-static`,
  `page-typing-test`, `page-layouts`). Each is UI-only React code for that section.
- `packages/keybr-pages-shared`, `keybr-pages-browser`, `keybr-pages-server` — the three
  compose the page-* packages into the actual app:
  - `pages-shared` — code shared between browser and server (route table `pages.ts`, root layout,
    shared components).
  - `pages-browser` — the client entry point (`entry.ts`/`App.tsx`), assembles all `page-*`
    packages into the SPA, handles routing/navigation chrome.
  - `pages-server` — SSR-side rendering of the shell around the same route table.
- `packages/server` — the Fastr-based (`@fastr/*`) HTTP server: routing, sessions, DB access,
  OAuth, multiplayer websocket server, third-party integrations (Paddle payments). `root/index.js`
  is the actual process entrypoint that requires `_config.js` then the compiled server.
- `root/` — the bundled output of both the server backend (compiled from `packages/server`) and
  the browser frontend (webpack output from `packages/keybr-pages-browser`). This is the unit of
  distribution: it is self-sufficient, has no external dependency on the rest of the repo or on
  `node_modules` outside itself, and is what gets deployed/run in production (`npm start` /
  `npm run start-docker` both run `root/index.js`).
- `packages/server-cli` — CLI utilities for server operations.
- `packages/keybr-lesson`, `keybr-phonetic-model*`, `keybr-textinput*`, `keybr-result*` — the core
  typing-lesson domain logic: lesson generation from weak-key statistics, keystroke capture and
  scoring, per-user result history/persistence.
- `packages/keybr-database`, `keybr-settings-database`, `keybr-result-userdata` — persistence
  layer, built on `knex`/`objection`.
- `packages/keybr-content*`, `keybr-lang`, `keybr-phonetic-model*` — per-language lesson content
  (books, quotes, word lists) and language-specific phonetic models used to generate lessons.
- `packages/keybr-multiplayer-*` — real-time multiplayer typing races (shared protocol, server,
  UI).
- `packages/tsl` — the in-house TypeScript loader/test runner (`tsnode`, `tstest`) used by every
  package's `compile`/`test` scripts instead of ts-node/Jest.
- `packages/test-env-*` — shared test setup packages (`--import`ed by `tstest`, see above).
- `scripts/` — repo maintenance scripts (translation extraction, config lint), run via
  `node scripts/<name>.js`.

### Build/task pipeline

`lage.config.js` defines the pipeline: `compile` depends on `^compile` (upstream packages compile
first) and `test` depends on `^test`. `npm run compile`/`npm test` at the root fan out through this
graph with caching; use `--no-cache` (already default in the root scripts) when you need a clean
run.

Webpack (`webpack.config.js`) bundles the browser entry from `keybr-pages-browser` for `npm run
build`/`build-dev`/`watch`; `webpack-manifest.js` wires the resulting asset manifest into the
server for SSR.

### i18n

UI strings go through `react-intl`; `npm run translate` (`scripts/translate.js`) drives
`@formatjs` extraction/compilation. Per-language word lists live under `keybr-content-words` and
similar content packages — see `docs/custom_language.md` for adding a new language and
`docs/custom_keyboard.md` for adding a keyboard layout.

### Linting conventions

- ESLint (`eslint.config.js`) enforces `simple-import-sort`, a custom `@keybr/scripts` eslint
  plugin, and `formatjs` message lint, on top of `typescript-eslint` + `react`/`react-hooks`
  recommended configs. `packages/server/**` and `*.test.{ts,tsx}` are exempted from the
  `react-hooks` ruleset.
- Pre-commit (`husky` + `lint-staged`) runs `prettier --write` + `eslint --fix` on staged
  `js/ts/tsx`, and `prettier --write` + `stylelint --fix` on staged `less/css`.
