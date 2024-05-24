export type LoadingEvent = {
  readonly total: number;
  readonly current: number;
};

export type LoadingListener = (event: LoadingEvent) => void;
