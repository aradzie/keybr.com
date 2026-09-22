import { type WordList } from "@keybr/content";
import { type Keyboard } from "@keybr/keyboard";
import { Filter, Letter, type PhoneticModel } from "@keybr/phonetic-model";
import { type RNGStream } from "@keybr/rand";
import { type KeyStatsMap, type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type CodePoint } from "@keybr/unicode";
import { ConfirmedUnlocks } from "./confirmed-unlocks.ts";
import { Dictionary, filterWordList } from "./dictionary.ts";
import { LessonKey, LessonKeys } from "./key.ts";
import { Lesson } from "./lesson.ts";
import { lessonProps } from "./settings.ts";
import { Target } from "./target.ts";
import { generateFragment } from "./text/fragment.ts";
import {
  interleavedWords,
  mangledWords,
  phoneticWords,
  randomWords,
  uniqueWords,
} from "./text/words.ts";

const secondKeyWordProbability = 0.2;
// Minimum samples for a trailing included key to win the second-focus slot, and for a
// locked key with bestConfidence >= 1 to unlock out of order (nextKey itself is exempt).
const minSecondKeySamples = 3;

function rawConfidenceOf(key: LessonKey, recoverKeys: boolean): number | null {
  return recoverKeys ? key.confidence : key.bestConfidence;
}

function confidenceOf(key: LessonKey, recoverKeys: boolean): number {
  return rawConfidenceOf(key, recoverKeys) ?? 0;
}

export class GuidedLesson extends Lesson {
  readonly dictionary: Dictionary;
  // Cache of letters already known settled, so a reaffirm never re-spends
  // the turn slot. Seeded from and written through to ConfirmedUnlocks, so
  // a settings change or reload never re-locks an already-unlocked letter.
  readonly #confirmedUnlocks: Set<CodePoint>;
  readonly #confirmedUnlocksScope: string;
  // update() runs twice per round from different call sites (once for the
  // unlock toast, once for the next round's lessonKeys) against the same
  // evidence. Memoized on the last Result seen, so the second call is a
  // true no-op returning the first call's LessonKeys, rather than
  // re-deriving unlocks from a #confirmedUnlocks that the first call may
  // have already mutated.
  #lastResult: Result | undefined = undefined;
  #lastResultsCount = -1;
  #lastLessonKeys: LessonKeys | null = null;

  constructor(
    settings: Settings,
    keyboard: Keyboard,
    model: PhoneticModel,
    wordList: WordList,
  ) {
    super(settings, keyboard, model);
    this.dictionary = new Dictionary(
      filterWordList(wordList, this.codePoints).filter(
        (word) => word.length > 2,
      ),
    );
    this.#confirmedUnlocksScope = keyboard.layout.id;
    this.#confirmedUnlocks = new Set(
      ConfirmedUnlocks.load(this.#confirmedUnlocksScope),
    );
  }

  override get letters() {
    return this.model.letters;
  }

  override update(keyStatsMap: KeyStatsMap) {
    const { results } = keyStatsMap;
    const lastResult = results.at(-1);
    if (
      this.#lastLessonKeys != null &&
      results.length === this.#lastResultsCount &&
      lastResult === this.#lastResult
    ) {
      // Same evidence as the last call (the other of this round's two
      // call sites) -- return the same LessonKeys rather than re-deriving
      // unlocks against a #confirmedUnlocks this call may have mutated.
      return this.#lastLessonKeys;
    }
    this.#lastResultsCount = results.length;
    this.#lastResult = lastResult;

    const alphabetSize = this.settings.get(lessonProps.guided.alphabetSize);
    const recoverKeys = this.settings.get(lessonProps.guided.recoverKeys);
    const trainSecondKey = this.settings.get(lessonProps.guided.trainSecondKey);

    const letters = this.#getLetters();

    const minSize = 6;
    const maxSize =
      minSize + Math.round((letters.length - minSize) * alphabetSize);

    const target = new Target(this.settings);

    const lessonKeys = new LessonKeys(
      letters.map((letter) => LessonKey.from(keyStatsMap.get(letter), target)),
    );

    // Caps the turn-based unlock below to one letter per call.
    let unlockedThisTurn = false;
    // Among letters not already confirmed below, the first one reached is
    // nextKey, the one letter currently being previewed.
    let nextKeyResolved = false;
    // Unlike unlockedThisTurn, not set by masteredElsewhere below -- several
    // already-evidenced keys may still unlock together in one call.
    let turnBasedUnlock = false;

    for (const lessonKey of lessonKeys) {
      const includedKeys = lessonKeys.findIncludedKeys();

      if (includedKeys.length < minSize) {
        // Meet the minimal required alphabet size.
        lessonKeys.include(lessonKey.letter);
        continue;
      }

      if (includedKeys.length < maxSize) {
        // Meet the maximal required alphabet size.
        lessonKeys.force(lessonKey.letter);
        continue;
      }

      if (this.#confirmedUnlocks.has(lessonKey.letter.codePoint)) {
        // Already settled, even if trainSecondKey is off now -- once
        // confirmed, always reaffirmed for free.
        lessonKeys.include(lessonKey.letter);
        continue;
      }

      if (trainSecondKey && !nextKeyResolved) {
        // nextKey must win its own turn-based turn -- its evidence may be
        // nothing but thin preview reps, so it never gets the shortcut below.
        nextKeyResolved = true;
        if (
          !unlockedThisTurn &&
          includedKeys.every((key) => confidenceOf(key, recoverKeys) >= 1)
        ) {
          lessonKeys.include(lessonKey.letter);
          this.#confirmUnlock(lessonKey.letter.codePoint);
          unlockedThisTurn = true;
          turnBasedUnlock = true;
        }
        continue;
      }

      // Require a few samples so a single lucky rep can't pass as mastery.
      // Not itself set by masteredElsewhere -- several already-evidenced
      // keys may still unlock together, just not alongside a turn-based one.
      const masteredElsewhere =
        !turnBasedUnlock &&
        (lessonKey.bestConfidence ?? 0) >= 1 &&
        lessonKey.samples.length >= minSecondKeySamples;
      if (masteredElsewhere) {
        // Confident keys unlock regardless of order (e.g. mastered in
        // another lesson type, or recovered from before this instance
        // existed).
        lessonKeys.include(lessonKey.letter);
        if (trainSecondKey) {
          this.#confirmUnlock(lessonKey.letter.codePoint);
        }
        continue;
      }

      if (
        !trainSecondKey &&
        !unlockedThisTurn &&
        includedKeys.every((key) => confidenceOf(key, recoverKeys) >= 1)
      ) {
        // Include the next key once all previous ones clear the target
        // speed. A key reaching here failed masteredElsewhere above
        // (bestConfidence < 1, or too few samples).
        lessonKeys.include(lessonKey.letter);
        unlockedThisTurn = true;
        continue;
      }
    }

    // Find the least confident of all included keys and focus on it.
    const excludedKeys = lessonKeys.findExcludedKeys();
    const weakestKeys = lessonKeys
      .findIncludedKeys()
      .filter((key) => confidenceOf(key, recoverKeys) < 1)
      .sort(
        (a, b) => confidenceOf(a, recoverKeys) - confidenceOf(b, recoverKeys),
      );
    // Under trainSecondKey, a key can unlock already calibrated (preview
    // reps pushed its bestConfidence to 1 before it won its turn), leaving
    // no key under the target speed -- fall back to the most recently
    // unlocked key rather than going dark while letters remain locked.
    const focusedKey =
      weakestKeys[0] ??
      (excludedKeys.length > 0
        ? (lessonKeys.findIncludedKeys().at(-1) ?? null)
        : null);
    if (focusedKey != null) {
      lessonKeys.focus(focusedKey.letter);
    }

    // Optionally focus a second key too: the least confident of the
    // trailing included keys and the next locked letter (previewed).
    if (trainSecondKey) {
      // Only the true next-in-line letter is ever previewed; a deeper locked letter never competes.
      const [nextKey] = excludedKeys;
      const nextKeyGraduated =
        nextKey != null && confidenceOf(nextKey, recoverKeys) >= 1;
      const candidates = weakestKeys
        .filter((key) => key !== focusedKey)
        .filter((key) => rawConfidenceOf(key, recoverKeys) != null);
      // nextKey competes even with no samples yet, so it isn't outranked by
      // a trailing key just because it hasn't been previewed at all.
      if (nextKey != null && !nextKeyGraduated) {
        candidates.push(nextKey);
      }
      const secondKeyCandidates = candidates
        .filter(
          (key) => key === nextKey || key.samples.length >= minSecondKeySamples,
        )
        .sort(
          (a, b) => confidenceOf(a, recoverKeys) - confidenceOf(b, recoverKeys),
        );
      // Falls back to nextKey if graduated and nothing else needs the slot, so it's never dark.
      const secondKey = secondKeyCandidates[0] ?? nextKey ?? null;
      if (secondKey != null) {
        lessonKeys.focusSecond(secondKey.letter);
      }
    }

    this.#lastLessonKeys = lessonKeys;
    return lessonKeys;
  }

  override generate(lessonKeys: LessonKeys, rng: RNGStream) {
    const includedKeys = lessonKeys.findIncludedKeys();
    const filter = new Filter(includedKeys, lessonKeys.findFocusedKey());
    let wordGenerator = this.#makeWordGenerator(filter, rng);
    const secondFocusedKey = lessonKeys.findSecondFocusedKey();
    if (secondFocusedKey != null) {
      const secondFilter = new Filter(
        // A still-locked second key must be added; Filter requires the
        // focused letter to be present.
        secondFocusedKey.isIncluded
          ? includedKeys
          : [...includedKeys, secondFocusedKey],
        secondFocusedKey,
      );
      wordGenerator = interleavedWords(
        wordGenerator,
        this.#makeWordGenerator(secondFilter, rng),
        secondKeyWordProbability,
        rng,
      );
    }
    const words = mangledWords(
      uniqueWords(wordGenerator),
      this.model.language,
      Letter.restrict(Letter.punctuators, this.codePoints),
      {
        withCapitals: this.settings.get(lessonProps.capitals),
        withPunctuators: this.settings.get(lessonProps.punctuators),
      },
      rng,
    );
    return generateFragment(this.settings, words, {
      repeatWords: this.settings.get(lessonProps.repeatWords),
    });
  }

  #confirmUnlock(codePoint: CodePoint) {
    this.#confirmedUnlocks.add(codePoint);
    ConfirmedUnlocks.confirm(this.#confirmedUnlocksScope, codePoint);
  }

  #getLetters() {
    const { letters } = this.model;
    const { codePoints } = this;
    if (this.settings.get(lessonProps.guided.keyboardOrder)) {
      return Letter.weightedFrequencyOrder(letters, ({ codePoint }) =>
        codePoints.weight(codePoint),
      );
    } else {
      return Letter.frequencyOrder(letters);
    }
  }

  #makeWordGenerator(filter: Filter, rng: RNGStream) {
    const pseudoWords = phoneticWords(this.model, filter, rng);
    if (this.settings.get(lessonProps.guided.naturalWords)) {
      const words = this.dictionary.find(filter).slice(0, 1000);
      while (words.length < 15) {
        const word = pseudoWords();
        if (word != null) {
          words.push(word);
        } else {
          break;
        }
      }
      if (words.length === 0) {
        words.push("?");
      }
      return randomWords(words, rng);
    }
    return pseudoWords;
  }
}
