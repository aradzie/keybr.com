import { describe, it, test } from "node:test";
import { Layout, loadKeyboard } from "@keybr/keyboard";
import { FakePhoneticModel, type Letter } from "@keybr/phonetic-model";
import { makeKeyStatsMap } from "@keybr/result";
import { Settings } from "@keybr/settings";
import { deepEqual, doesNotInclude, equal, includes, ok } from "rich-assert";
import { fakeKeyStatsMap, printLessonKeys } from "./fakes.ts";
import { GuidedLesson } from "./guided.ts";
import { LessonKey } from "./key.ts";
import { lessonProps } from "./settings.ts";

test("provide key set", () => {
  const settings = new Settings();
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel(["uno", "due", "tre"]);
  const lesson = new GuidedLesson(settings, keyboard, model, []);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

  deepEqual(lessonKeys.findIncludedKeys(), [
    new LessonKey({
      letter: FakePhoneticModel.letter1,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: true,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter2,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter3,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter4,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter5,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter6,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
  ]);
  deepEqual(lessonKeys.findExcludedKeys(), [
    new LessonKey({
      letter: FakePhoneticModel.letter7,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: false,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter8,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: false,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter9,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: false,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter10,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: false,
      isFocused: false,
      isForced: false,
    }),
  ]);
  deepEqual(
    lessonKeys.findFocusedKey(),
    new LessonKey({
      letter: FakePhoneticModel.letter1,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: true,
      isForced: false,
    }),
  );
});

describe("generate text from a broken phonetic model", () => {
  const settings = new Settings();
  const keyboard = loadKeyboard(Layout.EN_US);

  it("should generate from empty words", () => {
    const model = new FakePhoneticModel([""]);
    const lesson = new GuidedLesson(settings, keyboard, model, []);
    const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

    equal(
      lesson.generate(lessonKeys, model.rng),
      "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ?",
    );
  });

  it("should generate from repeating words", () => {
    const model = new FakePhoneticModel(["x"]);
    const lesson = new GuidedLesson(settings, keyboard, model, []);
    const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

    equal(
      lesson.generate(lessonKeys, model.rng),
      "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x",
    );
  });
});

test("generate text with pseudo words", () => {
  const settings = new Settings().set(lessonProps.guided.naturalWords, false);
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel(["uno", "due", "tre"]);
  const lesson = new GuidedLesson(settings, keyboard, model, []);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

  equal(
    lesson.generate(lessonKeys, model.rng),
    "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno",
  );
});

test("generate text with natural words", () => {
  const settings = new Settings().set(lessonProps.guided.naturalWords, true);
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel(["uno", "due", "tre"]);
  const lesson = new GuidedLesson(settings, keyboard, model, [
    "abcaa",
    "abcab",
    "abcac",
    "abcad",
    "abcae",
    "abcaf",
    "abcag",
    "abcah",
    "abcai",
    "abcaj",
    "abcba",
    "abcbb",
    "abcbc",
    "abcbd",
    "abcbe",
  ]);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

  equal(
    lesson.generate(lessonKeys, model.rng),
    "abcaf abcbe abcaa abcaf abcbe abcaa abcaf abcbe abcaa abcaf abcbe abcaa " +
      "abcaf abcbe abcaa abcaf abcbe abcaa abcaf abcbe",
  );
});

describe("train second key", () => {
  const keyboard = loadKeyboard(Layout.EN_US);
  const {
    letter1, // A
    letter2, // B - weakest, focused
    letter3, // C
    letter4, // D
    letter5, // E - second-weakest, or already attempted and trailing
    letter6, // F
    letter7, // G - the next locked letter
    letter8, // H
    letter9, // I
    letter10, // J
  } = FakePhoneticModel;

  describe("while a letter remains locked", () => {
    // The focused key's words are built only from a, b, c, d, e, f, and the
    // next locked letter's words also contain g, so the two sets can be
    // told apart with a simple substring check.
    const mainWords = [
      "abcdea",
      "abcdeb",
      "abcdec",
      "abcdfa",
      "abcdfb",
      "abcdfc",
      "abcdaa",
      "abcdab",
      "abcdac",
      "abcdad",
      "abcdae",
      "abcdaf",
      "abcdba",
      "abcdbb",
      "abcdbc",
    ];
    const nextWords = [
      "efgab",
      "efgac",
      "efgad",
      "efgae",
      "efgaf",
      "efgba",
      "efgbb",
      "efgbc",
      "efgbd",
      "efgbe",
      "efgca",
      "efgcb",
      "efgcc",
      "efgcd",
      "efgce",
    ];

    function setup(trainSecondKey: boolean) {
      const settings = new Settings()
        .set(lessonProps.guided.naturalWords, true)
        .set(lessonProps.guided.trainSecondKey, trainSecondKey);
      const model = new FakePhoneticModel();
      const lesson = new GuidedLesson(settings, keyboard, model, [
        ...mainWords,
        ...nextWords,
      ]);
      const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));
      return { lesson, lessonKeys, model };
    }

    it("does not preview the next locked letter when disabled", () => {
      const { lesson, lessonKeys, model } = setup(false);

      equal(printLessonKeys(lessonKeys), "[A]BCDEF");
      doesNotInclude(lesson.generate(lessonKeys, model.rng), "efg");
    });

    it("previews the next locked letter when enabled", () => {
      const { lesson, lessonKeys, model } = setup(true);

      equal(printLessonKeys(lessonKeys), "[A]BCDEF(G)");
      includes(lesson.generate(lessonKeys, model.rng), "efg");
    });
  });

  describe("once all letters are unlocked", () => {
    // The focused key's words are built only from a, b, c, d, and the
    // second-weakest key's words are built only from e, f, g, h, so the two
    // sets can be told apart with a simple substring check.
    const mainWords = [
      "abcd",
      "abdc",
      "acbd",
      "acdb",
      "adbc",
      "adcb",
      "bacd",
      "badc",
      "bcad",
      "bcda",
      "bdac",
      "bdca",
      "cabd",
      "cadb",
      "cbad",
    ];
    const secondWeakestWords = [
      "efgh",
      "efhg",
      "egfh",
      "eghf",
      "ehfg",
      "ehgf",
      "fegh",
      "fehg",
      "fgeh",
      "fghe",
      "fheg",
      "fhge",
      "gefh",
      "gehf",
      "gfeh",
    ];

    function setup(
      trainSecondKey: boolean,
      confidences: readonly [letter: LessonKey["letter"], confidence: number][],
    ) {
      const settings = new Settings()
        .set(lessonProps.guided.naturalWords, true)
        .set(lessonProps.guided.alphabetSize, 1) // all letters already unlocked
        .set(lessonProps.guided.trainSecondKey, trainSecondKey);
      const model = new FakePhoneticModel();
      const lesson = new GuidedLesson(settings, keyboard, model, [
        ...mainWords,
        ...secondWeakestWords,
      ]);
      const lessonKeys = lesson.update(
        fakeKeyStatsMap(
          settings,
          confidences.map(([letter, confidence]) => [
            letter,
            confidence,
            confidence,
          ]),
        ),
      );
      return { lesson, lessonKeys, model };
    }

    // B is the weakest key and E is the second-weakest; everyone else is
    // already above the target speed.
    const bWeakestEsecondWeakest: [LessonKey["letter"], number][] = [
      [letter1, 1],
      [letter2, 0.5],
      [letter3, 1],
      [letter4, 1],
      [letter5, 0.7],
      [letter6, 1],
      [letter7, 1],
      [letter8, 1],
      [letter9, 1],
      [letter10, 1],
    ];

    it("does not mark or mix in the second-weakest key when disabled", () => {
      const { lesson, lessonKeys, model } = setup(
        false,
        bWeakestEsecondWeakest,
      );

      equal(printLessonKeys(lessonKeys), "A[B]CDEF!G!H!I!J");
      doesNotInclude(lesson.generate(lessonKeys, model.rng), "e");
    });

    it("marks and mixes in the second-weakest key when enabled", () => {
      const { lesson, lessonKeys, model } = setup(true, bWeakestEsecondWeakest);

      equal(printLessonKeys(lessonKeys), "A[B]CD(E)F!G!H!I!J");
      includes(lesson.generate(lessonKeys, model.rng), "e");
    });

    it("has no effect when there is no second key below the target speed", () => {
      const { lesson, lessonKeys, model } = setup(true, [
        [letter1, 1],
        [letter2, 0.5], // the only key below the target speed
        [letter3, 1],
        [letter4, 1],
        [letter5, 1],
        [letter6, 1],
        [letter7, 1],
        [letter8, 1],
        [letter9, 1],
        [letter10, 1],
      ]);

      equal(printLessonKeys(lessonKeys), "A[B]CDEF!G!H!I!J");
      doesNotInclude(lesson.generate(lessonKeys, model.rng), "e");
    });
  });

  it("prefers an untested next locked letter over an already-attempted trailing key", () => {
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      true,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    // G has never been previewed at all, which is exactly when preview is
    // most valuable, so it wins the slot even over an already-attempted
    // trailing key.
    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 0.5, 0.5],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 0.7, 0.7],
        [letter6, 1, 1],
        [letter7, null, null],
        [letter8, null, null],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );

    equal(printLessonKeys(lessonKeys), "A[B]CDEF(G)");
  });

  it("lets well-evidenced letters recover past a stalled earlier key, except nextKey itself", () => {
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      true,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    // B (already included) hasn't taken its turn yet. G is nextKey -- its
    // own evidence might be nothing but thin preview reps, so it still has
    // to wait, previewed but locked. H and J have real, independent
    // evidence (e.g. recovered after a page reload, or mastered elsewhere)
    // and recover regardless of B's stall. I stays locked on its own
    // merits -- it's genuinely not yet confident.
    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 0.5, 0.5],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 1, 1],
        [letter6, 1, 1],
        [letter7, 1, 1],
        [letter8, 1, 1],
        [letter9, 0.6, 0.6],
        [letter10, 1, 1],
      ]),
    );

    equal(printLessonKeys(lessonKeys), "A[B]CDEF(G)HJ");
    ok(lessonKeys.find(letter7.codePoint)?.isIncluded === false);
    ok(lessonKeys.find(letter8.codePoint)?.isIncluded === true);
    ok(lessonKeys.find(letter9.codePoint)?.isIncluded === false);
    ok(lessonKeys.find(letter10.codePoint)?.isIncluded === true);
  });

  it("rotates the second focus as a preview improves past a trailing key", () => {
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      true,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    // E is trailing but nearly caught up (0.9), while G -- previewed as
    // the next locked letter -- is doing worse (0.3), so G should win the
    // second-focus slot instead of E.
    const struggling = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 0.5, 0.5],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 0.9, 0.9],
        [letter6, 1, 1],
        [letter7, 0.3, 0.3],
        [letter8, null, null],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );

    equal(printLessonKeys(struggling), "A[B]CDEF(G)");
    ok(struggling.find(letter7.codePoint)?.isIncluded === false);

    // G's preview reps have since improved past E, so the second focus
    // rotates to E, the now-weaker key, without unlocking G.
    const improved = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 0.5, 0.5],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 0.9, 0.9],
        [letter6, 1, 1],
        [letter7, 0.95, 0.95],
        [letter8, null, null],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );

    equal(printLessonKeys(improved), "A[B]CD(E)F");
    ok(improved.find(letter7.codePoint)?.isIncluded === false);
  });

  it("keeps the trailing key ahead of the preview on a confidence tie", () => {
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      true,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    // E (trailing) and G (previewed) are tied at 0.6; the trailing key
    // should keep the second-focus slot on a tie, not the preview.
    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 0.4, 0.4],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 0.6, 0.6],
        [letter6, 1, 1],
        [letter7, 0.6, 0.6],
        [letter8, null, null],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );

    equal(printLessonKeys(lessonKeys), "A[B]CD(E)F");
    ok(lessonKeys.find(letter7.codePoint)?.isIncluded === false);
  });

  it("skips a stale live confidence left by recoverKeys when picking the second key", () => {
    const settings = new Settings()
      .set(lessonProps.guided.trainSecondKey, true)
      .set(lessonProps.guided.recoverKeys, true);
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    // With recovery on, second-key selection reads live confidence. Both
    // B and E have null live confidence (no recent samples, despite once
    // being mastered); B still becomes the primary focus (null counts as
    // the weakest), but E must not win the second slot for the same
    // reason. G, the untested next-in-line letter, outranks F (a real but
    // weaker trailing candidate) for the same reason it always does.
    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, null, 1],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, null, 1],
        [letter6, 0.8, 1],
        [letter7, null, null],
        [letter8, null, null],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );

    equal(printLessonKeys(lessonKeys), "A[B]CDEF(G)");
  });

  it("unlocks the previewed letter on schedule regardless of how its preview reps went", () => {
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      true,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    // G has done poorly in preview (0.1), but per the PR description,
    // preview samples are never factored into unlocking it either way:
    // now that every previously-included key is above target, it's
    // simply G's turn.
    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 1, 1],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 1, 1],
        [letter6, 1, 1],
        [letter7, 0.1, 0.1],
        [letter8, null, null],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );

    equal(printLessonKeys(lessonKeys), "ABCDEF[G](H)");
  });

  it("still gives a fast typer's newly-previewed letter its own turn instead of unlocking it on one sample", () => {
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      true,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    // G is already fully confident (a fast typer can clear target speed
    // on the very first preview rep), but it still has to spend the one
    // new-unlock slot for this call like anyone else -- H hasn't been
    // previewed at all yet, so it stays locked. With every included key
    // now at confidence >= 1, G (the newest) is the fallback focus rather
    // than going dark.
    const first = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 1, 1],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 1, 1],
        [letter6, 1, 1],
        [letter7, 1, 1],
        [letter8, null, null],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );
    ok(first.find(letter7.codePoint)?.isIncluded === true);
    ok(first.find(letter8.codePoint)?.isIncluded === false);
    equal(printLessonKeys(first), "ABCDEF[G](H)");

    // Next call: H is now nextKey and, on its very first preview rep, is
    // already confident too -- but on a single sample that's not yet real
    // evidence, so it still has to win its own honest turn, not sneak in
    // on a thin preview reading. It does, because the chain (now including
    // G) is confident.
    const second = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 1, 1],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 1, 1],
        [letter6, 1, 1],
        [letter7, 1, 1],
        [letter8, 1, 1, 1],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );
    ok(second.find(letter7.codePoint)?.isIncluded === true);
    ok(second.find(letter8.codePoint)?.isIncluded === true);
    ok(second.find(letter9.codePoint)?.isIncluded === false);
    equal(printLessonKeys(second), "ABCDEFG[H](I)");
  });

  it("still unlocks an already-mastered next letter when the setting is off, but not one with too few samples", () => {
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      false,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    // With the setting off, G can only have gotten this confident from
    // some other lesson type, never from a preview, so it's safe to
    // unlock it right away like any other already-mastered key. H looks
    // just as confident, but on only 2 samples -- a single lucky rep
    // shouldn't be enough to count as mastery, so it must stay locked.
    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 0.5, 0.5],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 1, 1],
        [letter6, 1, 1],
        [letter7, 1, 1],
        [letter8, 1, 1, 2],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );

    equal(printLessonKeys(lessonKeys), "A[B]CDEFG");
    ok(lessonKeys.find(letter8.codePoint)?.isIncluded === false);
  });

  it("keeps nextKey locked no matter how much preview evidence it earns, while letting evidenced letters past it recover", () => {
    const settings = new Settings()
      .set(lessonProps.guided.naturalWords, false)
      .set(lessonProps.guided.trainSecondKey, true);
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    // While G remains locked, it is the one mixed in as the second key.
    const locked = lesson.update(makeKeyStatsMap(lesson.letters, []));

    equal(printLessonKeys(locked), "[A]BCDEF(G)");

    // G now has plenty of real preview samples, but that's nextKey's own
    // evidence, which never counts -- it stays locked regardless. B and E
    // are both still weak (E wins the second slot as the weaker trailing
    // key). H, I, and J have real, independent evidence and recover
    // despite G still being locked ahead of them.
    const unlocked = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 0.5, 0.5],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 0.7, 0.7],
        [letter6, 1, 1],
        [letter7, 1, 1],
        [letter8, 1, 1],
        [letter9, 1, 1],
        [letter10, 1, 1],
      ]),
    );

    equal(printLessonKeys(unlocked), "A[B]CD(E)FHIJ");
    ok(unlocked.find(letter7.codePoint)?.isIncluded === false);
    ok(unlocked.find(letter8.codePoint)?.isIncluded === true);
    ok(unlocked.find(letter9.codePoint)?.isIncluded === true);
    ok(unlocked.find(letter10.codePoint)?.isIncluded === true);
  });

  it("lets a forced key compete for the second slot without blocking the true next-in-line letter", () => {
    const settings = new Settings()
      .set(lessonProps.guided.alphabetSize, 0.5) // forces G and H included
      .set(lessonProps.guided.trainSecondKey, true);
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    // G and H are forced included despite no real progress. G, untested,
    // becomes the primary focus. I -- the true next-in-line locked letter
    // -- still wins the second slot over H, a forced trailing key with
    // real (if weak) data.
    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 1, 1],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 1, 1],
        [letter6, 1, 1],
        [letter7, null, null],
        [letter8, 0.4, 0.4],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );

    equal(printLessonKeys(lessonKeys), "ABCDEF[!G]!H(I)");
  });

  it("reaches every letter across repeated rounds without freezing", () => {
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      true,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    let lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));
    for (
      let round = 0;
      round < 20 && lessonKeys.findExcludedKeys().length > 0;
      round++
    ) {
      lessonKeys = lesson.update(
        fakeKeyStatsMap(
          settings,
          [...lessonKeys].map((key) => {
            const mastered = key.isIncluded || key.isSecondFocused;
            return [key.letter, mastered ? 1 : null, mastered ? 1 : null];
          }),
        ),
      );
    }

    equal(lessonKeys.findExcludedKeys().length, 0);

    // The last letter to unlock has had zero practice yet, so it's
    // correctly the focus for this round. One more round of "practicing"
    // it should clear focus entirely, with nothing left to work on.
    lessonKeys = lesson.update(
      fakeKeyStatsMap(
        settings,
        [...lessonKeys].map((key) => [key.letter, 1, 1]),
      ),
    );
    ok(lessonKeys.findFocusedKey() == null);
  });

  it("never unlocks two never-before-included keys in the same call, even across a long stall with preview rotation", () => {
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      true,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);
    const stalled = letter3; // C: never earns real progress until round 8.

    const state = new Map<
      Letter,
      { samples: number; bestConfidence: number | null }
    >();
    for (const letter of lesson.letters) {
      state.set(letter, { samples: 0, bestConfidence: null });
    }
    const snapshot = (): [Letter, number | null, number | null, number][] =>
      [...state].map(([letter, s]) => [
        letter,
        s.bestConfidence,
        s.bestConfidence,
        s.samples,
      ]);

    let lessonKeys = lesson.update(fakeKeyStatsMap(settings, snapshot()));
    let previouslyIncluded = new Set(
      lessonKeys.findIncludedKeys().map((key) => key.letter),
    );

    for (let round = 0; round < 15; round++) {
      for (const key of lessonKeys) {
        if (key.letter === stalled && round < 8) {
          continue;
        }
        if (key.isIncluded || key.isSecondFocused) {
          const s = state.get(key.letter)!;
          s.samples += 1;
          s.bestConfidence = 1;
        }
      }

      lessonKeys = lesson.update(fakeKeyStatsMap(settings, snapshot()));

      // While C is stalled, the preview must stay pinned on the true
      // next-in-line letter (never dark, never a second locked letter).
      if (round < 8) {
        equal(lessonKeys.findFocusedKey()?.letter, stalled);
        ok(lessonKeys.findSecondFocusedKey() != null);
      }

      // At most one never-before-included key may unlock per call, whether
      // via the turn-based path or already graduated from preview reps --
      // a second one, graduated or not, must wait for its own turn.
      const newlyIncluded = lessonKeys
        .findIncludedKeys()
        .filter((key) => !previouslyIncluded.has(key.letter));
      ok(newlyIncluded.length <= 1);

      previouslyIncluded = new Set(
        lessonKeys.findIncludedKeys().map((key) => key.letter),
      );
    }

    equal(lessonKeys.findExcludedKeys().length, 0);
  });

  it("is idempotent across repeat calls with the same evidence, as the UI layer actually does per round", () => {
    // page-practice calls update() twice per round on the same
    // GuidedLesson instance: once from LetterEvents (to detect the unlock
    // toast) and once from a freshly-constructed LessonState (to build the
    // next round's lessonKeys) -- both against identical keyStatsMap
    // evidence. The second call must return the same result, not spend a
    // second turn-based unlock against the first call's now-mutated
    // #confirmedUnlocks.
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      true,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    const stats = fakeKeyStatsMap(settings, [
      [letter1, 1, 1],
      [letter2, 1, 1],
      [letter3, 1, 1],
      [letter4, 1, 1],
      [letter5, 1, 1],
      [letter6, 1, 1],
      [letter7, null, null],
      [letter8, null, null],
      [letter9, null, null],
      [letter10, null, null],
    ]);

    const first = lesson.update(stats);
    const second = lesson.update(stats);

    equal(second, first);
    equal(printLessonKeys(second), "ABCDEF[G](H)");
    ok(second.find(letter8.codePoint)?.isIncluded === false);

    // A genuinely new round (different evidence) still unlocks the next
    // letter normally -- the cache doesn't get stuck.
    const third = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 1, 1],
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 1, 1],
        [letter6, 1, 1],
        [letter7, 1, 1],
        [letter8, null, null],
        [letter9, null, null],
        [letter10, null, null],
      ]),
    );
    ok(third.find(letter8.codePoint)?.isIncluded === true);
  });

  it("recovers already-earned unlocks instantly on a brand new instance, even behind a currently-stalled key", () => {
    // A fresh GuidedLesson (e.g. after a page reload, or any settings
    // change that reconstructs it) has no memory of past calls. It must
    // still recognize letters with real accumulated evidence as unlocked
    // immediately, not re-derive them one per call -- and a stalled key
    // must not hold hostage letters that already have their own evidence.
    const settings = new Settings().set(
      lessonProps.guided.trainSecondKey,
      true,
    );
    const model = new FakePhoneticModel();
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1],
        [letter2, 0.5, 0.5], // stalled, never took its turn
        [letter3, 1, 1],
        [letter4, 1, 1],
        [letter5, 1, 1],
        [letter6, 1, 1],
        [letter7, 1, 1],
        [letter8, 1, 1],
        [letter9, 1, 1],
        [letter10, 1, 1],
      ]),
    );

    ok(lessonKeys.find(letter8.codePoint)?.isIncluded === true);
    ok(lessonKeys.find(letter9.codePoint)?.isIncluded === true);
    ok(lessonKeys.find(letter10.codePoint)?.isIncluded === true);
  });

  it("does not crash when naturalWords is disabled", () => {
    const settings = new Settings()
      .set(lessonProps.guided.naturalWords, false)
      .set(lessonProps.guided.trainSecondKey, true);
    const model = new FakePhoneticModel(["uno", "due", "tre"]);
    const lesson = new GuidedLesson(settings, keyboard, model, []);
    const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

    ok(lesson.generate(lessonKeys, model.rng).length > 0);
  });
});

describe("unlock keys", () => {
  const letter1 = FakePhoneticModel.letter1;
  const letter2 = FakePhoneticModel.letter2;
  const letter3 = FakePhoneticModel.letter3;
  const letter4 = FakePhoneticModel.letter4;
  const letter5 = FakePhoneticModel.letter5;
  const letter6 = FakePhoneticModel.letter6;
  const letter7 = FakePhoneticModel.letter7;
  const letter8 = FakePhoneticModel.letter8;
  const letter9 = FakePhoneticModel.letter9;
  const letter10 = FakePhoneticModel.letter10;

  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel();

  function recoverOff(settings = new Settings()) {
    settings = settings.set(lessonProps.guided.recoverKeys, false);

    const lesson = new GuidedLesson(settings, keyboard, model, []);
    return { settings, lesson };
  }

  function recoverOn(settings = new Settings()) {
    settings = settings.set(lessonProps.guided.recoverKeys, true);
    const lesson = new GuidedLesson(settings, keyboard, model, []);
    return { settings, lesson };
  }

  describe("initial state", () => {
    it("recover off", () => {
      const { settings, lesson } = recoverOff();

      equal(
        printLessonKeys(
          lesson.update(
            fakeKeyStatsMap(settings, [
              [letter1, null, null], // A
              [letter2, null, null], // B
              [letter3, null, null], // C
              [letter4, null, null], // D
              [letter5, null, null], // E
              [letter6, null, null], // F
              [letter7, null, null], // G
              [letter8, null, null], // H
              [letter9, null, null], // I
              [letter10, null, null], // J
            ]),
          ),
        ),
        "[A]BCDEF",
      );
    });

    it("recover on", () => {
      const { settings, lesson } = recoverOn();

      equal(
        printLessonKeys(
          lesson.update(
            fakeKeyStatsMap(settings, [
              [letter1, null, null], // A
              [letter2, null, null], // B
              [letter3, null, null], // C
              [letter4, null, null], // D
              [letter5, null, null], // E
              [letter6, null, null], // F
              [letter7, null, null], // G
              [letter8, null, null], // H
              [letter9, null, null], // I
              [letter10, null, null], // J
            ]),
          ),
        ),
        "[A]BCDEF",
      );
    });
  });

  describe("the unlocked key has no confidence level", () => {
    describe("all previous keys are now above the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });
    });

    describe("all previous keys were once above the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 0.9, 1], // A
                [letter2, 0.9, 1], // B
                [letter3, 0.9, 1], // C
                [letter4, 0.9, 1], // D
                [letter5, 0.9, 1], // E
                [letter6, 0.9, 1], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 0.9, 1], // A
                [letter2, 0.9, 1], // B
                [letter3, 0.9, 1], // C
                [letter4, 0.9, 1], // D
                [letter5, 0.9, 1], // E
                [letter6, 0.9, 1], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "[A]BCDEFJ",
        );
      });
    });
  });

  describe("the unlocked key has a low confidence level", () => {
    describe("all previous keys are now above the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 0.5, 0.5], // G
                [letter8, 0.5, 0.5], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 0.5, 0.5], // G
                [letter8, 0.5, 0.5], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });
    });

    describe("all previous keys were once above the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 0.9, 1], // A
                [letter2, 0.9, 1], // B
                [letter3, 0.9, 1], // C
                [letter4, 0.9, 1], // D
                [letter5, 0.9, 1], // E
                [letter6, 0.9, 1], // F
                [letter7, 0.5, 0.5], // G
                [letter8, 0.5, 0.5], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 0.9, 1], // A
                [letter2, 0.9, 1], // B
                [letter3, 0.9, 1], // C
                [letter4, 0.9, 1], // D
                [letter5, 0.9, 1], // E
                [letter6, 0.9, 1], // F
                [letter7, 0.5, 0.5], // G
                [letter8, 0.5, 0.5], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "[A]BCDEFJ",
        );
      });
    });
  });

  describe("all keys are unlocked", () => {
    describe("some keys are below the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 1, 1], // G
                [letter8, 1, 1], // H
                [letter9, 1, 1], // I
                [letter10, 0.9, 1], // J
              ]),
            ),
          ),
          "ABCDEFGHIJ",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 1, 1], // G
                [letter8, 1, 1], // H
                [letter9, 1, 1], // I
                [letter10, 0.9, 1], // J
              ]),
            ),
          ),
          "ABCDEFGHI[J]",
        );
      });
    });

    describe("all keys are above the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 1, 1], // G
                [letter8, 1, 1], // H
                [letter9, 1, 1], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEFGHIJ",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 1, 1], // G
                [letter8, 1, 1], // H
                [letter9, 1, 1], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEFGHIJ",
        );
      });
    });
  });

  describe("manually unlock keys", () => {
    describe("initial state", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff(
          new Settings().set(lessonProps.guided.alphabetSize, 1),
        );

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, null, null], // A
                [letter2, null, null], // B
                [letter3, null, null], // C
                [letter4, null, null], // D
                [letter5, null, null], // E
                [letter6, null, null], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, null, null], // J
              ]),
            ),
          ),
          "[A]BCDEF!G!H!I!J",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn(
          new Settings().set(lessonProps.guided.alphabetSize, 1),
        );

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, null, null], // A
                [letter2, null, null], // B
                [letter3, null, null], // C
                [letter4, null, null], // D
                [letter5, null, null], // E
                [letter6, null, null], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, null, null], // J
              ]),
            ),
          ),
          "[A]BCDEF!G!H!I!J",
        );
      });
    });
  });
});
