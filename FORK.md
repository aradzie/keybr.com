# keybr.com fork — Korean (Hangul) support

This document is for people using or deploying **this fork** of [keybr.com](https://github.com/aradzie/keybr.com). Upstream docs still apply; this file only covers the fork delta and practical run/deploy steps.

## What this fork adds

- **Language:** Korean (`ko`), Hangul practiced as **2-set (두벌식 / Dubeolsik) jamo keystrokes**
- **Keyboard layout:** `{KR} (두벌식)` (`ko-kr`), with layout emulation enabled
- **Geometry:** Korean 103 (and full), plus standard ANSI/ISO/matrix options
- **Word list & phonetic model:** `words-ko.json`, `model-ko.data` (generated from a Korean dictionary)
- **Alphabet:** compatibility jamo only (`ㄱㄲㄴ…ㅎ`, `ㅏㅐㅑ…ㅣ`) — not composed syllables

Practice focuses on the **keys you press** on a 2-set keyboard, not on finished syllable blocks.

## Run locally

Requires **Node.js v24**. See also [docs/getting_started.md](./docs/getting_started.md).

```shell
git clone <this-fork-url>
cd keybr.com
npm install
```

Config (either is fine):

```shell
# project-local
cp .env.example .env

# or system-wide (usable from any cwd)
sudo mkdir -p /etc/keybr
sudo cp .env.example /etc/keybr/env
```

Default `.env.example` uses SQLite and `http://localhost:3000/`.

Build, test, init DB, start:

```shell
npm run compile
npm run build-dev
env DATABASE_CLIENT=sqlite npm test   # optional sanity check
./packages/devenv/lib/initdb.ts
npm start
```

Open [http://localhost:3000/](http://localhost:3000/).

While developing, in a second terminal:

```shell
npm run watch
```

## Use Korean in the UI

1. Open **Practice** (main page).
2. Open keyboard / lesson settings.
3. **Language:** select **Korean** (or the localized name for `ko`).
4. **Layout:** select **`{KR} (두벌식)`** (id `ko-kr`).
5. **Emulate layout:** keep **enabled** (default for this layout).
   - Emulation maps physical keys via keybr’s layout tables and ignores the OS IME/layout for practice input.
   - That matters for Hangul: the OS would compose syllables (`내가`); this app expects **jamo keystroke sequence** (`ㄴㅐㄱㅏ`).
6. Optionally set geometry to **Korean 103** if you want the on-screen keyboard to match a KR physical layout.

Type the jamo shown. Do **not** rely on the system Hangul IME for practice text; use layout emulation and type as on a bare 2-set layout.

## How jamo practice works

Lessons show words as **decomposed compatibility jamo**, not composed Hangul syllables:

| You might expect | What keybr shows | Keys on 2-set |
| ---------------- | ---------------- | ------------- |
| 내가             | `ㄴㅐㄱㅏ`       | ㄴ → ㅐ → ㄱ → ㅏ |
| 있어             | `ㅇㅣㅆㅇㅓ`     | ㅇ → ㅣ → ㅆ → ㅇ → ㅓ |

**Why:**

- keybr tracks **per-key** accuracy and speed. Composed syllables hide which keys were pressed (complex vowels/finals are multi-key, e.g. `ㅘ` → `ㅗ`+`ㅏ`, `ㄳ` → `ㄱ`+`ㅅ`).
- The Korean alphabet in this fork is the set of **2-set jamo keys**, not syllable blocks (Unicode Hangul syllables `가–힣` are rejected; jamo sequences are accepted).
- Guided lessons unlock jamo the same way other languages unlock letters: start with frequent jamo, add more as you hit your target speed.

This is intentional training for **Dubeolsik touch typing**, not for reading composed Hangul in the practice stream.

## Deploy

### Docker (recommended)

`Dockerfile` and `docker-compose.yaml` are in the repo root.

- Image: Node 24, `npm ci` → `compile` + production `build`, then `npm run start-docker` (init DB + start).
- App listens on **port 3000** inside the container (do not change the internal port).

Minimal Compose (edit volume paths):

```yaml
services:
  keybr:
    build:
      dockerfile: ./Dockerfile
    volumes:
      - /path/to/data_dir:~/.local/state/keybr
      - /path/to/data_dir/.env:/etc/keybr/env
    ports:
      - 30044:3000
    restart: unless-stopped
```

```shell
# prepare host data + env
mkdir -p /path/to/data_dir
cp .env.example /path/to/data_dir/.env
# edit APP_URL / COOKIE_* for your public host

docker compose up -d --build
```

Or without Compose:

```shell
docker build -t keybr-ko .
docker run --rm -p 3000:3000 \
  -v /path/to/data_dir:/root/.local/state/keybr \
  -v /path/to/data_dir/.env:/etc/keybr/env \
  keybr-ko
```

### Bare metal (production-ish)

```shell
npm ci
npm run compile
npm run build
./packages/devenv/lib/initdb.ts   # first run
# then start with NODE_ENV=production, same entry as Docker:
node --enable-source-maps ./root/index.js
# or: npm run start-docker
```

Point reverse proxy at port 3000; set `APP_URL`, `COOKIE_DOMAIN`, `COOKIE_SECURE` in env for HTTPS.

## Relation to upstream

Upstream: [https://github.com/aradzie/keybr.com](https://github.com/aradzie/keybr.com)

- Prefer contributing Korean support **upstream** via PR when possible (language + layout + dictionary/model — see [docs/custom_language.md](./docs/custom_language.md) and [docs/custom_keyboard.md](./docs/custom_keyboard.md)).
- If a PR is rejected, delayed, or you need Korean immediately, **use this fork** as a runnable deployment.
- Rebase/cherry-pick against upstream regularly so you keep security and feature fixes.

This fork does not replace keybr.com; it is a compatible extension for Hangul 2-set practice.

## License

Same as upstream: **GNU Affero General Public License v3.0 (AGPL-3.0)**.

If you run a modified version as a network service, AGPL requires that you offer the corresponding source (including your modifications) to users of that service. See [LICENSE](./LICENSE).
