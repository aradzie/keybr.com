import { type AnonymousUser, type NamedUser } from "@keybr/pages-shared";
import { type BasicPlayer, type Player, type PlayerState } from "../types.ts";

export const user1 = Object.freeze<NamedUser>({
  id: "id1",
  name: "name1",
  imageUrl: null,
  premium: false,
});
export const user2 = Object.freeze<NamedUser>({
  id: "id2",
  name: "name2",
  imageUrl: "imageUrl2",
  premium: true,
});
export const user3 = Object.freeze<AnonymousUser>({
  id: null,
  name: "somebody",
  imageUrl: null,
});
export const basicPlayer1 = Object.freeze<BasicPlayer>({
  id: 111,
  user: user1,
});
export const basicPlayer2 = Object.freeze<BasicPlayer>({
  id: 222,
  user: user2,
});
export const basicPlayer3 = Object.freeze<BasicPlayer>({
  id: 333,
  user: user3,
});
export const player1 = Object.freeze<Player>({
  id: 111,
  user: user1,
  spectator: false,
  finished: false,
  position: 0,
  offset: 0,
  speed: 0,
  errors: 0,
  progress: 0,
});
export const player2 = Object.freeze<Player>({
  id: 222,
  user: user2,
  spectator: false,
  finished: false,
  position: 0,
  offset: 0,
  speed: 0,
  errors: 0,
  progress: 0,
});
export const player3 = Object.freeze<Player>({
  id: 333,
  user: user3,
  spectator: false,
  finished: false,
  position: 0,
  offset: 0,
  speed: 0,
  errors: 0,
  progress: 0,
});
export const playerState1 = Object.freeze<PlayerState>({
  spectator: false,
  finished: true,
  position: 4,
  offset: 3,
  speed: 2,
  errors: 1,
});
export const playerState2 = Object.freeze<PlayerState>({
  spectator: true,
  finished: false,
  position: 1,
  offset: 2,
  speed: 3,
  errors: 4,
});
export const playerState3 = Object.freeze<PlayerState>({
  spectator: false,
  finished: false,
  position: 10,
  offset: 10,
  speed: 10,
  errors: 10,
});
