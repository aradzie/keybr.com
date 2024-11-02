export class AnimationFrames {
  #id = 0;
  #started = 0;

  start(callback: (elapsed: DOMHighResTimeStamp) => void | boolean) {
    this.cancel();
    this.#started = 0;
    const step = (time: DOMHighResTimeStamp) => {
      if (this.#started === 0) {
        this.#started = time;
      }
      if (callback(time - this.#started) !== false) {
        this.#id = requestAnimationFrame(step);
      }
    };
    this.#id = requestAnimationFrame(step);
  }

  cancel() {
    if (this.#id) {
      cancelAnimationFrame(this.#id);
    }
    this.#id = 0;
  }
}
