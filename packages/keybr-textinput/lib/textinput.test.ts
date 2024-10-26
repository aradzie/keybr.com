import { toCodePoints } from "@keybr/unicode";
import test from "ava";
import { TextInput } from "./textinput.ts";
import { Attr, type Char, Feedback, type Step } from "./types.ts";

const A = 0x0061;
const B = 0x0062;
const C = 0x0063;
const D = 0x0064;
const E = 0x0065;
const F = 0x0066;
const T = 0x0074;
const X = 0x0078;
const Space = 0x0020;

test("allow empty text", (t) => {
  const textInput = new TextInput("", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  t.is(textInput.length, 0);
  t.is(textInput.pos, 0);
  t.true(textInput.completed);

  t.throws(() => {
    textInput.appendChar(A, 100);
  });

  t.throws(() => {
    textInput.appendChar(Space, 100);
  });
});

test("advance to completion", (t) => {
  const textInput = new TextInput("text", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  // Initial state.

  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 1.

  t.is(textInput.appendChar(T, 100), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "t,100");
  t.is(charsString(textInput.chars), "t|[e]|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.appendChar(E, 200), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "t,100|e,200");
  t.is(charsString(textInput.chars), "t|e|[x]|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 2);
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.appendChar(X, 300), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "t,100|e,200|x,300");
  t.is(charsString(textInput.chars), "t|e|x|[t]");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 3);
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.appendChar(T, 400), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "t,100|e,200|x,300|t,400");
  t.is(charsString(textInput.chars), "t|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 4);
  t.true(textInput.completed);
});

test("accumulate and delete garbage", (t) => {
  const textInput = new TextInput("text", {
    stopOnError: false,
    forgiveErrors: false,
    spaceSkipsWords: true,
  });

  // Initial state.

  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 1.

  t.is(textInput.appendChar(A, 100), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*a|[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.appendChar(B, 200), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*a|*b|[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.appendChar(C, 300), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*a|*b|*c|[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.appendChar(T, 400), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*a|*b|*c|*t|[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 5.

  t.is(textInput.clearChar(), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*a|*b|*c|[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 6.

  t.is(textInput.clearChar(), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*a|*b|[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 7.

  t.is(textInput.clearChar(), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*a|[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 8.

  t.is(textInput.clearChar(), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 9.

  t.is(textInput.appendChar(T, 900), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "!t,900");
  t.is(charsString(textInput.chars), "!t|[e]|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);
});

test("limit garbage length", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
    spaceSkipsWords: true,
  });

  for (let i = 1; i <= 100; i++) {
    t.is(textInput.appendChar(X, i * 100), Feedback.Failed);
  }

  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*x|*x|*x|*x|*x|*x|*x|*x|*x|*x|[a]|b|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);
});

test("handle backspace at the start of a word", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
    spaceSkipsWords: true,
  });

  // Step 1.

  t.is(textInput.appendChar(X, 100), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*x|[a]|b|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.clearChar(), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.clearChar(), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.appendChar(A, 400), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "!a,400");
  t.is(charsString(textInput.chars), "!a|[b]|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);
});

test("handle backspace in the middle of a word", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
    spaceSkipsWords: true,
  });

  // Step 1.

  t.is(textInput.appendChar(A, 100), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "a,100");
  t.is(charsString(textInput.chars), "a|[b]|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.appendChar(X, 200), Feedback.Failed);
  t.is(stepsString(textInput.steps), "a,100");
  t.is(charsString(textInput.chars), "a|*x|[b]|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.clearChar(), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "a,100");
  t.is(charsString(textInput.chars), "a|[b]|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.clearChar(), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "a,100");
  t.is(charsString(textInput.chars), "a|[b]|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);

  // Step 5.

  t.is(textInput.appendChar(B, 500), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "a,100|!b,500");
  t.is(charsString(textInput.chars), "a|!b|[c]");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 2);
  t.false(textInput.completed);
});

test("forgive an inserted character", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  // Initial state.

  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 1.

  t.is(textInput.appendChar(X, 100), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.appendChar(A, 200), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "!a,200");
  t.is(charsString(textInput.chars), "!a|[b]|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.appendChar(B, 300), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "!a,200|b,300");
  t.is(charsString(textInput.chars), "!a|b|[c]");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 2);
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.appendChar(C, 400), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "!a,200|b,300|c,400");
  t.is(charsString(textInput.chars), "!a|b|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 3);
  t.true(textInput.completed);
});

test("forgive a skipped character", (t) => {
  const textInput = new TextInput("abcd", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  // Step 1.

  t.is(textInput.appendChar(B, 100), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c|d");
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.appendChar(C, 200), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c|d");
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.appendChar(D, 300), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "!a,100|b,100|c,200|d,300");
  t.is(charsString(textInput.chars), "!a|b|c|d");
  t.true(textInput.completed);
});

test("forgive a replaced character", (t) => {
  const textInput = new TextInput("abcd", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  // Step 1.

  t.is(textInput.appendChar(X, 100), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c|d");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 2.

  t.is(textInput.appendChar(B, 200), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c|d");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 3.

  t.is(textInput.appendChar(C, 300), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c|d");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  // Step 4.

  t.is(textInput.appendChar(D, 400), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "!a,100|b,200|c,300|d,400");
  t.is(charsString(textInput.chars), "!a|b|c|d");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 4);
  t.true(textInput.completed);
});

test("recover from a forgiven error", (t) => {
  const textInput = new TextInput("abcde", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  textInput.appendChar(X, 100);
  textInput.appendChar(B, 200);
  textInput.appendChar(C, 300);
  textInput.appendChar(D, 400);

  t.is(textInput.appendChar(E, 500), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "!a,100|b,200|c,300|d,400|e,500");
  t.is(charsString(textInput.chars), "!a|b|c|d|e");
  t.is(textInput.length, 5);
  t.is(textInput.pos, 5);
  t.true(textInput.completed);
});

test("ignore the whitespace key", (t) => {
  const textInput = new TextInput("text", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: false,
  });

  t.is(textInput.appendChar(Space, 100), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[t]|e|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  t.is(textInput.appendChar(T, 200), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "t,200");
  t.is(charsString(textInput.chars), "t|[e]|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);

  t.is(textInput.appendChar(Space, 300), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "t,200");
  t.is(charsString(textInput.chars), "t|[e]|x|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);

  t.is(textInput.appendChar(E, 400), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "t,200|e,400");
  t.is(charsString(textInput.chars), "t|e|[x]|t");
  t.is(textInput.length, 4);
  t.is(textInput.pos, 2);
  t.false(textInput.completed);
});

test("space in garbage", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: false,
    spaceSkipsWords: false,
  });

  t.is(textInput.appendChar(X, 100), Feedback.Failed);
  t.is(textInput.appendChar(Space, 200), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*x|* |[a]|b|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  t.is(textInput.clearChar(), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*x|[a]|b|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  t.is(textInput.clearChar(), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  t.is(textInput.appendChar(A, 500), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "!a,500");
  t.is(charsString(textInput.chars), "!a|[b]|c");
  t.is(textInput.length, 3);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);
});

test("space skips words at the beginning of a text, ignore space", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  t.is(textInput.appendChar(Space, 100), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[a]|b|c");
  t.false(textInput.completed);
});

test("space skips words at the beginning of a word, ignore space", (t) => {
  const textInput = new TextInput("x abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  t.is(textInput.appendChar(X, 100), Feedback.Succeeded);
  t.is(textInput.appendChar(Space, 200), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "x,100| ,200");
  t.is(charsString(textInput.chars), "x| |[a]|b|c");
  t.false(textInput.completed);

  t.is(textInput.appendChar(Space, 300), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "x,100| ,200");
  t.is(charsString(textInput.chars), "x| |[a]|b|c");
  t.false(textInput.completed);
});

test("space skips words at the beginning of a text, skip after error", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  t.is(textInput.appendChar(X, 100), Feedback.Failed);
  t.is(textInput.appendChar(Space, 200), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "!a,200|!b,200|!c,200");
  t.is(charsString(textInput.chars), "!a|!b|!c");
  t.true(textInput.completed);
});

test("space skips words at the beginning of a word, skip after error", (t) => {
  const textInput = new TextInput("x abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  t.is(textInput.appendChar(X, 100), Feedback.Succeeded);
  t.is(textInput.appendChar(Space, 200), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "x,100| ,200");
  t.is(charsString(textInput.chars), "x| |[a]|b|c");
  t.false(textInput.completed);

  t.is(textInput.appendChar(X, 300), Feedback.Failed);
  t.is(textInput.appendChar(Space, 400), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "x,100| ,200|!a,400|!b,400|!c,400");
  t.is(charsString(textInput.chars), "x| |!a|!b|!c");
  t.true(textInput.completed);
});

test("space skips words in the middle of a word, skip word", (t) => {
  const textInput = new TextInput("x abc", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  t.is(textInput.appendChar(X, 100), Feedback.Succeeded);
  t.is(textInput.appendChar(Space, 200), Feedback.Succeeded);
  t.is(textInput.appendChar(A, 300), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "x,100| ,200|a,300");
  t.is(charsString(textInput.chars), "x| |a|[b]|c");
  t.false(textInput.completed);

  t.is(textInput.appendChar(Space, 400), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "x,100| ,200|a,300|!b,400|!c,400");
  t.is(charsString(textInput.chars), "x| |a|!b|!c");
  t.true(textInput.completed);
});

test("space skips words at the beginning of a text, remove garbage", (t) => {
  const textInput = new TextInput("abc", {
    stopOnError: false,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  t.is(textInput.appendChar(X, 100), Feedback.Failed);
  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "*x|[a]|b|c");
  t.is(textInput.appendChar(Space, 200), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "!a,200|!b,200|!c,200");
  t.is(charsString(textInput.chars), "!a|!b|!c");
  t.true(textInput.completed);
});

test("space skips words in the middle of a word, remove garbage", (t) => {
  const textInput = new TextInput("x abc", {
    stopOnError: false,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  t.is(textInput.appendChar(X, 100), Feedback.Succeeded);
  t.is(textInput.appendChar(Space, 200), Feedback.Succeeded);
  t.is(textInput.appendChar(A, 300), Feedback.Succeeded);
  t.is(textInput.appendChar(X, 300), Feedback.Failed);
  t.is(stepsString(textInput.steps), "x,100| ,200|a,300");
  t.is(charsString(textInput.chars), "x| |a|*x|[b]|c");
  t.false(textInput.completed);

  t.is(textInput.appendChar(Space, 400), Feedback.Recovered);
  t.is(stepsString(textInput.steps), "x,100| ,200|a,300|!b,400|!c,400");
  t.is(charsString(textInput.chars), "x| |a|!b|!c");
  t.true(textInput.completed);
});

test("normalize characters", (t) => {
  const check = (text: string, input: string) => {
    const textInput = new TextInput(text, {
      stopOnError: true,
      forgiveErrors: false,
      spaceSkipsWords: false,
    });
    t.is(textInput.text, text);
    let timeStamp = 0;
    for (const codePoint of toCodePoints(input)) {
      t.is(
        textInput.appendChar(codePoint, (timeStamp += 100)),
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

test("whitespace", (t) => {
  const textInput = new TextInput("a  ", {
    stopOnError: true,
    forgiveErrors: false,
    spaceSkipsWords: false,
  });

  t.is(textInput.appendChar(A, 100), Feedback.Succeeded);
  t.is(textInput.appendChar(Space, 200), Feedback.Succeeded);
  t.is(textInput.appendChar(Space, 300), Feedback.Succeeded);
  t.is(textInput.length, 3);
  t.is(textInput.pos, 3);
  t.true(textInput.completed);
});

test("emoji", (t) => {
  const textInput = new TextInput("🍬🍭", {
    stopOnError: true,
    forgiveErrors: true,
    spaceSkipsWords: true,
  });

  t.is(stepsString(textInput.steps), "");
  t.is(charsString(textInput.chars), "[🍬]|🍭");
  t.is(textInput.length, 2);
  t.is(textInput.pos, 0);
  t.false(textInput.completed);

  t.is(textInput.appendChar(0x1f36c, 100), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "🍬,100");
  t.is(charsString(textInput.chars), "🍬|[🍭]");
  t.is(textInput.length, 2);
  t.is(textInput.pos, 1);
  t.false(textInput.completed);

  t.is(textInput.appendChar(0x1f36d, 200), Feedback.Succeeded);
  t.is(stepsString(textInput.steps), "🍬,100|🍭,200");
  t.is(charsString(textInput.chars), "🍬|🍭");
  t.is(textInput.length, 2);
  t.is(textInput.pos, 2);
  t.true(textInput.completed);
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
