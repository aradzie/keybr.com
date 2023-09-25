export class FakeAnimation implements Animation {
  id = "fake";
  effect = null;
  pending = false;
  readonly playState = "running" as const;
  readonly replaceState = "active" as const;
  readonly ready = Promise.resolve(this);
  readonly finished = Promise.resolve(this);
  playbackRate = 1;
  startTime = null;
  currentTime = null;
  timeline = null;

  play(): void {}

  pause(): void {}

  reverse(): void {}

  finish(): void {}

  cancel(): void {}

  persist(): void {}

  commitStyles(): void {}

  updatePlaybackRate(): void {}

  addEventListener(): void {}

  removeEventListener(): void {}

  dispatchEvent(event: Event): boolean {
    return false;
  }

  oncancel(ev: AnimationPlaybackEvent): void {}
  onfinish(ev: AnimationPlaybackEvent): void {}
  onremove(ev: Event): void {}
}
