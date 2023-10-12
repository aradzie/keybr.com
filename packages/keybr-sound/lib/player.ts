import { type Player } from "./types.ts";

export class NullPlayer implements Player {
  play(offset?: number, duration?: number): void {}
  stop(): void {}
  volume(volume: number): void {}
}

export class WebAudioPlayer implements Player {
  private readonly _context: AudioContext;
  private readonly _buffer: AudioBuffer;
  private readonly _gain: GainNode;
  private _source: AudioBufferSourceNode | null;

  constructor(context: AudioContext, buffer: AudioBuffer) {
    this._context = context;
    this._buffer = buffer;
    this._gain = this._context.createGain();
    this._gain.connect(this._context.destination);
    this._source = null;
  }

  play(offset?: number, duration?: number): void {
    this.stop();
    const source = this._context.createBufferSource();
    this._source = source;
    source.onended = () => {
      this._source = null;
    };
    source.buffer = this._buffer;
    source.connect(this._gain);
    source.start(0, offset, duration);
  }

  stop(): void {
    if (this._source != null) {
      this._source.stop();
      this._source = null;
    }
  }

  volume(volume: number): void {
    this._gain.gain.value = volume;
  }
}
