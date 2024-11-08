import { type Player } from "./types.ts";

export const nullPlayer = new (class NullPlayer implements Player {
  play(offset?: number, duration?: number) {}
  stop() {}
  volume(volume: number) {}
})();

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

  play(offset?: number, duration?: number) {
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

  stop() {
    if (this.#source != null) {
      this.#source.stop();
      this.#source = null;
    }
  }

  volume(volume: number) {
    this.#gain.gain.value = volume;
  }
}
