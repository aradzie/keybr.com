import { placeholder } from "@keybr/thirdparties";

export function showAdBlockerStatus(enabled: boolean): void {
  const placeholders = findElements(`.${placeholder}`);
  if (enabled) {
    for (const elem of placeholders) {
      elem.hidden = true;
      elem.innerHTML = "";
    }
  } else {
    for (const elem of placeholders) {
      elem.hidden = false;
      elem.innerHTML =
        "Please disable your ad-blocker or purchase " +
        "a <a href='/account'>premium account</a> to remove ads!";
    }
  }
}

function findElements(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector));
}
