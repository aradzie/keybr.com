import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { type ReactNode, useState } from "react";
import { Tab, TabList } from "./TabList.tsx";

test.serial("props", (t) => {
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

  t.is(r.queryByText("aaa"), null);
  t.not(r.queryByText("bbb"), null);
  t.is(r.queryByText("ccc"), null);

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

  t.not(r.queryByText("aaa"), null);
  t.is(r.queryByText("bbb"), null);
  t.is(r.queryByText("ccc"), null);

  r.unmount();
});

test.serial("controlled", async (t) => {
  let lastValue = 0;

  function Controlled(): ReactNode {
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

  t.not(r.queryByText("aaa"), null);
  t.is(r.queryByText("bbb"), null);
  t.is(r.queryByText("ccc"), null);
  t.is(lastValue, 0);

  await userEvent.click(r.getByText("Tab2"));

  t.is(r.queryByText("aaa"), null);
  t.not(r.queryByText("bbb"), null);
  t.is(r.queryByText("ccc"), null);
  t.is(lastValue, 1);

  fireEvent.keyDown(r.getByText("Tab2"), { code: "ArrowRight" });

  t.is(r.queryByText("aaa"), null);
  t.is(r.queryByText("bbb"), null);
  t.not(r.queryByText("ccc"), null);
  t.is(lastValue, 2);

  fireEvent.keyDown(r.getByText("Tab3"), { code: "ArrowRight" });

  t.not(r.queryByText("aaa"), null);
  t.is(r.queryByText("bbb"), null);
  t.is(r.queryByText("ccc"), null);
  t.is(lastValue, 0);

  r.unmount();
});
