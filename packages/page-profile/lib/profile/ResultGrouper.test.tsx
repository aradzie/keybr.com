import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { keyboardProps, Layout, useKeyboard } from "@keybr/keyboard";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import {
  FakeResultContext,
  type KeyStatsMap,
  ResultFaker,
  useResults,
} from "@keybr/result";
import { FakeSettingsContext, Settings } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import { equal } from "rich-assert";
import { ResultGrouper } from "./ResultGrouper.tsx";

const faker = new ResultFaker();

test("empty database", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext
        initialSettings={new Settings().set(
          keyboardProps.layout,
          Layout.EN_DVORAK,
        )}
      >
        <FakeResultContext>
          <ResultGrouper>
            {(keyStatsMap) => <TestChild keyStatsMap={keyStatsMap} />}
          </ResultGrouper>
        </FakeResultContext>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  equal((await r.findByTitle("layout")).textContent, "en-dvorak");

  r.unmount();
});

test("select default layout", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext
        initialSettings={new Settings().set(
          keyboardProps.layout,
          Layout.EN_DVORAK,
        )}
      >
        <FakeResultContext
          initialResults={[faker.nextResult({ layout: Layout.EN_COLEMAK })]}
        >
          <ResultGrouper>
            {(keyStatsMap) => <TestChild keyStatsMap={keyStatsMap} />}
          </ResultGrouper>
        </FakeResultContext>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  equal((await r.findByTitle("layout")).textContent, "en-colemak");

  fireEvent.click(await r.findByTitle("clear"));

  equal((await r.findByTitle("layout")).textContent, "en-dvorak");

  r.unmount();
});

test("select text type", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext
        initialSettings={new Settings().set(keyboardProps.layout, Layout.EN_US)}
      >
        <FakeResultContext
          initialResults={[faker.nextResult({ layout: Layout.EN_US })]}
        >
          <ResultGrouper>
            {(keyStatsMap) => <TestChild keyStatsMap={keyStatsMap} />}
          </ResultGrouper>
        </FakeResultContext>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  fireEvent.click(await r.findByText("Letters"));

  equal((await r.findByTitle("alphabet")).textContent, "ABCDEFGHIJ");

  fireEvent.click(await r.findByText("Digits"));

  equal((await r.findByTitle("alphabet")).textContent, "0123456789");

  r.unmount();
});

function TestChild({ keyStatsMap }: { keyStatsMap: KeyStatsMap }) {
  const { layout } = useKeyboard();
  const { clearResults } = useResults();
  return (
    <div>
      <div title="layout">{layout.id}</div>
      <div title="alphabet">{keyStatsMap.letters.map(String).join("")}</div>
      <button
        title="clear"
        onClick={() => {
          clearResults();
        }}
      >
        clear
      </button>
    </div>
  );
}
