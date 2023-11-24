function main() {
  const burst = [];
  let timer = null;
  window.addEventListener("keydown", (ev) => {
    burst.push(ev.timeStamp);
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      process(burst);
      burst.length = 0;
    }, 250);
  });
}

function process(burst) {
  const { length } = burst;
  if (length > 1) {
    const time = [];
    for (let i = 0; i < length - 1; i++) {
      time.push(burst[i + 1] - burst[i]);
    }
    const min = Math.min(...time);
    const sum = time.reduce((a, b) => a + b, 0);
    const avg = sum / time.length;
    report(time, min, avg);
  }
}

function report(time, min, avg) {
  const root = document.querySelector("main");
  while (root.children.length > 10) {
    root.removeChild(root.lastChild);
  }
  const el = document.createElement("div");
  el.innerText =
    `time: ${time.sort().map(r).join(", ")}\n` +
    `max speed: ${format(min)}\n` +
    `avg speed: ${format(avg)}\n\n`;
  root.insertBefore(el, root.firstChild);
}

function format(time) {
  const cps = 1000 / time;
  const cpm = cps * 60;
  const wps = cps / 5;
  const wpm = cpm / 5;
  return [
    `${r(time)}ms`,
    `${r(cps)}cps`,
    `${r(cpm)}cpm`,
    `${r(wps)}wps`,
    `${r(wpm)}wpm`,
  ]
    .map((v) => v.padStart(12))
    .join(" | ");
}

function r(v) {
  return Math.round(v * 100) / 100;
}

main();
