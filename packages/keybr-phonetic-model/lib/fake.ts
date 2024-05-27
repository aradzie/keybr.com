import { Language, Ngram1, Ngram2 } from "@keybr/keyboard";
import {
  FakeRNGStream,
  randomSample,
  type RNG,
  type RNGStream,
} from "@keybr/rand";
import { type Filter } from "./filter.ts";
import { Letter } from "./letter.ts";
import { PhoneticModel } from "./phoneticmodel.ts";

export class FakePhoneticModel extends PhoneticModel {
  static readonly loader: PhoneticModel.Loader = async () =>
    new FakePhoneticModel();

  static readonly letter1 = new Letter(/* a */ 0x0061, 0.1, "A");
  static readonly letter2 = new Letter(/* b */ 0x0062, 0.09, "B");
  static readonly letter3 = new Letter(/* c */ 0x0063, 0.08, "C");
  static readonly letter4 = new Letter(/* d */ 0x0064, 0.07, "D");
  static readonly letter5 = new Letter(/* e */ 0x0065, 0.06, "E");
  static readonly letter6 = new Letter(/* f */ 0x0066, 0.05, "F");
  static readonly letter7 = new Letter(/* g */ 0x0067, 0.04, "G");
  static readonly letter8 = new Letter(/* h */ 0x0068, 0.03, "H");
  static readonly letter9 = new Letter(/* i */ 0x0069, 0.02, "I");
  static readonly letter10 = new Letter(/* j */ 0x006a, 0.01, "J");

  static readonly letters: readonly Letter[] = [
    FakePhoneticModel.letter1,
    FakePhoneticModel.letter2,
    FakePhoneticModel.letter3,
    FakePhoneticModel.letter4,
    FakePhoneticModel.letter5,
    FakePhoneticModel.letter6,
    FakePhoneticModel.letter7,
    FakePhoneticModel.letter8,
    FakePhoneticModel.letter9,
    FakePhoneticModel.letter10,
  ];

  readonly words: readonly string[];
  readonly rng: RNGStream;

  constructor(
    words: readonly string[] = ["abc", "def", "ghi"],
    rng: RNGStream = FakeRNGStream(words.length),
  ) {
    super(Language.EN, FakePhoneticModel.letters);
    this.words = [...words];
    this.rng = rng;
  }

  override nextWord(filter: Filter, random: RNG = this.rng): string {
    return randomSample(this.words, random);
  }

  override ngram1(): Ngram1 {
    const alphabet = this.letters.map(({ codePoint }) => codePoint);
    const { length } = alphabet;
    const ngram = new Ngram1(alphabet);
    for (let i = 0; i < length; i++) {
      ngram.set(alphabet[i], 1);
    }
    return ngram;
  }

  override ngram2(): Ngram2 {
    const alphabet = this.letters.map(({ codePoint }) => codePoint);
    const { length } = alphabet;
    const ngram = new Ngram2(alphabet);
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        ngram.set(alphabet[i], alphabet[j], 1);
      }
    }
    return ngram;
  }
}
