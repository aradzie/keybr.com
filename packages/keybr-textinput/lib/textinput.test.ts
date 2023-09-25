import test from "ava";
import { TextInput } from "./textinput.ts";
import {
  attrCursor,
  attrGarbage,
  attrMiss,
  type Char,
  Feedback,
  type Step,
} from "./types.ts";

const A = 0x61;
const B = 0x62;
const C = 0x63;
const D = 0x64;
const T = 0x74;
const E = 0x65;
const X = 0x78;
const Backspace = 0x08;
const Tab = 0x09;
const LineFeed = 0x0a;
const CarriageReturn = 0x0d;

test("allow empty text", (t) => {
  t.notThrows(() => {
    new TextInput("", {
      stopOnError: true,
      forgiveErrors: true,
    });
  });
});

test("cannot advance past the end of text", (t) => {
  const textInput = new TextInput("", {
    stopOnError: true,
    forgiveErrors: true,
  });

  t.true(textInput.completed);

  t.throws(() => {
    textInput.step(A, 100);
  });
});

test("advance to completion", (t) => {
  const textInput = new TextInput("text", {
    stopOnError: true,
    forgiveErrors: true,
  });

  // Initial state.

  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[t]|e|x|t");
  t.false(textInput.completed);

  // Step 1.

  t.is(textInput.step(T, 100), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "t,100");
  t.is(charsString(textInput.getChars()), "t|[e]|x|t");
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.step(E, 200), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "t,100|e,200");
  t.is(charsString(textInput.getChars()), "t|e|[x]|t");
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.step(X, 300), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "t,100|e,200|x,300");
  t.is(charsString(textInput.getChars()), "t|e|x|[t]");
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.step(T, 400), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "t,100|e,200|x,300|t,400");
  t.is(charsString(textInput.getChars()), "t|e|x|t");
  t.true(textInput.completed);
});

test("accumulate and delete garbage", (t) => {
  const textInput = new TextInput("text", {
    stopOnError: false,
    forgiveErrors: false,
  });

  // Initial state.

  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[t]|e|x|t");
  t.false(textInput.completed);

  // Step 1.

  t.is(textInput.step(A, 100), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "*a|[t]|e|x|t");
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.step(B, 200), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "*a|*b|[t]|e|x|t");
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.step(C, 300), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "*a|*b|*c|[t]|e|x|t");
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.step(T, 400), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "*a|*b|*c|*t|[t]|e|x|t");
  t.false(textInput.completed);

  // Step 5.

  t.is(textInput.step(Backspace, 500), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "*a|*b|*c|[t]|e|x|t");
  t.false(textInput.completed);

  // Step 6.

  t.is(textInput.step(Backspace, 600), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "*a|*b|[t]|e|x|t");
  t.false(textInput.completed);

  // Step 7.

  t.is(textInput.step(Backspace, 700), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "*a|[t]|e|x|t");
  t.false(textInput.completed);

  // Step 8.

  t.is(textInput.step(Backspace, 800), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[t]|e|x|t");
  t.false(textInput.completed);

  // Step 9.

  t.is(textInput.step(T, 900), Feedback.Recovered);
  t.is(stepsString(textInput.getSteps()), "!t,900");
  t.is(charsString(textInput.getChars()), "!t|[e]|x|t");
  t.false(textInput.completed);
});

test("emoji", (t) => {
  const textInput = new TextInput("🍬🍭", {
    stopOnError: true,
    forgiveErrors: true,
  });

  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[🍬]|🍭");
  t.false(textInput.completed);

  t.is(textInput.step(0x1f36c, 100), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "🍬,100");
  t.is(charsString(textInput.getChars()), "🍬|[🍭]");
  t.false(textInput.completed);

  t.is(textInput.step(0x1f36d, 200), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "🍬,100|🍭,200");
  t.is(charsString(textInput.getChars()), "🍬|🍭");
  t.true(textInput.completed);
});

test("handle backspace at the start of text", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
  });

  // Step 1.

  t.is(textInput.step(X, 100), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "*x|[a]|b|c");
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.step(Backspace, 200), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[a]|b|c");
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.step(Backspace, 300), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[a]|b|c");
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.step(A, 400), Feedback.Recovered);
  t.is(stepsString(textInput.getSteps()), "!a,400");
  t.is(charsString(textInput.getChars()), "!a|[b]|c");
  t.false(textInput.completed);
});

test("handle backspace in the middle of text", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
  });

  // Step 1.

  t.is(textInput.step(A, 100), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "a,100");
  t.is(charsString(textInput.getChars()), "a|[b]|c");
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.step(X, 200), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "a,100");
  t.is(charsString(textInput.getChars()), "a|*x|[b]|c");
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.step(Backspace, 300), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "a,100");
  t.is(charsString(textInput.getChars()), "a|[b]|c");
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.step(Backspace, 400), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "a,100");
  t.is(charsString(textInput.getChars()), "a|[b]|c");
  t.false(textInput.completed);

  // Step 5.

  t.is(textInput.step(B, 500), Feedback.Recovered);
  t.is(stepsString(textInput.getSteps()), "a,100|!b,500");
  t.is(charsString(textInput.getChars()), "a|!b|[c]");
  t.false(textInput.completed);
});

test("limit garbage length", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
  });

  for (let i = 1; i <= 100; i++) {
    t.is(textInput.step(X, i * 100), Feedback.Failed);
  }

  t.is(stepsString(textInput.getSteps()), "");
  t.is(
    charsString(textInput.getChars()),
    "*x|*x|*x|*x|*x|*x|*x|*x|*x|*x|[a]|b|c",
  );
  t.false(textInput.completed);
});

test("forgive an inserted character", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: true,
    forgiveErrors: true,
  });

  // Initial state.

  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[a]|b|c");
  t.false(textInput.completed);

  // Step 1.

  t.is(textInput.step(X, 100), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[a]|b|c");
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.step(A, 200), Feedback.Recovered);
  t.is(stepsString(textInput.getSteps()), "!a,200");
  t.is(charsString(textInput.getChars()), "!a|[b]|c");
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.step(B, 300), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "!a,200|b,300");
  t.is(charsString(textInput.getChars()), "!a|b|[c]");
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.step(C, 400), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "!a,200|b,300|c,400");
  t.is(charsString(textInput.getChars()), "!a|b|c");
  t.true(textInput.completed);
});

test("forgive a skipped character", (t) => {
  const textInput = new TextInput("abcd", {
    stopOnError: true,
    forgiveErrors: true,
  });

  // Step 1.

  t.is(textInput.step(B, 100), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[a]|b|c|d");
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.step(C, 200), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[a]|b|c|d");
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.step(D, 300), Feedback.Recovered);
  t.is(stepsString(textInput.getSteps()), "!a,100|b,100|c,200|d,300");
  t.is(charsString(textInput.getChars()), "!a|b|c|d");
  t.true(textInput.completed);
});

test("forgive a replaced character", (t) => {
  const textInput = new TextInput("abcd", {
    stopOnError: true,
    forgiveErrors: true,
  });

  // Step 1.

  t.is(textInput.step(X, 100), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[a]|b|c|d");
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.step(B, 200), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[a]|b|c|d");
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.step(C, 300), Feedback.Failed);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[a]|b|c|d");
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.step(D, 400), Feedback.Recovered);
  t.is(stepsString(textInput.getSteps()), "!a,100|b,200|c,300|d,400");
  t.is(charsString(textInput.getChars()), "!a|b|c|d");
  t.true(textInput.completed);
});

test("recover from a forgiven error", (t) => {
  const textInput = new TextInput("abcde", {
    stopOnError: true,
    forgiveErrors: true,
  });

  textInput.step(X, 100);
  textInput.step(B, 200);
  textInput.step(C, 300);
  textInput.step(D, 400);

  t.is(textInput.step(E, 500), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "!a,100|b,200|c,300|d,400|e,500");
  t.is(charsString(textInput.getChars()), "!a|b|c|d|e");
  t.true(textInput.completed);
});

test("ignore whitespace keys at the start of text", (t) => {
  const textInput = new TextInput("text", {
    stopOnError: true,
    forgiveErrors: false,
  });

  t.is(textInput.step(0x0a, 100), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[t]|e|x|t");
  t.false(textInput.completed);

  t.is(textInput.step(0x20, 100), Feedback.Succeeded);
  t.is(stepsString(textInput.getSteps()), "");
  t.is(charsString(textInput.getChars()), "[t]|e|x|t");
  t.false(textInput.completed);
});

test("normalize characters", (t) => {
  {
    const textInput = new TextInput("a ", {
      stopOnError: true,
      forgiveErrors: false,
    });

    t.is(textInput.step(A, 100), Feedback.Succeeded);
    t.is(textInput.step(Tab, 200), Feedback.Succeeded);
    t.is(stepsString(textInput.getSteps()), "a,100| ,200");
    t.is(charsString(textInput.getChars()), "a| ");
    t.true(textInput.completed);
  }

  {
    const textInput = new TextInput("a ", {
      stopOnError: true,
      forgiveErrors: false,
    });

    t.is(textInput.step(A, 100), Feedback.Succeeded);
    t.is(textInput.step(LineFeed, 200), Feedback.Succeeded);
    t.is(stepsString(textInput.getSteps()), "a,100| ,200");
    t.is(charsString(textInput.getChars()), "a| ");
    t.true(textInput.completed);
  }

  {
    const textInput = new TextInput("a ", {
      stopOnError: true,
      forgiveErrors: false,
    });

    t.is(textInput.step(A, 100), Feedback.Succeeded);
    t.is(textInput.step(CarriageReturn, 200), Feedback.Succeeded);
    t.is(stepsString(textInput.getSteps()), "a,100| ,200");
    t.is(charsString(textInput.getChars()), "a| ");
    t.true(textInput.completed);
  }

  {
    const textInput = new TextInput("«a»", {
      stopOnError: true,
      forgiveErrors: false,
    });

    t.is(textInput.step(0x0022, 100), Feedback.Succeeded);
    t.is(textInput.step(A, 200), Feedback.Succeeded);
    t.is(textInput.step(0x0022, 300), Feedback.Succeeded);
    t.is(stepsString(textInput.getSteps()), "«,100|a,200|»,300");
    t.is(charsString(textInput.getChars()), "«|a|»");
    t.true(textInput.completed);
  }
});

function stepsString(steps: readonly Step[]): string {
  return steps
    .map(({ codePoint, timeStamp, typo }) => {
      let s = String.fromCodePoint(codePoint);
      s = `${s},${timeStamp}`;
      if (typo) {
        s = `!${s}`;
      }
      return s;
    })
    .join("|");
}

function charsString(chars: readonly Char[]): string {
  return chars
    .map(({ codePoint, attrs }) => {
      let s = String.fromCodePoint(codePoint);
      if (attrs & attrMiss) {
        s = `!${s}`;
      }
      if (attrs & attrGarbage) {
        s = `*${s}`;
      }
      if (attrs & attrCursor) {
        s = `[${s}]`;
      }
      return s;
    })
    .join("|");
}
