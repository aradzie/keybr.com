import { injectable } from "@fastr/invert";
import { Env } from "@keybr/config";
import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

@injectable({ singleton: true })
export class PaddleConfig {
  readonly apiKey = Env.getString("PADDLE_API_KEY");
  readonly secretKey = Env.getString("PADDLE_SECRET_KEY");

  makePaddle() {
    return new Paddle(this.apiKey, {
      environment: Environment.production,
      logLevel: LogLevel.verbose,
    });
  }
}
