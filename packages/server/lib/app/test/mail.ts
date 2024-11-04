import { injectable } from "@fastr/invert";
import { Mailer } from "../mail/index.ts";

@injectable()
export class FakeMailer extends Mailer {
  readonly #sent: Mailer.Message[] = [];

  async sendMail(message: Mailer.Message) {
    this.#sent.push({ ...message });
  }

  dump() {
    const result = [...this.#sent];
    this.#sent.length = 0;
    return result;
  }
}
