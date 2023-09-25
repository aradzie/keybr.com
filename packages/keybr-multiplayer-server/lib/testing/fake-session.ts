import { type ServerMessage } from "@keybr/multiplayer-shared";
import { type AnyUser } from "@keybr/pages-shared";
import { type Session } from "../types.ts";

export class FakeSession implements Session {
  readonly id: string = "id";
  readonly user: AnyUser = { id: null, name: "player name", imageUrl: null };
  readonly operations: any[] = [];

  take(): any[] {
    const operations = [...this.operations];
    this.operations.length = 0;
    return operations;
  }

  ping(data?: any, mask?: boolean): void {
    this.operations.push({
      op: "ping",
      data,
      mask,
    });
  }

  pong(data?: any, mask?: boolean): void {
    this.operations.push({
      op: "pong",
      data,
      mask,
    });
  }

  send(message: ServerMessage): void {
    this.operations.push({
      op: "send",
      message,
    });
  }

  close(code?: number, data?: string): void {
    this.operations.push({
      op: "close",
      code,
      data,
    });
  }

  terminate(): void {
    this.operations.push({
      op: "terminate",
    });
  }
}
