import {
  type ClientMessage,
  GameState,
  handleTextInput,
  makeWorldState,
  PLAYER_ANNOUNCE_ID,
  PLAYER_PROGRESS_ID,
  type ServerMessage,
  updateWorldState,
  type WorldState,
} from "@keybr/multiplayer-shared";
import { useSettings } from "@keybr/settings";
import { toTextDisplaySettings } from "@keybr/textinput";
import { type TextInputEvent } from "@keybr/textinput-events";
import { type Focusable, TextArea } from "@keybr/textinput-ui";
import { useScreenSize } from "@keybr/widget";
import mitt from "mitt";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { type IntlShape, useIntl } from "react-intl";
import * as styles from "./Game.module.less";
import { DeferredTrack } from "./Track.tsx";
import { type Transport } from "./transport.ts";

const handleFocus = () => {};
const handleBlur = () => {};
const WORLD_CHANGE_EVENT = "world-change";

export const Game = ({
  transport,
}: {
  readonly transport: Transport<ServerMessage, ClientMessage>;
}): ReactNode => {
  const intl = useIntl();
  const wrapper = useMemo(
    () => new WorldStateWrapper(transport, intl),
    [transport, intl],
  );
  const [worldState, setWorldState] = useState(wrapper.worldState);
  const focusRef = useRef<Focusable>(null);
  useEffect(() => {
    const eventListener = () => {
      setWorldState(wrapper.worldState);
      switch (wrapper.worldState.gameState) {
        case GameState.STARTING:
        case GameState.RUNNING: {
          focusRef.current?.focus();
          break;
        }
      }
    };
    wrapper.on(WORLD_CHANGE_EVENT, eventListener);
    wrapper.connect();
    return () => {
      wrapper.off(WORLD_CHANGE_EVENT, eventListener);
      wrapper.disconnect();
    };
  }, [wrapper]);
  const { settings } = useSettings();
  const textDisplaySettings = useMemo(
    () => toTextDisplaySettings(settings),
    [settings],
  );
  useScreenSize(); // Repaint on window resize.
  const { ticker, players, lines } = worldState;
  return (
    <div className={styles.game}>
      <DeferredTrack ticker={ticker} players={players} />
      <div className={styles.textArea}>
        <TextArea
          focusRef={focusRef}
          settings={textDisplaySettings}
          lines={lines}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onTextInput={wrapper.handleTextInput}
        />
      </div>
    </div>
  );
};

class WorldStateWrapper {
  readonly #emitter = mitt();
  #worldState: WorldState;

  readonly on = this.#emitter.on;
  readonly off = this.#emitter.off;

  constructor(
    readonly transport: Transport<ServerMessage, ClientMessage>,
    readonly intl: IntlShape,
  ) {
    this.#worldState = makeWorldState(this.intl);
  }

  get worldState(): WorldState {
    return this.#worldState;
  }

  setWorldState(worldState: WorldState): void {
    this.#worldState = worldState;
    this.#emitter.emit(WORLD_CHANGE_EVENT, worldState);
  }

  handleReceive = (message: ServerMessage): void => {
    this.setWorldState(updateWorldState(this.intl, this.#worldState, message));
  };

  handleTextInput = ({ inputType, codePoint }: TextInputEvent): void => {
    if (inputType === "appendChar") {
      const result = handleTextInput(this.#worldState, codePoint);
      if (result != null) {
        const { worldState, elapsed } = result;
        this.setWorldState(worldState);
        this.transport.send({
          type: PLAYER_PROGRESS_ID,
          elapsed,
          codePoint,
        });
      }
    }
  };

  connect(): void {
    this.transport.addReceiver(this.handleReceive);
    this.transport.send({
      type: PLAYER_ANNOUNCE_ID,
      signature: 0xdeadbabe,
    });
  }

  disconnect(): void {
    this.transport.removeReceiver(this.handleReceive);
  }
}
