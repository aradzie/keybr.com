import { test } from "node:test";
import { fakeAdapter, Recorder } from "@fastr/fetch";
import { ResultFaker, useResults } from "@keybr/result";
import { formatFile } from "@keybr/result-io";
import { render, waitFor } from "@testing-library/react";
import { equal } from "rich-assert";
import { PublicResultLoader } from "./PublicResultLoader.tsx";

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
  fakeAdapter.on.GET("/_/sync/data/abc").replyWith(
    formatFile(faker.nextResultList(3)),
    {
      status: 200,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Act.

  const r = render(
    <PublicResultLoader
      user={{
        id: "abc",
        name: "somebody",
        imageUrl: null,
        premium: false,
      }}
    >
      <TestClient />
    </PublicResultLoader>,
  );

  await waitFor(() => r.getByTitle("count"));

  // Assert.

  equal(recorder.requestCount, 1);
  equal(r.getByTitle("count").textContent, "3");

  // Cleanup.

  r.unmount();
});

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
