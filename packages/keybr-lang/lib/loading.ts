export type LoadingEvent = {
  readonly total: number;
  readonly current: number;
};

export type LoadingEventListener = (event: LoadingEvent) => void;
