import { PaddleSdk, stringifyMetadata } from "@devoxa/paddle-sdk";
import { injectable } from "@fastr/invert";
import { Env } from "@keybr/config";

/** Additional checkout information. */
export type Metadata = {
  /** User id. */
  readonly id: string;
};

@injectable({ singleton: true })
export class PaddleConfig {
  readonly vendorId = Env.getNumber("PADDLE_VENDOR_ID");
  readonly vendorAuthCode = Env.getString("PADDLE_VENDOR_AUTH_CODE");
  readonly productId = Env.getNumber("PADDLE_PRODUCT_ID");
  readonly publicKey = Env.getString("PADDLE_PUBLIC_KEY");

  makePaddle() {
    return new PaddleSdk({
      publicKey: this.publicKey,
      vendorId: this.vendorId,
      vendorAuthCode: this.vendorAuthCode,
      metadataCodec: stringifyMetadata<Metadata>(),
    });
  }
}
