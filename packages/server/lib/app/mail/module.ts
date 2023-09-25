import { type Binder, type Module } from "@fastr/invert";
import { MailgunMailer } from "./mailgun.ts";
import { Mailer } from "./types.ts";

export class MailModule implements Module {
  configure({ bind }: Binder): void {
    bind(Mailer).to(MailgunMailer);
  }
}
