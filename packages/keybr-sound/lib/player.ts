import { type Player } from "./types.ts";

export class NullPlayer implements Player {
  play(offset?: number, duration?: number): void {}
  stop(): void {}
  volume(volume: number): void {}
}

export class WebAudioPlayer implements Player {
  readonly #context: AudioContext;
  readonly #buffer: AudioBuffer;
  readonly #gain: GainNode;
  #source: AudioBufferSourceNode | null;

  constructor(context: AudioContext, buffer: AudioBuffer) {
    this.#context = context;
    this.#buffer = buffer;
    this.#gain = this.#context.createGain();
    this.#gain.connect(this.#context.destination);
    this.#source = null;
  }

  play(offset?: number, duration?: number): void {
    this.stop();
    const source = this.#context.createBufferSource();
    this.#source = source;
    source.onended = () => {
      this.#source = null;
    };
    source.buffer = this.#buffer;
    source.connect(this.#gain);
    source.start(0, offset, duration);
  }

  stop(): void {
    if (this.#source != null) {
      this.#source.stop();
      this.#source = null;
    }
  }

  volume(volume: number): void {
    this.#gain.gain.value = volume;
  }
}
