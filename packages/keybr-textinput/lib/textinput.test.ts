import { test } from "node:test";
import { toCodePoints } from "@keybr/unicode";
import { deepEqual, equal, isFalse, isTrue, throws } from "rich-assert";
import { Attr } from "./chars.ts";
import { Histogram } from "./histogram.ts";
import { makeStats } from "./stats.ts";
import { Feedback, TextInput } from "./textinput.ts";

const A = /* "a" */ 0x0061;
const B = /* "b" */ 0x0062;
const C = /* "c" */ 0x0063;
const D = /* "d" */ 0x0064;
const X = /* "x" */ 0x0078;
const Space = /* SPACE */ 0x0020;

test("allow empty text", () => {
  const textInput = new TextInput("", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(textInput.length, 0);
  equal(textInput.pos, 0);
  isTrue(textInput.completed);
  throws(() => {
    textInput.appendChar(100, A, 100);
  });
  throws(() => {
    textInput.appendChar(100, Space, 100);
  });
  deepEqual(makeStats(textInput.steps), {
    time: 0,
    speed: 0,
    length: 0,
    errors: 0,
    accuracy: 0.0,
    histogram: new Histogram([]),
  });
});

test("advance to completion", () => {
  const textInput = new TextInput("abcd", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c|d");
  equal(textInput.length, 4);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(100, A, 101), Feedback.Succeeded);
  equal(showSteps(textInput), "a,100,101");
  equal(showChars(textInput), "a|[b]|c|d");
  equal(textInput.length, 4);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);

  equal(textInput.appendChar(200, B, 102), Feedback.Succeeded);
  equal(showSteps(textInput), "a,100,101|b,200,102");
  equal(showChars(textInput), "a|b|[c]|d");
  equal(textInput.length, 4);
  equal(textInput.pos, 2);
  isFalse(textInput.completed);

  equal(textInput.appendChar(300, C, 103), Feedback.Succeeded);
  equal(showSteps(textInput), "a,100,101|b,200,102|c,300,103");
  equal(showChars(textInput), "a|b|c|[d]");
  equal(textInput.length, 4);
  equal(textInput.pos, 3);
  isFalse(textInput.completed);

  equal(textInput.appendChar(400, D, 104), Feedback.Succeeded);
  equal(showSteps(textInput), "a,100,101|b,200,102|c,300,103|d,400,104");
  equal(showChars(textInput), "a|b|c|d");
  equal(textInput.length, 4);
  equal(textInput.pos, 4);
  isTrue(textInput.completed);

  deepEqual(makeStats(textInput.steps), {
    time: 300,
    speed: 800,
    length: 4,
    errors: 0,
    accuracy: 1.0,
    histogram: new Histogram([
      { codePoint: B, hitCount: 1, missCount: 0, timeToType: 102 },
      { codePoint: C, hitCount: 1, missCount: 0, timeToType: 103 },
      { codePoint: D, hitCount: 1, missCount: 0, timeToType: 104 },
    ]),
  });
});

test("accumulate and delete garbage", () => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
    spaceSkipsWords: true,
  });

  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(100, X, 100), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "*x|[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(200, A, 100), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "*x|*a|[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.clearChar(), Feedback.Succeeded);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "*x|[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.clearChar(), Feedback.Succeeded);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(500, A, 91), Feedback.Recovered);
  equal(showSteps(textInput), "!a,500,91");
  equal(showChars(textInput), "!a|[b]|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);
});

test("limit garbage length", () => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
    spaceSkipsWords: true,
  });

  for (let i = 1; i <= 100; i++) {
    equal(textInput.appendChar(i * 100, X, 100), Feedback.Failed);
  }

  equal(showSteps(textInput), "");
  equal(showChars(textInput), "*x|*x|*x|*x|*x|*x|*x|*x|*x|*x|[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);
});

test("handle backspace at the start of a word", () => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, X, 100), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "*x|[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.clearChar(), Feedback.Succeeded);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.clearChar(), Feedback.Succeeded);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(400, A, 101), Feedback.Recovered);
  equal(showSteps(textInput), "!a,400,101");
  equal(showChars(textInput), "!a|[b]|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);
});

test("handle backspace in the middle of a word", () => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, A, 101), Feedback.Succeeded);
  equal(showSteps(textInput), "a,100,101");
  equal(showChars(textInput), "a|[b]|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);

  equal(textInput.appendChar(200, X, 100), Feedback.Failed);
  equal(showSteps(textInput), "a,100,101");
  equal(showChars(textInput), "a|*x|[b]|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);

  equal(textInput.clearChar(), Feedback.Succeeded);
  equal(showSteps(textInput), "a,100,101");
  equal(showChars(textInput), "a|[b]|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);

  equal(textInput.clearChar(), Feedback.Succeeded);
  equal(showSteps(textInput), "a,100,101");
  equal(showChars(textInput), "a|[b]|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);

  equal(textInput.appendChar(500, B, 102), Feedback.Recovered);
  equal(showSteps(textInput), "a,100,101|!b,500,102");
  equal(showChars(textInput), "a|!b|[c]");
  equal(textInput.length, 3);
  equal(textInput.pos, 2);
  isFalse(textInput.completed);
});

test("forgive an inserted character", () => {
  const textInput = new TextInput("abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(100, X, 100), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(200, A, 101), Feedback.Recovered);
  equal(showSteps(textInput), "!a,200,101");
  equal(showChars(textInput), "!a|[b]|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);

  equal(textInput.appendChar(300, B, 102), Feedback.Succeeded);
  equal(showSteps(textInput), "!a,200,101|b,300,102");
  equal(showChars(textInput), "!a|b|[c]");
  equal(textInput.length, 3);
  equal(textInput.pos, 2);
  isFalse(textInput.completed);

  equal(textInput.appendChar(400, C, 103), Feedback.Succeeded);
  equal(showSteps(textInput), "!a,200,101|b,300,102|c,400,103");
  equal(showChars(textInput), "!a|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 3);
  isTrue(textInput.completed);
});

test("forgive a skipped character", () => {
  const textInput = new TextInput("abcd", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, B, 101), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c|d");
  isFalse(textInput.completed);

  equal(textInput.appendChar(200, C, 102), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c|d");
  isFalse(textInput.completed);

  equal(textInput.appendChar(300, D, 103), Feedback.Recovered);
  equal(showSteps(textInput), "!a,100,0|b,100,101|c,200,102|d,300,103");
  equal(showChars(textInput), "!a|b|c|d");
  isTrue(textInput.completed);
});

test("forgive a replaced character", () => {
  const textInput = new TextInput("abcd", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, X, 101), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c|d");
  equal(textInput.length, 4);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(200, B, 102), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c|d");
  equal(textInput.length, 4);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(300, C, 103), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c|d");
  equal(textInput.length, 4);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(400, D, 104), Feedback.Recovered);
  equal(showSteps(textInput), "!a,100,0|b,200,102|c,300,103|d,400,104");
  equal(showChars(textInput), "!a|b|c|d");
  equal(textInput.length, 4);
  equal(textInput.pos, 4);
  isTrue(textInput.completed);
});

test("ignore the whitespace key", () => {
  const textInput = new TextInput("abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: false,
  });

  equal(textInput.appendChar(100, Space, 100), Feedback.Succeeded);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(200, A, 101), Feedback.Succeeded);
  equal(showSteps(textInput), "a,200,101");
  equal(showChars(textInput), "a|[b]|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);

  equal(textInput.appendChar(300, Space, 100), Feedback.Succeeded);
  equal(showSteps(textInput), "a,200,101");
  equal(showChars(textInput), "a|[b]|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);

  equal(textInput.appendChar(400, B, 102), Feedback.Succeeded);
  equal(showSteps(textInput), "a,200,101|b,400,102");
  equal(showChars(textInput), "a|b|[c]");
  equal(textInput.length, 3);
  equal(textInput.pos, 2);
  isFalse(textInput.completed);
});

test("space in garbage", () => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
    spaceSkipsWords: false,
  });

  equal(textInput.appendChar(100, X, 100), Feedback.Failed);
  equal(textInput.appendChar(200, Space, 100), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "*x|* |[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.clearChar(), Feedback.Succeeded);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "*x|[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.clearChar(), Feedback.Succeeded);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(500, A, 101), Feedback.Recovered);
  equal(showSteps(textInput), "!a,500,101");
  equal(showChars(textInput), "!a|[b]|c");
  equal(textInput.length, 3);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);
});

test("space skips words at the beginning of a text, ignore space", () => {
  const textInput = new TextInput("abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, Space, 100), Feedback.Succeeded);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[a]|b|c");
  isFalse(textInput.completed);
});

test("space skips words at the beginning of a word, ignore space", () => {
  const textInput = new TextInput("x abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, X, 101), Feedback.Succeeded);
  equal(textInput.appendChar(200, Space, 102), Feedback.Succeeded);
  equal(showSteps(textInput), "x,100,101| ,200,102");
  equal(showChars(textInput), "x| |[a]|b|c");
  isFalse(textInput.completed);

  equal(textInput.appendChar(300, Space, 103), Feedback.Succeeded);
  equal(showSteps(textInput), "x,100,101| ,200,102");
  equal(showChars(textInput), "x| |[a]|b|c");
  isFalse(textInput.completed);
});

test("space skips words at the beginning of a text, skip after error", () => {
  const textInput = new TextInput("abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, X, 101), Feedback.Failed);
  equal(textInput.appendChar(200, Space, 102), Feedback.Recovered);
  equal(showSteps(textInput), "!a,200,0|!b,200,0|!c,200,0");
  equal(showChars(textInput), "!a|!b|!c");
  isTrue(textInput.completed);
});

test("space skips words at the beginning of a word, skip after error", () => {
  const textInput = new TextInput("x abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, X, 101), Feedback.Succeeded);
  equal(textInput.appendChar(200, Space, 102), Feedback.Succeeded);
  equal(showSteps(textInput), "x,100,101| ,200,102");
  equal(showChars(textInput), "x| |[a]|b|c");
  isFalse(textInput.completed);

  equal(textInput.appendChar(300, X, 103), Feedback.Failed);
  equal(textInput.appendChar(400, Space, 104), Feedback.Recovered);
  equal(showSteps(textInput), "x,100,101| ,200,102|!a,400,0|!b,400,0|!c,400,0");
  equal(showChars(textInput), "x| |!a|!b|!c");
  isTrue(textInput.completed);
});

test("space skips words in the middle of a word, skip word", () => {
  const textInput = new TextInput("x abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, X, 101), Feedback.Succeeded);
  equal(textInput.appendChar(200, Space, 102), Feedback.Succeeded);
  equal(textInput.appendChar(300, A, 103), Feedback.Succeeded);
  equal(showSteps(textInput), "x,100,101| ,200,102|a,300,103");
  equal(showChars(textInput), "x| |a|[b]|c");
  isFalse(textInput.completed);

  equal(textInput.appendChar(400, Space, 104), Feedback.Recovered);
  equal(
    showSteps(textInput),
    "x,100,101| ,200,102|a,300,103|!b,400,0|!c,400,0",
  );
  equal(showChars(textInput), "x| |a|!b|!c");
  isTrue(textInput.completed);
});

test("space skips words at the beginning of a text, remove garbage", () => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, X, 101), Feedback.Failed);
  equal(showSteps(textInput), "");
  equal(showChars(textInput), "*x|[a]|b|c");
  equal(textInput.appendChar(200, Space, 102), Feedback.Recovered);
  equal(showSteps(textInput), "!a,200,0|!b,200,0|!c,200,0");
  equal(showChars(textInput), "!a|!b|!c");
  isTrue(textInput.completed);
});

test("space skips words in the middle of a word, remove garbage", () => {
  const textInput = new TextInput("x abc", {
    stopOnError: false,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(textInput.appendChar(100, X, 101), Feedback.Succeeded);
  equal(textInput.appendChar(200, Space, 102), Feedback.Succeeded);
  equal(textInput.appendChar(300, A, 103), Feedback.Succeeded);
  equal(textInput.appendChar(300, X, 104), Feedback.Failed);
  equal(showSteps(textInput), "x,100,101| ,200,102|a,300,103");
  equal(showChars(textInput), "x| |a|*x|[b]|c");
  isFalse(textInput.completed);

  equal(textInput.appendChar(400, Space, 105), Feedback.Recovered);
  equal(
    showSteps(textInput),
    "x,100,101| ,200,102|a,300,103|!b,400,0|!c,400,0",
  );
  equal(showChars(textInput), "x| |a|!b|!c");
  isTrue(textInput.completed);
});

test("normalize characters", () => {
  const check = (text: string, input: string) => {
    const textInput = new TextInput(text, {
      stopOnError: true,
      forgiveErrors: false,
      spaceSkipsWords: false,
    });
    equal(textInput.text, text);
    let timeStamp = 0;
    for (const codePoint of toCodePoints(input)) {
      equal(
        textInput.appendChar((timeStamp += 100), codePoint, 100),
        Feedback.Succeeded,
      );
    }
  };

  check(`‘’`, `''`);
  check(`‘’`, `‘’`);
  check(`“”`, `""`);
  check(`“”`, `“”`);
  check(`«»`, `""`);
  check(`«»`, `«»`);
  check(`¿?¡!`, `??!!`);
  check(`¿?¡!`, `¿?¡!`);
});

test("whitespace", () => {
  const textInput = new TextInput("a  ", {
    stopOnError: true,
    forgiveErrors: false,
    spaceSkipsWords: false,
  });

  equal(textInput.appendChar(100, A, 100), Feedback.Succeeded);
  equal(textInput.appendChar(200, Space, 100), Feedback.Succeeded);
  equal(textInput.appendChar(300, Space, 100), Feedback.Succeeded);
  equal(textInput.length, 3);
  equal(textInput.pos, 3);
  isTrue(textInput.completed);
});

test("emoji", () => {
  const textInput = new TextInput("🍬🍭", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  equal(showSteps(textInput), "");
  equal(showChars(textInput), "[🍬]|🍭");
  equal(textInput.length, 2);
  equal(textInput.pos, 0);
  isFalse(textInput.completed);

  equal(textInput.appendChar(100, 0x1f36c, 101), Feedback.Succeeded);
  equal(showSteps(textInput), "🍬,100,101");
  equal(showChars(textInput), "🍬|[🍭]");
  equal(textInput.length, 2);
  equal(textInput.pos, 1);
  isFalse(textInput.completed);

  equal(textInput.appendChar(200, 0x1f36d, 102), Feedback.Succeeded);
  equal(showSteps(textInput), "🍬,100,101|🍭,200,102");
  equal(showChars(textInput), "🍬|🍭");
  equal(textInput.length, 2);
  equal(textInput.pos, 2);
  isTrue(textInput.completed);
});

function showSteps({ steps }: TextInput) {
  return steps
    .map(({ codePoint, timeStamp, timeToType, typo }) => {
      let s = String.fromCodePoint(codePoint);
      s = `${s},${timeStamp},${timeToType}`;
      if (typo) {
        s = `!${s}`;
      }
      return s;
    })
    .join("|");
}

function showChars({ chars }: TextInput) {
  return chars
    .map(({ codePoint, attrs }) => {
      let s = String.fromCodePoint(codePoint);
      if (attrs & Attr.Miss) {
        s = `!${s}`;
      }
      if (attrs & Attr.Garbage) {
        s = `*${s}`;
      }
      if (attrs & Attr.Cursor) {
        s = `[${s}]`;
      }
      return s;
    })
    .join("|");
}
