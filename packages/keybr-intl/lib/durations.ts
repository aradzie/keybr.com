import { type IntlShape, useIntl } from "react-intl";

export type Duration = {
  readonly seconds?: number;
  readonly minutes?: number;
  readonly hours?: number;
};

export type IntlDurations = {
  formatDuration: (duration: Duration) => string;
  /**
   * Formats time duration as a string of hours, minutes and seconds
   * in the human-readable form.
   * @param seconds Time duration in seconds.
   * @return {string} Formatted time duration.
   */
  humanizeDuration: (seconds: number) => string;
};

const kIntlDurations = Symbol("kIntlDurations");

export const makeIntlDurations = (intl: IntlShape): IntlDurations => {
  let r = (intl as any)[kIntlDurations] as IntlDurations;
  if (r == null) {
    const formatDuration = (duration: Duration): string => {
      const { seconds = 0, minutes = 0, hours = 0 } = duration;
      const parts = [];
      if (hours > 1) {
        parts.push(`${hours} hours`);
      } else if (hours > 0) {
        parts.push(`one hour`);
      }
      if (minutes > 1) {
        parts.push(`${minutes} minutes`);
      } else if (minutes > 0) {
        parts.push(`one minute`);
      }
      if (seconds > 1) {
        parts.push(`${seconds} seconds`);
      } else if (seconds > 0) {
        parts.push(`one second`);
      }
      let result = "";
      let index = 0;
      for (const part of parts) {
        if (index > 0) {
          if (index + 1 === parts.length) {
            result += " and ";
          } else {
            result += " ";
          }
        }
        result += part;
        index += 1;
      }
      return result;
    };
    const humanizeDuration = (duration: number): string => {
      if (duration < 1) {
        return "zero seconds";
      }
      const hours = Math.floor(duration / 3600);
      duration = duration - hours * 3600;
      const minutes = Math.floor(duration / 60);
      duration = duration - minutes * 60;
      const seconds = Math.floor(duration);
      return formatDuration({ hours, minutes, seconds });
    };
    (intl as any)[kIntlDurations] = r = {
      formatDuration,
      humanizeDuration,
    } satisfies IntlDurations;
  }
  return r;
};

export const useIntlDurations = (): IntlDurations => {
  return makeIntlDurations(useIntl());
};
