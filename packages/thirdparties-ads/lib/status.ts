import { placeholder } from "@keybr/thirdparties";

export function showAdBlockerStatus(enabled: boolean): void {
  const placeholders = findElements(`.${placeholder}`);
  if (enabled) {
    for (const elem of placeholders) {
      elem.style.visibility = "hidden";
      elem.innerHTML = "";
    }
  } else {
    for (const elem of placeholders) {
      elem.style.visibility = "visible";
      elem.innerHTML =
        "<div>" +
        "Please disable your ad-blocker or purchase " +
        "a <a href='/account'>premium account</a> to remove ads!" +
        "</div>";
    }
  }
}

function findElements(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector));
}
