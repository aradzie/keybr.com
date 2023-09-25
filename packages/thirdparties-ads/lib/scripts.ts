import { cookiebotClientId } from "@keybr/thirdparties";

export function loadScripts(): Promise<boolean> {
  return Promise.resolve()
    .then(() =>
      loadScript("https://consent.cookiebot.com/uc.js", (script) => {
        script.id = "Cookiebot";
        script.dataset.cbid = cookiebotClientId;
        script.dataset.framework = "TCFv2.2";
        script.dataset.blockingmode = "auto";
      }),
    )
    .then(() => loadScript("https://a.pub.network/keybr-com/pubfig.min.js"))
    .then(
      () => true,
      () => false,
    );
}

function loadScript(
  url: string,
  customize: (script: HTMLScriptElement) => void = () => {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error(`Cannot load script [${url}]`));
    };
    script.src = url;
    customize(script);
    document.head.appendChild(script);
  });
}
