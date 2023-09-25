import { injectable } from "@fastr/invert";

@injectable()
export abstract class Mailer {
  abstract sendMail(message: Mailer.Message): Promise<void>;
}

export declare namespace Mailer {
  export type Message = {
    readonly from?: string;
    readonly to: string;
    readonly subject: string;
    readonly text?: string;
    readonly html?: string;
  };
}
