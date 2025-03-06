import { useIntlNumbers } from "@keybr/intl";
import { type Result } from "@keybr/result";
import { formatDuration, Name, NameValue, Para, Value } from "@keybr/widget";
import { FormattedMessage, useIntl } from "react-intl";
import { useState } from "react";
import * as styles from "./PassageComplete.module.less";

export function PassageComplete({
  results,
  onReset,
}: {
  results: Result[];
  onReset: () => void;
}) {
  const { formatDate, formatMessage } = useIntl();
  const { formatNumber, formatPercents } = useIntlNumbers();
  const [showStats, setShowStats] = useState(false);

  const handleExport = () => {
    Result.exportToScreen(results);
  };

  const handleReset = () => {
    onReset();
  };

  const totalStats = results.reduce(
    (acc, result) => {
      acc.time += result.time;
      acc.length += result.length;
      acc.errors += result.errors;
      acc.speed += result.speed;
      return acc;
    },
    { time: 0, length: 0, errors: 0, speed: 0 }
  );

  const averageSpeed = totalStats.speed / results.length;
  const accuracy = (totalStats.length - totalStats.errors) / totalStats.length;

  return (
    <div className={styles.root}>
      <Para align="center">
        <FormattedMessage
          id="passage.complete.message"
          defaultMessage="Passage complete"
        />
      </Para>
      <button onClick={() => setShowStats(!showStats)}>
        <FormattedMessage
          id="passage.complete.showStatsButton.label"
          defaultMessage="Show Stats"
        />
      </button>
      {showStats && (
        <div>
          <div>
            <Name>
              <FormattedMessage
                id="passage.complete.totalTime.description"
                defaultMessage="Total time: {value}"
                values={{
                  value: <Value>{formatDuration(totalStats.time)}</Value>,
                }}
              />
            </Name>
          </div>
          <div>
            <Name>
              <FormattedMessage
                id="passage.complete.totalLength.description"
                defaultMessage="Total length: {value}"
                values={{
                  value: <Value>{formatNumber(totalStats.length)}</Value>,
                }}
              />
            </Name>
          </div>
          <div>
            <Name>
              <FormattedMessage
                id="passage.complete.totalErrors.description"
                defaultMessage="Total errors: {value}"
                values={{
                  value: <Value>{formatNumber(totalStats.errors)}</Value>,
                }}
              />
            </Name>
          </div>
          <div>
            <NameValue
              name={formatMessage({
                id: "passage.complete.averageSpeed.name",
                defaultMessage: "Average speed",
              })}
              value={formatNumber(averageSpeed)}
            />
          </div>
          <div>
            <NameValue
              name={formatMessage({
                id: "passage.complete.accuracy.name",
                defaultMessage: "Accuracy",
              })}
              value={formatPercents(accuracy)}
            />
          </div>
        </div>
      )}
      <button onClick={handleExport}>
        <FormattedMessage
          id="passage.complete.exportButton.label"
          defaultMessage="Export Data"
        />
      </button>
      <button onClick={handleReset}>
        <FormattedMessage
          id="passage.complete.resetButton.label"
          defaultMessage="Reset"
        />
      </button>
    </div>
  );
}
