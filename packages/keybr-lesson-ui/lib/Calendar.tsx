import { Tasks } from "@keybr/lang";
import { type DailyStats, type DailyStatsMap, LocalDate } from "@keybr/result";
import { Popup, Portal } from "@keybr/widget";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import * as styles from "./Calendar.module.less";
import { DailyStats as DailyStatsWidget } from "./DailyStats.tsx";
import { type Effort } from "./effort.ts";

export function Calendar({
  dailyStatsMap,
  effort,
}: {
  dailyStatsMap: DailyStatsMap;
  effort: Effort;
}) {
  type State = Readonly<
    | { type: "hidden" }
    | { type: "visible-in"; stats: DailyStats; elem: Element }
    | { type: "visible"; stats: DailyStats; elem: Element }
    | { type: "visible-out"; stats: DailyStats; elem: Element }
  >;
  const [state, setState] = useState<State>({ type: "hidden" });
  useEffect(() => {
    const tasks = new Tasks();
    switch (state.type) {
      case "visible-in":
        tasks.delayed(300, () => {
          setState({ ...state, type: "visible" });
        });
        break;
      case "visible-out":
        tasks.delayed(300, () => {
          setState({ type: "hidden" });
        });
        break;
    }
    return () => {
      tasks.cancelAll();
    };
  }, [state]);
  return (
    <>
      <BlockList
        dailyStatsMap={dailyStatsMap}
        effort={effort}
        onCellHoverIn={(stats, elem) => {
          setState({ type: "visible-in", stats, elem });
        }}
        onCellHoverOut={() => {
          switch (state.type) {
            case "visible-in":
              setState({ type: "hidden" });
              break;
            case "visible":
              setState({ ...state, type: "visible-out" });
              break;
          }
        }}
      />
      {(state.type === "visible" || state.type === "visible-out") && (
        <Portal>
          <Popup
            anchor={state.elem}
            onMouseEnter={() => {
              setState({ ...state, type: "visible" });
            }}
            onMouseLeave={() => {
              setState({ ...state, type: "visible-out" });
            }}
          >
            <DailyStatsWidget stats={state.stats} effort={effort} />
          </Popup>
        </Portal>
      )}
    </>
  );
}

function BlockList({
  dailyStatsMap,
  effort,
  onCellHoverIn,
  onCellHoverOut,
  onCellClick,
}: {
  dailyStatsMap: DailyStatsMap;
  effort: Effort;
  onCellHoverIn?: (stats: DailyStats, elem: Element) => void;
  onCellHoverOut?: (stats: DailyStats, elem: Element) => void;
  onCellClick?: (stats: DailyStats, elem: Element) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const blocks = useMemo(() => blockList(dailyStatsMap), [dailyStatsMap]);
  return (
    <div
      ref={ref}
      className={styles.root}
      onMouseOver={(event) => {
        relayEvent(ref.current!, event, onCellHoverIn);
      }}
      onMouseOut={(event) => {
        relayEvent(ref.current!, event, onCellHoverOut);
      }}
      onClick={(event) => {
        relayEvent(ref.current!, event, onCellClick);
      }}
    >
      {blocks.map((block) => (
        <Block key={block.key} block={block} effort={effort} />
      ))}
    </div>
  );
}

function relayEvent(
  root: Element,
  { target }: { target: any },
  handler?: (stats: DailyStats, elem: Element) => void,
) {
  while (
    handler != null &&
    target instanceof Element &&
    root.contains(target)
  ) {
    const stats = Cell.attached(target);
    if (stats) {
      handler(stats, target);
      return;
    }
    target = target.parentElement;
  }
}

type BlockCells = {
  key: string;
  year: number;
  month: number;
  cells: (DailyStats | null)[][];
};

function Block({ block, effort }: { block: BlockCells; effort: Effort }) {
  const { formatMessage } = useIntl();

  const weekDayName = formatMessage({
    id: "calendar.weekDayName",
    defaultMessage: "M|T|W|T|F|S|S",
  }).split("|");

  return (
    <div className={styles.calendar}>
      <table className={styles.table}>
        <caption className={styles.caption}>
          {block.year}/{block.month}
        </caption>
        <thead>
          <tr>
            <th className={styles.headerCell}>{weekDayName[0]}</th>
            <th className={styles.headerCell}>{weekDayName[1]}</th>
            <th className={styles.headerCell}>{weekDayName[2]}</th>
            <th className={styles.headerCell}>{weekDayName[3]}</th>
            <th className={styles.headerCell}>{weekDayName[4]}</th>
            <th className={styles.headerCell}>{weekDayName[5]}</th>
            <th className={styles.headerCell}>{weekDayName[6]}</th>
          </tr>
        </thead>
        <tbody>
          {block.cells.map((row, m) => (
            <tr key={m}>
              {row.map((cell, n) => (
                <Cell key={n} cell={cell} effort={effort} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ cell, effort }: { cell: DailyStats | null; effort: Effort }) {
  if (cell == null) {
    return <td />;
  }
  const { results, stats } = cell;
  if (results.length === 0) {
    return (
      <td className={styles.cell}>
        <span className={styles.item}>{cell.date.dayOfMonth}</span>
      </td>
    );
  }
  return (
    <td className={styles.cell}>
      <span
        ref={Cell.attach(cell)}
        className={styles.item}
        style={{
          backgroundColor: String(effort.shade(effort.effort(stats.time))),
        }}
        data-date={String(cell.date)}
      >
        {cell.date.dayOfMonth}
      </span>
    </td>
  );
}

const attachment = Symbol();

Cell.attach = (stats: DailyStats) => {
  return (target: Element | null): void => {
    if (target != null) {
      (target as any)[attachment] = stats;
    }
  };
};

Cell.attached = (target: Element | null): DailyStats | null => {
  return (target as any)?.[attachment] ?? null;
};

function blockList(map: DailyStatsMap): BlockCells[] {
  const blocks = new Map<string, BlockCells>();
  for (const { date } of map) {
    addBlock(date);
  }
  addBlock(map.today.date);
  return [...blocks.values()];

  function addBlock({ year, month }: LocalDate) {
    const key = `${year}:${month}`;
    let block = blocks.get(key);
    if (block == null) {
      const cells: (DailyStats | null)[][] = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ];
      const a = new LocalDate(year, month, 1);
      const offset = a.dayOfWeek - 1;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
          const b = a.plusDays(i * 7 + j - offset);
          if (a.month === b.month) {
            cells[i][j] = map.get(b);
          }
        }
      }
      blocks.set(key, (block = { key, year, month, cells }));
    }
    return block;
  }
}
