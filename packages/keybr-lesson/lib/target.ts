import { speedToTime } from "@keybr/result";

export class Target {
  readonly timeToType: number;

  constructor({ targetSpeed }: { readonly targetSpeed: number }) {
    this.timeToType = speedToTime(targetSpeed);
  }

  confidence(timeToType: number): number;
  confidence(timeToType: null): null;
  confidence(timeToType: number | null): number | null;
  confidence(timeToType: number | null): number | null {
    if (timeToType == null) {
      return null;
    }
    if (!Number.isFinite(timeToType) || timeToType === 0) {
      throw new Error();
    }
    return this.timeToType / timeToType;
  }
}
