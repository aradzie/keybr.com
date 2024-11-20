import { test } from "node:test";
import { fireEvent, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { equal, isNotNull, isNull } from "rich-assert";
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

  isNull(r.queryByText("aaa"));
  isNotNull(r.queryByText("bbb"));
  isNull(r.queryByText("ccc"));

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

  isNotNull(r.queryByText("aaa"));
  isNull(r.queryByText("bbb"));
  isNull(r.queryByText("ccc"));

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

  isNotNull(r.queryByText("aaa"));
  isNull(r.queryByText("bbb"));
  isNull(r.queryByText("ccc"));
  equal(lastValue, 0);

  await userEvent.click(r.getByText("Tab2"));

  isNull(r.queryByText("aaa"));
  isNotNull(r.queryByText("bbb"));
  isNull(r.queryByText("ccc"));
  equal(lastValue, 1);

  fireEvent.keyDown(r.getByText("Tab2"), { code: "ArrowRight" });

  isNull(r.queryByText("aaa"));
  isNull(r.queryByText("bbb"));
  isNotNull(r.queryByText("ccc"));
  equal(lastValue, 2);

  fireEvent.keyDown(r.getByText("Tab3"), { code: "ArrowRight" });

  isNotNull(r.queryByText("aaa"));
  isNull(r.queryByText("bbb"));
  isNull(r.queryByText("ccc"));
  equal(lastValue, 0);

  r.unmount();
});
