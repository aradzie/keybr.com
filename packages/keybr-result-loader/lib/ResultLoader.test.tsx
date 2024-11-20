import { test } from "node:test";
import { fakeAdapter, Recorder } from "@fastr/fetch";
import { type PageData, PageDataContext } from "@keybr/pages-shared";
import { ResultFaker, useResults } from "@keybr/result";
import { formatFile } from "@keybr/result-io";
import { act, render, waitFor } from "@testing-library/react";
import { equal } from "rich-assert";
import { ResultLoader } from "./ResultLoader.tsx";

const faker = new ResultFaker();

test.beforeEach(() => {
  fakeAdapter.reset();
});

test.afterEach(() => {
  fakeAdapter.reset();
});

test("load results", async () => {
  // Arrange.

  const recorder = new Recorder();
  fakeAdapter.on.GET("/_/sync/data").replyWith(
    formatFile(faker.nextResultList(3)),
    {
      status: 200,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Act.

  const r = render(
    <ResultLoader>
      <TestClient />
    </ResultLoader>,
    { wrapper: AnonymousUser },
  );

  await waitFor(() => r.getByTitle("count"));

  // Assert.

  equal(recorder.requestCount, 0);
  equal(r.getByTitle("count").textContent, "0");

  // Act.

  r.getByTitle("append").click();
  await act(async () => {
    await waitFor(() => r.getByTitle("count"));
  });

  // Assert.

  equal(recorder.requestCount, 0);
  equal(r.getByTitle("count").textContent, "1");

  // Act.

  r.getByTitle("clear").click();
  await act(async () => {
    await waitFor(() => r.getByTitle("count"));
  });

  // Assert.

  equal(recorder.requestCount, 0);
  equal(r.getByTitle("count").textContent, "0");

  // Cleanup.

  r.unmount();
});

function AnonymousUser({ children }: { children: any }) {
  return (
    <PageDataContext.Provider value={{ publicUser: { id: null } } as PageData}>
      {children}
    </PageDataContext.Provider>
  );
}

function NamedUser({ children }: { children: any }) {
  return (
    <PageDataContext.Provider value={{ publicUser: { id: "abc" } } as PageData}>
      {children}
    </PageDataContext.Provider>
  );
}

function TestClient() {
  const { results, appendResults, clearResults } = useResults();
  return (
    <div>
      <p>
        <span title="count">{results.length}</span>
      </p>
      <p>
        <button
          title="append"
          onClick={() => {
            appendResults(faker.nextResultList(1));
          }}
        >
          append
        </button>
      </p>
      <p>
        <button
          title="clear"
          onClick={() => {
            clearResults();
          }}
        >
          clear
        </button>
      </p>
    </div>
  );
}
