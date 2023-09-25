import { type Reader, type Writer } from "@keybr/binary";
import {
  type AnonymousUser,
  type AnyUser,
  type NamedUser,
} from "@keybr/pages-shared";

export function writeUser(user: AnyUser, writer: Writer): void {
  writer.putString(user.id || "");
  writer.putString(user.name || "");
  writer.putString(user.imageUrl || "");
  writer.putUint8(user.id != null && user.premium ? 1 : 0);
}

export function readUser(reader: Reader): AnyUser {
  const id = reader.getString() || null;
  const name = reader.getString() || null;
  const imageUrl = reader.getString() || null;
  const premium = reader.getUint8() > 0;
  if (id != null) {
    return { id, name, imageUrl, premium } as NamedUser;
  } else {
    return { id, name, imageUrl } as AnonymousUser;
  }
}
