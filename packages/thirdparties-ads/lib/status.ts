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
        p(
          "Please either disable your ad-blocker or purchase " +
            "a <a href='/account'>premium account</a> to remove ads!",
        ) +
        p(
          "You may not like this ad, but it supports the developer " +
            "and keeps this app free.",
        );
    }
  }
}

function p(text: string): string {
  return `<p style="color: red">${text}</p>`;
}

function findElements(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector));
}
