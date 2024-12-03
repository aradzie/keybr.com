import { EventEmitter } from "@keybr/lang";
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
import { type IInputEvent } from "@keybr/textinput-events";
import { TextArea } from "@keybr/textinput-ui";
import { type Focusable, useScreenSize } from "@keybr/widget";
import { useEffect, useMemo, useRef, useState } from "react";
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
  transport: Transport<ServerMessage, ClientMessage>;
}) => {
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
          onInput={wrapper.handleInput}
        />
      </div>
    </div>
  );
};

class WorldStateWrapper extends EventEmitter {
  #worldState: WorldState;

  constructor(
    readonly transport: Transport<ServerMessage, ClientMessage>,
    readonly intl: IntlShape,
  ) {
    super();
    this.#worldState = makeWorldState(this.intl);
  }

  get worldState(): WorldState {
    return this.#worldState;
  }

  setWorldState(worldState: WorldState) {
    this.#worldState = worldState;
    this.emit(WORLD_CHANGE_EVENT, worldState);
  }

  handleReceive = (message: ServerMessage) => {
    this.setWorldState(updateWorldState(this.intl, this.#worldState, message));
  };

  handleInput = ({ inputType, codePoint }: IInputEvent) => {
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

  connect() {
    this.transport.addReceiver(this.handleReceive);
    this.transport.send({
      type: PLAYER_ANNOUNCE_ID,
      signature: 0xdeadbabe,
    });
  }

  disconnect() {
    this.transport.removeReceiver(this.handleReceive);
  }
}
