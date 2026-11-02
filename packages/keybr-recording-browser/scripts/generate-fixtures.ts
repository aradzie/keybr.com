import { readFile, writeFile } from "node:fs/promises";
import { replayScenario, type Scenario } from "../lib/testing.ts";

const file = new URL("../../keybr-recording/fixtures/v1.json", import.meta.url);
const fixtures = JSON.parse(await readFile(file, "utf8"));
for (const fixture of fixtures.scenarios)
  fixture.expected = replayScenario(fixture);
await writeFile(file, JSON.stringify(fixtures, null, 2) + "\n");
