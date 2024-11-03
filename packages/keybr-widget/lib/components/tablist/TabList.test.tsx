import { test } from "node:test";
import { fireEvent, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { assert } from "chai";
import { useState } from "react";
import { Tab, TabList } from "./TabList.tsx";

test("props", () => {
  const r = render(
    <TabList selectedIndex={1}>
      <Tab label="Tab1">
        <div>aaa</div>
      </Tab>
      <Tab label="Tab2">
        <div>bbb</div>
      </Tab>
      <Tab label="Tab3">
        <div>ccc</div>
      </Tab>
    </TabList>,
  );

  assert.isNull(r.queryByText("aaa"));
  assert.isNotNull(r.queryByText("bbb"));
  assert.isNull(r.queryByText("ccc"));

  r.rerender(
    <TabList selectedIndex={0}>
      <Tab label="Tab1">
        <div>aaa</div>
      </Tab>
      <Tab label="Tab2">
        <div>bbb</div>
      </Tab>
      <Tab label="Tab3">
        <div>ccc</div>
      </Tab>
    </TabList>,
  );

  assert.isNotNull(r.queryByText("aaa"));
  assert.isNull(r.queryByText("bbb"));
  assert.isNull(r.queryByText("ccc"));

  r.unmount();
});

test("controlled", async () => {
  let lastValue = 0;

  function Controlled() {
    const [selectedIndex, setSelectedIndex] = useState(lastValue);
    return (
      <TabList
        selectedIndex={selectedIndex}
        onSelect={(selectedIndex) => {
          setSelectedIndex((lastValue = selectedIndex));
        }}
      >
        <Tab label="Tab1">
          <div>aaa</div>
        </Tab>
        <Tab label="Tab2">
          <div>bbb</div>
        </Tab>
        <Tab label="Tab3">
          <div>ccc</div>
        </Tab>
      </TabList>
    );
  }

  const r = render(<Controlled />);

  assert.isNotNull(r.queryByText("aaa"));
  assert.isNull(r.queryByText("bbb"));
  assert.isNull(r.queryByText("ccc"));
  assert.strictEqual(lastValue, 0);

  await userEvent.click(r.getByText("Tab2"));

  assert.isNull(r.queryByText("aaa"));
  assert.isNotNull(r.queryByText("bbb"));
  assert.isNull(r.queryByText("ccc"));
  assert.strictEqual(lastValue, 1);

  fireEvent.keyDown(r.getByText("Tab2"), { code: "ArrowRight" });

  assert.isNull(r.queryByText("aaa"));
  assert.isNull(r.queryByText("bbb"));
  assert.isNotNull(r.queryByText("ccc"));
  assert.strictEqual(lastValue, 2);

  fireEvent.keyDown(r.getByText("Tab3"), { code: "ArrowRight" });

  assert.isNotNull(r.queryByText("aaa"));
  assert.isNull(r.queryByText("bbb"));
  assert.isNull(r.queryByText("ccc"));
  assert.strictEqual(lastValue, 0);

  r.unmount();
});
