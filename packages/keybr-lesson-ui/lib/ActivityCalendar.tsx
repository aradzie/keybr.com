import { Tasks } from "@keybr/lang";
import type { DailyStats, DailyStatsMap, LocalDate } from "@keybr/result";
import { Popup, Portal } from "@keybr/widget";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import * as styles from "./ActivityCalendar.module.less";
import { DailyStats as DailyStatsWidget } from "./DailyStats.tsx";
import { type Effort } from "./effort.ts";

export function ActivityCalendar({
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
      <WeekList
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

function WeekList({
  dailyStatsMap,
  effort,
  onCellHoverIn,
  onCellHoverOut,
}: {
  dailyStatsMap: DailyStatsMap;
  effort: Effort;
  onCellHoverIn?: (stats: DailyStats, elem: Element) => void;
  onCellHoverOut?: (stats: DailyStats, elem: Element) => void;
}) {
  const { formatDate, formatMessage } = useIntl();
  const ref = useRef<HTMLDivElement>(null);
  const weeks = useMemo(() => weekDays(dailyStatsMap), [dailyStatsMap]);
  const months = useMemo(() => monthRanges(weeks), [weeks]);
  const weekDayNames = formatMessage({
    id: "weekDayNames",
    defaultMessage: "M|T|W|T|F|S|S",
  }).split("|");
  return (
    <div className={styles.root}>
      <div
        className={styles.months}
        style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}
      >
        {months.map(({ key, start, span }) => (
          <span
            key={key}
            className={styles.month}
            style={{ gridColumn: `${start + 1} / span ${span}` }}
          >
            {formatDate(Number(weeks[start][0]), { month: "short" })}
          </span>
        ))}
      </div>
      <div className={styles.body}>
        <div className={styles.days}>
          {weekDayNames.map((name, index) => (
            <span key={index} className={styles.day}>
              {index % 2 === 0 ? name : ""}
            </span>
          ))}
        </div>
        <div
          ref={ref}
          className={styles.grid}
          onMouseOver={(event) => {
            relayEvent(ref.current!, event, onCellHoverIn);
          }}
          onMouseOut={(event) => {
            relayEvent(ref.current!, event, onCellHoverOut);
          }}
        >
          {weeks.map((week) =>
            week.map((date) => (
              <Cell
                key={String(date)}
                cell={dailyStatsMap.get(date)}
                effort={effort}
              />
            )),
          )}
        </div>
      </div>
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

type MonthRange = {
  key: string;
  start: number;
  span: number;
};

function Cell({ cell, effort }: { cell: DailyStats; effort: Effort }) {
  const { results, stats } = cell;
  if (results.length === 0) {
    return <span className={styles.cell} data-date={String(cell.date)} />;
  }
  return (
    <span
      ref={Cell.attach(cell)}
      className={styles.cell}
      style={{
        backgroundColor: String(effort.shade(effort.effort(stats.time))),
      }}
      data-date={String(cell.date)}
    />
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

function weekDays(map: DailyStatsMap): LocalDate[][] {
  const today = map.today.date;
  const start = today.minusDays(today.dayOfWeek - 1);
  const weeks: LocalDate[][] = [];
  for (let w = 52; w >= 0; w--) {
    const days: LocalDate[] = [];
    for (let d = 0; d < 7; d++) {
      days.push(start.minusDays(w * 7 - d));
    }
    weeks.push(days);
  }
  return weeks;
}

function monthRanges(weeks: LocalDate[][]): MonthRange[] {
  const months: MonthRange[] = [];
  let start = 0;
  for (let i = 1; i <= weeks.length; i++) {
    if (i === weeks.length || weeks[i][0].month !== weeks[start][0].month) {
      months.push({
        key: `${weeks[start][0].month}:${start}`,
        start,
        span: i - start,
      });
      start = i;
    }
  }
  return months;
}
