import { useIntlNumbers } from "@keybr/intl";
import { type DateStats, LocalDate, type ResultSummary } from "@keybr/result";
import { formatDuration } from "@keybr/widget";
import { useIntl } from "react-intl";
import * as styles from "./Calendar.module.less";
import { type Effort } from "./effort.ts";
import { useFormatter } from "./format.ts";

export function Calendar({
  summary,
  effort,
}: {
  readonly summary: ResultSummary;
  readonly effort: Effort;
}) {
  return (
    <div className={styles.root}>
      {blockList(summary).map((block, index) => (
        <Block key={index} block={block} effort={effort} />
      ))}
    </div>
  );
}

type BlockCells = {
  readonly year: number;
  readonly month: number;
  readonly cells: (DateStats | null)[][];
};

function Block({
  block,
  effort,
}: {
  readonly block: BlockCells;
  readonly effort: Effort;
}) {
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

function Cell({
  cell,
  effort,
}: {
  readonly cell: DateStats | null;
  readonly effort: Effort;
}) {
  const { formatMessage } = useIntl();
  const { formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();
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
  const effortValue = effort.effort(stats.time);
  const title = [
    formatMessage(
      {
        id: "profile.calendar.dailyGoal.description",
        defaultMessage: "Daily goal: {value}",
      },
      { value: formatPercents(effortValue) },
    ),
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
    <td className={styles.cell}>
      <span
        className={styles.item}
        style={{
          backgroundColor: String(effort.shade(effortValue)),
        }}
        data-date={String(cell.date)}
        title={title}
      >
        {cell.date.dayOfMonth}
      </span>
    </td>
  );
}

function blockList(summary: ResultSummary): BlockCells[] {
  const blocks = new Map<string, BlockCells>();
  for (const { date } of summary) {
    addBlock(date);
  }
  addBlock(summary.todayStats.date);
  return [...blocks.values()];

  function addBlock({ year, month }: { year: number; month: number }) {
    const key = `${year}:${month}`;
    let block = blocks.get(key);
    if (block == null) {
      blocks.set(key, (block = makeBlock({ year, month })));
    }
    return block;
  }

  function makeBlock({ year, month }: { year: number; month: number }) {
    const cells: (DateStats | null)[][] = [
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
          cells[i][j] = summary.get(b);
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
