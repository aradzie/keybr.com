export type Codec<IncomingMessage, OutgoingMessage> = {
  decode(data: Uint8Array): IncomingMessage;
  encode(message: OutgoingMessage): Uint8Array;
};
