let promise: Promise<void> | null = null;

export function loadPaddle(): Promise<void> {
  if (promise == null) {
    promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.onload = () => {
        if (typeof Paddle === "object" && Paddle != null) {
          resolve();
        } else {
          reject(new Error("Cannot initialize Paddle"));
        }
      };
      script.onerror = () => {
        reject(new Error("Cannot load Paddle"));
      };
      script.src = "https://cdn.paddle.com/paddle/paddle.js";
      document.head.appendChild(script);
    });
  }
  return promise;
}
