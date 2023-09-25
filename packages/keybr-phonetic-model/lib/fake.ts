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

  static readonly letter1 = new Letter(/* a */ 0x61, 0.01);
  static readonly letter2 = new Letter(/* b */ 0x62, 0.02);
  static readonly letter3 = new Letter(/* c */ 0x63, 0.03);
  static readonly letter4 = new Letter(/* d */ 0x64, 0.04);
  static readonly letter5 = new Letter(/* e */ 0x65, 0.05);
  static readonly letter6 = new Letter(/* f */ 0x66, 0.06);
  static readonly letter7 = new Letter(/* g */ 0x67, 0.07);
  static readonly letter8 = new Letter(/* h */ 0x68, 0.08);
  static readonly letter9 = new Letter(/* i */ 0x69, 0.09);
  static readonly letter10 = new Letter(/* j */ 0x6a, 0.1);

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
    super(FakePhoneticModel.letters);
    this.words = [...words];
    this.rng = rng;
  }

  nextWord(filter: Filter, random: RNG = this.rng): string {
    return randomSample(this.words, random);
  }
}
