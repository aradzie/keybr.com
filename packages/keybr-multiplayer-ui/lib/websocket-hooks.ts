import { PLAYER_KICKED } from "@keybr/multiplayer-shared";
import { useEffect, useState } from "react";

export function useWebSocket() {
  const [state, setState] = useState({
    webSocket: null,
    readyState: WebSocket.CONNECTING,
    kicked: false,
  } as {
    readonly webSocket: WebSocket | null;
    readonly readyState: number;
    readonly kicked: boolean;
  });

  useEffect(() => {
    let webSocket: WebSocket | null = null;
    let timeout: number | null = null;

    const connect = () => {
      const makeWebSocket = (webSocket = useWebSocket.makeWebSocket());

      makeWebSocket.addEventListener("open", () => {
        console.log("WebSocket connected");
        setState({
          webSocket: (webSocket = makeWebSocket),
          readyState: WebSocket.OPEN,
          kicked: false,
        });
      });

      makeWebSocket.addEventListener("close", (ev) => {
        console.log(`WebSocket closed; code=${ev.code}, reason='${ev.reason}'`);
        setState({
          webSocket: (webSocket = null),
          readyState: WebSocket.CLOSED,
          kicked: ev.code === PLAYER_KICKED,
        });
        switch (ev.code) {
          case 1006: // CLOSE_ABNORMAL
          case 1012: // Service Restart
          case 1013: // Try Again Later
            timeout = window.setTimeout(() => {
              timeout = null;
              connect();
            }, 3000);
            break;
        }
      });

      makeWebSocket.addEventListener("error", () => {
        console.error("WebSocket error");
        makeWebSocket.close();
      });
    };

    connect();

    return () => {
      if (webSocket != null) {
        webSocket.close();
        webSocket = null;
      }
      if (timeout != null) {
        window.clearTimeout(timeout);
        timeout = null;
      }
    };
  }, []);

  return state;
}

useWebSocket.makeWebSocket = () => {
  return new WebSocket(webSocketUrl());
};

function webSocketUrl() {
  const { protocol, host } = window.location;
  let scheme = "";
  switch (protocol) {
    case "https:":
      scheme = "wss:";
      break;
    case "http:":
      scheme = "ws:";
      break;
    default:
      throw new Error();
  }
  return `${scheme}//${host}/_/game/server`;
}
