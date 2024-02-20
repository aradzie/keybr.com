import { type AnyUser } from "@keybr/pages-shared";
import { TextInput } from "@keybr/textinput";
import { Timer } from "@keybr/timer";
import { type IntlShape } from "react-intl";
import {
  GAME_CONFIG_ID,
  GAME_READY_ID,
  GAME_WORLD_ID,
  type GameConfigMessage,
  type GameReadyMessage,
  GameState,
  type GameWorldMessage,
  PLAYER_JOIN_ID,
  PLAYER_LEAVE_ID,
  type PlayerJoinMessage,
  type PlayerLeaveMessage,
  type ServerMessage,
} from "./messages.ts";
import {
  type BasicPlayer,
  type Player,
  type PlayerList,
  type WorldState,
} from "./types.ts";
import { positionName } from "./util.ts";

export const NOBODY = Object.freeze<Player>({
  id: 0,
  user: Object.freeze<AnyUser>({
    id: null,
    name: "nobody",
    imageUrl: null,
  }),
  spectator: false,
  finished: false,
  position: 0,
  offset: 0,
  speed: 0,
  errors: 0,
  progress: 0,
});

export function makeTextInput(text: string): TextInput {
  return new TextInput(text, {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: false,
  });
}

export function makeWorldState(intl: IntlShape): WorldState {
  const textInput = makeTextInput("");
  const lines = textInput.getLines();
  return {
    gameState: GameState.INITIALIZING,
    players: {
      all: [],
      me: NOBODY,
    },
    textInput,
    lines,
    timer: new Timer(),
    ticker: intl.formatMessage({
      id: "multiplayer.ticker.initializing",
      defaultMessage: "Initializing...",
    }),
  };
}

export function handleTextInput(
  worldState: WorldState,
  codePoint: number,
): {
  readonly worldState: WorldState;
  readonly elapsed: number;
} | null {
  const { gameState, players, textInput, timer } = worldState;
  if (!players.me.spectator && gameState === GameState.RUNNING) {
    const elapsed = timer.elapsed();
    textInput.appendChar(codePoint, elapsed);
    const lines = textInput.getLines();
    return { worldState: { ...worldState, lines }, elapsed };
  } else {
    return null;
  }
}

export function updateWorldState(
  intl: IntlShape,
  worldState: WorldState,
  message: ServerMessage,
): WorldState {
  switch (message.type) {
    case PLAYER_JOIN_ID:
      return handlePlayerJoinMessage(worldState, message);
    case PLAYER_LEAVE_ID:
      return handlePlayerLeaveMessage(worldState, message);
    case GAME_CONFIG_ID:
      return handleGameConfigMessage(worldState, message);
    case GAME_READY_ID:
      return handleGameReadyMessage(intl, worldState, message);
    case GAME_WORLD_ID:
      return handleGameWorldMessage(intl, worldState, message);
  }
}

function handlePlayerJoinMessage(
  worldState: WorldState,
  { joinedId, players }: PlayerJoinMessage,
): WorldState {
  const all = mergePlayers(worldState.players.all, players);
  const me =
    worldState.players.all.length === 0 //
      ? findMe(all, joinedId)
      : findMe(all, worldState.players.me.id);
  return {
    ...worldState,
    players: { all, me },
  };
}

function handlePlayerLeaveMessage(
  worldState: WorldState,
  { leftId, players }: PlayerLeaveMessage,
): WorldState {
  const all = mergePlayers(worldState.players.all, players);
  const me =
    worldState.players.me.id === leftId //
      ? NOBODY
      : findMe(all, worldState.players.me.id);
  return {
    ...worldState,
    players: { all, me },
  };
}

function handleGameConfigMessage(
  worldState: WorldState,
  { text }: GameConfigMessage,
): WorldState {
  const textInput = makeTextInput(text);
  const lines = textInput.getLines();
  return { ...worldState, textInput, lines };
}

function handleGameReadyMessage(
  intl: IntlShape,
  worldState: WorldState,
  { gameState, countDown }: GameReadyMessage,
): WorldState {
  switch (gameState) {
    case GameState.WAITING: {
      return {
        ...worldState,
        gameState,
        players: resetPlayers(worldState.players),
        ticker: intl.formatMessage({
          id: "multiplayer.ticker.waitingMorePlayers",
          defaultMessage: "Waiting for more players...",
        }),
      };
    }
    case GameState.STARTING: {
      return {
        ...worldState,
        gameState,
        players: resetPlayers(worldState.players),
        ticker: intl.formatMessage(
          {
            id: "multiplayer.ticker.countDown",
            defaultMessage: "Start in {countDown}",
          },
          { countDown },
        ),
      };
    }
    case GameState.RUNNING: {
      return {
        ...worldState,
        gameState,
        timer: new Timer(),
        ticker: intl.formatMessage({
          id: "multiplayer.ticker.raceStarted",
          defaultMessage: "Race started!",
        }),
      };
    }
    case GameState.FINISHED: {
      if (worldState.players.me.finished) {
        return {
          ...worldState,
          gameState,
        };
      } else {
        return {
          ...worldState,
          gameState,
          ticker: intl.formatMessage({
            id: "multiplayer.ticker.raceFinished",
            defaultMessage: "Race finished!",
          }),
        };
      }
    }
    default:
      throw new Error(); // Unreachable.
  }
}

function handleGameWorldMessage(
  intl: IntlShape,
  worldState: WorldState,
  message: GameWorldMessage,
): WorldState {
  const players = updatePlayerStates(worldState, message);
  if (players.me.spectator) {
    return {
      ...worldState,
      players,
      ticker: intl.formatMessage({
        id: "multiplayer.ticker.waitingNextRace",
        defaultMessage: "Zzz... Wait for the next race",
      }),
    };
  } else if (players.me.finished) {
    if (players.me.position === 1) {
      return {
        ...worldState,
        players,
        ticker: intl.formatMessage({
          id: "multiplayer.ticker.winnerPosition",
          defaultMessage: "You won the race!",
        }),
      };
    } else {
      return {
        ...worldState,
        players,
        ticker: intl.formatMessage(
          {
            id: "multiplayer.ticker.finishedPosition",
            defaultMessage: `You finished {position}!`,
          },
          { position: positionName(players.me.position) },
        ),
      };
    }
  } else {
    return {
      ...worldState,
      players,
      ticker: intl.formatMessage({
        id: "multiplayer.ticker.start",
        defaultMessage: "GO!",
      }),
    };
  }
}

function updatePlayerStates(
  worldState: WorldState,
  { playerState }: GameWorldMessage,
): PlayerList {
  const players = new Map<number, Player>(
    worldState.players.all.map((player) => [player.id, player]),
  );
  for (const [id, newPlayerState] of playerState.entries()) {
    const player = players.get(id);
    if (player != null) {
      const newProgress = player.offset / worldState.textInput.text.length;
      if (
        player.spectator !== newPlayerState.spectator ||
        player.finished !== newPlayerState.finished ||
        player.position !== newPlayerState.position ||
        player.offset !== newPlayerState.offset ||
        player.speed !== newPlayerState.speed ||
        player.errors !== newPlayerState.errors ||
        player.progress !== newProgress
      ) {
        players.set(player.id, {
          id: player.id,
          user: player.user,
          spectator: newPlayerState.spectator,
          finished: newPlayerState.finished,
          position: newPlayerState.position,
          offset: newPlayerState.offset,
          speed: newPlayerState.speed,
          errors: newPlayerState.errors,
          progress: newProgress,
        });
      }
    }
  }
  const all = [...players.values()];
  const me = findMe(all, worldState.players.me.id);
  return { all, me };
}

function resetPlayers(list: PlayerList): PlayerList {
  const all = list.all.map((player) => ({
    id: player.id,
    user: player.user,
    spectator: false,
    finished: false,
    position: 0,
    offset: 0,
    speed: 0,
    errors: 0,
    progress: 0,
  }));
  const me = findMe(all, list.me.id);
  return { all, me };
}

function mergePlayers(
  all: readonly Player[],
  snapshot: readonly BasicPlayer[],
): readonly Player[] {
  const curr = new Map<number, Player>(
    all.map((player) => [player.id, player]),
  );
  const next = new Map<number, BasicPlayer>(
    snapshot.map((player) => [player.id, player]),
  );
  for (const player of curr.values()) {
    if (next.get(player.id) == null) {
      curr.delete(player.id);
    }
  }
  for (const player of next.values()) {
    if (curr.get(player.id) == null) {
      curr.set(player.id, {
        id: player.id,
        user: player.user,
        spectator: false,
        finished: false,
        position: 0,
        offset: 0,
        speed: 0,
        errors: 0,
        progress: 0,
      });
    }
  }
  return [...curr.values()];
}

function findMe(all: readonly Player[], id: number): Player {
  return all.find((player) => player.id === id) ?? NOBODY;
}
