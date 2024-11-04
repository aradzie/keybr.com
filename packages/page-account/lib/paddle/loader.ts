import { paddleToken } from "@keybr/thirdparties";
import { getPaddleInstance, type Paddle } from "@paddle/paddle-js";

let promise: Promise<Paddle> | null = null;

export function loadPaddle() {
  if (promise == null) {
    promise = new Promise<Paddle>((resolve, reject) => {
      const script = document.createElement("script");
      script.onload = () => {
        const paddle = getPaddleInstance("v1");
        if (paddle != null && typeof paddle === "object") {
          paddle.Environment.set("production");
          paddle.Initialize({
            token: paddleToken,
          });
          resolve(paddle);
        } else {
          reject(new Error("Cannot initialize Paddle"));
        }
      };
      script.onerror = () => {
        reject(new Error("Cannot load Paddle"));
      };
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      document.head.appendChild(script);
    });
  }
  return promise;
}
