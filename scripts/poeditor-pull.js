import { join } from "node:path";
import { config } from "dotenv";
import { readJsonSync, writeJsonSync } from "./lib/fs-json.js";
import { translationsPath } from "./lib/intl-io.js";
import { allLocales, defaultLocale } from "./locale.js";
import { rootDir } from "./root.js";

config({ path: join(rootDir, ".env") });

for (const locale of allLocales) {
  if (locale === defaultLocale) {
    continue;
  }
  await pullTranslations(locale);
}

async function pullTranslations(locale) {
  const defaultTranslationsFile = translationsPath(defaultLocale);
  const defaultTranslations = readJsonSync(defaultTranslationsFile);
  const translationsFile = translationsPath(locale);
  const translations = await downloadTranslations(locale);
  for (const [id] of Object.entries(translations)) {
    if (!(id in defaultTranslations)) {
      console.warn(`Extra term [${id}]`);
    }
  }
  writeJsonSync(
    translationsFile,
    remap(defaultTranslations, ([id, message]) => [
      id,
      translations[id] &&
      translations[id] !== id &&
      translations[id] !== message
        ? translations[id]
        : undefined,
    ]),
  );
}

async function downloadTranslations(locale) {
  console.log(`Downloading translations ${locale}`);
  if (locale === "pt-pt") {
    locale = "pt";
  }
  const body = new FormData();
  body.append("api_token", process.env["POEDITOR_TOKEN"]);
  body.append("id", process.env["POEDITOR_PROJECT"]);
  body.append("language", locale);
  body.append("type", "key_value_json");
  body.append("filters", "translated");
  const res = await fetch("https://api.poeditor.com/v2/projects/export", {
    method: "POST",
    body: body,
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await fetchJson((await res.json()).result.url);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json();
}

function remap(entries, callback) {
  return Object.fromEntries(Object.entries(entries).map(callback));
}
