import { loadScripts } from "./scripts.ts";
import { showAdBlockerStatus } from "./status.ts";

main();

function main(): void {
  Promise.resolve()
    .then(() => pause(5000))
    .then(() => loadScripts())
    .then((loaded) => {
      showAdBlockerStatus(loaded);
    })
    .catch((err) => {
      console.error(err);
    });
}

function pause(delay: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
