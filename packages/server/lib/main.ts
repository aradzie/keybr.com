import cluster, { type ClusterSettings } from "node:cluster";
import { Application } from "@fastr/core";
import { Container } from "@fastr/invert";
import { ConfigModule, Env } from "@keybr/config";
import { Logger } from "@keybr/logger";
import { Game } from "@keybr/multiplayer-server";
import { ApplicationModule, kGame, kMain } from "./app/index.ts";
import { ServerModule } from "./server/module.ts";
import { Service } from "./server/service.ts";

// Allow Node to bind to port 80 and 443 without sudo:
// sudo setcap cap_net_bind_service=+ep $(which node)

initErrorHandlers();
if (cluster.isPrimary) {
  Env.probeFilesSync();
  const container = makeContainer();
  Logger.info("Configuration", {
    dataDir: container.get("dataDir"),
    publicDir: container.get("publicDir"),
    canonicalUrl: container.get("canonicalUrl"),
  });
  process.title = "keybr master process";
  fork({ args: ["http"] });
  fork({ args: ["http"] });
  fork({ args: ["http"] });
  fork({ args: ["http"] });
  fork({ args: ["ws"] });
} else {
  const container = makeContainer();
  const service = container.get(Service);
  switch (process.argv[2]) {
    case "http":
      process.title = "keybr server worker process";
      service.start({
        app: container.get(Application, kMain),
        port: Env.getPort("SERVER_PORT", 3000),
      });
      break;
    case "ws":
      process.title = "keybr game server worker process";
      service.start({
        app: container.get(Application, kGame),
        port: Env.getPort("SERVER_PORT_WS", 3001),
      });
      container.get(Game).start();
      break;
  }
}

function makeContainer() {
  const container = new Container();
  container.load(new ConfigModule());
  container.load(new ApplicationModule());
  container.load(new ServerModule());
  return container;
}

function fork(settings: ClusterSettings) {
  cluster.setupPrimary(settings);
  const worker = cluster.fork({});
  worker.on("online", () => {
    Logger.info("Worker started", { pid: worker.process.pid });
  });
  worker.on("exit", (code, signal) => {
    Logger.info("Worker died, starting a new worker", {
      pid: worker.process.pid,
      code,
      signal,
    });
    fork(settings); // Restart failed worker.
  });
}

function initErrorHandlers() {
  process.on("warning", (warning) => {
    Logger.warn("Warning", warning);
  });
  process.on("multipleResolves", (type, promise, reason) => {
    Logger.error("Multiple resolvers", { type, promise, reason });
    process.exit(1);
  });
  process.on("uncaughtException", (error) => {
    Logger.error("Uncaught exception", error);
    process.exit(1);
  });
  process.on("unhandledRejection", (reason) => {
    Logger.error("Unhandled rejection", reason);
    process.exit(1);
  });
}
