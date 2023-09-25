export type Transport<ServerMessage, ClientMessage> = {
  addReceiver(receiver: (message: ServerMessage) => void): void;
  removeReceiver(receiver: (message: ServerMessage) => void): void;
  send(message: ClientMessage): void;
  close(code?: number, reason?: string): void;
};
