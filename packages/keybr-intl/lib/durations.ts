import { type IntlShape, useIntl } from "react-intl";
import { intlMemo } from "./memo.ts";

export type Duration = {
  readonly seconds?: number;
  readonly minutes?: number;
  readonly hours?: number;
};

export type IntlDurations = {
  formatDuration(duration: Duration): string;
  /**
   * Formats time duration as a string of hours, minutes and seconds
   * in the human-readable form.
   * @param seconds Time duration in seconds.
   * @return {string} Formatted time duration.
   */
  humanizeDuration(seconds: number): string;
};

const factory = (intl: IntlShape): IntlDurations => {
  const formatDuration = (duration: Duration): string => {
    const { seconds = 0, minutes = 0, hours = 0 } = duration;
    const parts = [];
    if (hours > 0) {
      parts.push(
        intl.formatNumber(hours, {
          style: "unit",
          unit: "hour",
          unitDisplay: "long",
        }),
      );
    }
    if (minutes > 0) {
      parts.push(
        intl.formatNumber(minutes, {
          style: "unit",
          unit: "minute",
          unitDisplay: "long",
        }),
      );
    }
    if (seconds > 0) {
      parts.push(
        intl.formatNumber(seconds, {
          style: "unit",
          unit: "second",
          unitDisplay: "long",
        }),
      );
    }
    return intl.formatList(parts, {
      style: "long",
      type: "conjunction",
    });
  };
  const humanizeDuration = (duration: number): string => {
    if (duration < 1) {
      return intl.formatNumber(0, {
        style: "unit",
        unit: "second",
        unitDisplay: "long",
      });
    }
    const hours = Math.floor(duration / 3600);
    duration = duration - hours * 3600;
    const minutes = Math.floor(duration / 60);
    duration = duration - minutes * 60;
    const seconds = Math.floor(duration);
    return formatDuration({ hours, minutes, seconds });
  };
  return {
    formatDuration,
    humanizeDuration,
  };
};

export const makeIntlDurations = intlMemo(Symbol("durations"), factory);

export const useIntlDurations = (): IntlDurations => {
  return makeIntlDurations(useIntl());
};
