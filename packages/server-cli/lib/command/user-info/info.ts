import { type Order, type User, type UserExternalId } from "@keybr/database";
import { PublicId } from "@keybr/publicid";

export function userToInfo(model?: User | null): unknown {
  if (model == null) {
    return null;
  }
  const { id, email, name, createdAt } = model;
  const publicId = String(new PublicId(id!));
  const externalIds = model.externalIds!.map(externalIdToInfo);
  const order = orderToInfo(model.order);
  return { id, publicId, email, name, createdAt, externalIds, order };
}

export function externalIdToInfo(model?: UserExternalId | null): unknown {
  if (model == null) {
    return null;
  }
  const { provider, externalId, name, url, imageUrl, createdAt } = model;
  return { provider, externalId, name, url, imageUrl, createdAt };
}

export function orderToInfo(model?: Order | null): unknown {
  if (model == null) {
    return null;
  }
  const { id, provider, email, name, createdAt } = model;
  return { id, provider, email, name, createdAt };
}
