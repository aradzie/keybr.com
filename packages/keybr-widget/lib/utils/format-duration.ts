/**
 * Formats time duration as a string of hours, minutes and seconds.
 * @param millis Time duration in milliseconds.
 * @return {string} Formatted time duration.
 */
export const formatDuration = (
  millis: number,
  { showMillis = false }: { readonly showMillis?: boolean } = {},
): string => {
  const pad = (v: number) => (v < 10 ? `0${v}` : `${v}`);
  const hours = Math.floor(millis / 3_600_000);
  millis = millis - hours * 3_600_000;
  const minutes = Math.floor(millis / 60_000);
  millis = millis - minutes * 60_000;
  const seconds = Math.floor(millis / 1000);
  millis = millis - seconds * 1_000;
  if (showMillis) {
    const frac = Math.floor(millis / 10);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(frac)}`;
  } else {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
};
