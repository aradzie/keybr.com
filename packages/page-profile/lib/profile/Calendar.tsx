import { useFormatter } from "@keybr/lesson-ui";
import { LocalDate, makeSummaryStats, type Result } from "@keybr/result";
import { formatDuration } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import * as styles from "./Calendar.module.less";
import { type ResultSummary } from "./resultsummary.ts";

export function Calendar({
  summary,
}: {
  readonly summary: ResultSummary;
}): ReactNode {
  return (
    <div className={styles.wrapper}>
      {blockList(summary).map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

type BlockData = {
  readonly year: number;
  readonly month: number;
  readonly cells: (CellData | null)[][];
};

function Block({ block }: { readonly block: BlockData }): ReactNode {
  const { formatMessage } = useIntl();

  const weekDayName = formatMessage({
    id: "calendar.weekDayName",
    defaultMessage: "M|T|W|T|F|S|S",
  }).split("|");

  return (
    <div className={styles.calendar}>
      <table className={styles.table}>
        <caption className={styles.caption}>
          {block.year + "/" + block.month}
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
                <Cell key={n} cell={cell} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type CellData = {
  readonly date: LocalDate;
  readonly results: readonly Result[];
};

function Cell({ cell }: { readonly cell: CellData | null }): ReactNode {
  const { formatMessage } = useIntl();
  const { formatSpeed } = useFormatter();
  if (cell == null) {
    return <td className={styles.cell} />;
  }
  const { results } = cell;
  if (results.length === 0) {
    return (
      <td className={clsx(styles.cell, styles.cell_z)}>
        {cell.date.dayOfMonth}
      </td>
    );
  }
  const stats = makeSummaryStats(results);
  const classList: string[] = [];
  if (stats.time > 30 * 60 * 1000) {
    classList.push(styles.cell_s3);
  } else if (stats.time > 20 * 60 * 1000) {
    classList.push(styles.cell_s2);
  } else if (stats.time > 10 * 60 * 1000) {
    classList.push(styles.cell_s1);
  } else if (stats.time > 0) {
    classList.push(styles.cell_s0);
  } else {
    classList.push(styles.cell_z);
  }
  const title = [
    formatMessage(
      {
        id: "profile.calendar.totalTime.description",
        defaultMessage: "Time of lessons: {value}",
      },
      { value: formatDuration(stats.time) },
    ),
    formatMessage(
      {
        id: "profile.calendar.totalLessons.description",
        defaultMessage: "Number of lessons: {value}",
      },
      { value: results.length },
    ),
    formatMessage(
      {
        id: "profile.calendar.topSpeed.description",
        defaultMessage: "Top speed: {value}",
      },
      { value: formatSpeed(stats.speed.max) },
    ),
    formatMessage(
      {
        id: "profile.calendar.averageSpeed.description",
        defaultMessage: "Average speed: {value}",
      },
      { value: formatSpeed(stats.speed.avg) },
    ),
  ].join(",\n");
  return (
    <td className={clsx(styles.cell, classList)} title={title}>
      {cell.date.dayOfMonth}
    </td>
  );
}

function blockList(summary: ResultSummary): BlockData[] {
  const cellMap = new Map<string, CellData>();
  for (const { date, results } of summary) {
    cellMap.set(String(date), { date, results });
  }
  const blockMap = new Map<string, BlockData>();
  for (const { date } of summary) {
    addBlock(date);
  }
  addBlock(summary.todayStats.date);
  return [...blockMap.values()];

  function addBlock({
    year,
    month,
  }: {
    year: number;
    month: number;
  }): BlockData {
    const key = `${year}:${month}`;
    let block = blockMap.get(key);
    if (block == null) {
      blockMap.set(key, (block = makeBlock({ year, month })));
    }
    return block;
  }

  function makeBlock({
    year,
    month,
  }: {
    year: number;
    month: number;
  }): BlockData {
    const cells: (CellData | null)[][] = [
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
          cells[i][j] = cellMap.get(String(b)) ?? { date: b, results: [] };
        }
      }
    }

    return {
      year,
      month,
      cells,
    };
  }
}
