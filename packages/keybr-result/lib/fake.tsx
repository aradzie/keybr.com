import { Layout } from "@keybr/keyboard";
import { FakePhoneticModel, type Letter } from "@keybr/phonetic-model";
import { Histogram } from "@keybr/textinput";
import { type ReactNode, useState } from "react";
import { ResultContext } from "./context.ts";
import { type KeySample } from "./keystats.ts";
import { Result } from "./result.ts";
import { TextType } from "./texttype.ts";

export class ResultFaker {
  letters: readonly Letter[];
  layout: Layout;
  textType: TextType;
  timeStamp: number;
  timeStampIncrement: number;

  constructor({
    letters = FakePhoneticModel.letters,
    layout = Layout.EN_US,
    textType = TextType.GENERATED,
    timeStamp = 0,
    timeStampIncrement = 1000,
  }: {
    readonly letters?: readonly Letter[];
    readonly layout?: Layout;
    readonly textType?: TextType;
    readonly timeStamp?: number;
    readonly timeStampIncrement?: number;
  } = {}) {
    this.letters = letters;
    this.layout = layout;
    this.textType = textType;
    this.timeStamp = timeStamp;
    this.timeStampIncrement = timeStampIncrement;
  }

  nextResultList(length: number): Result[] {
    const list = [];
    for (let i = 0; i < length; i++) {
      list.push(this.nextResult());
    }
    return list;
  }

  nextResult({
    layout = this.layout,
    textType = this.textType,
    timeStamp = (this.timeStamp += this.timeStampIncrement),
    length = 100,
    time = 50000,
    errors = 0,
    histogram = this.nextHistogram(),
  }: {
    layout?: Layout;
    textType?: TextType;
    timeStamp?: number;
    length?: number;
    time?: number;
    errors?: number;
    histogram?: Histogram;
  } = {}): Result {
    return new Result(
      layout,
      textType,
      timeStamp,
      length,
      time,
      errors,
      histogram,
    );
  }

  nextHistogram(letters: readonly Letter[] = this.letters): Histogram {
    return new Histogram(
      letters.map(({ codePoint }) => ({
        codePoint,
        hitCount: 10,
        missCount: 0,
        timeToType: 200,
      })),
    );
  }
}

export function generateKeySamples(
  length: number,
  {
    indexStart = 100,
    indexStep = 1,
    timeStampStart = 1000,
    timeStampStep = 60000,
    timeToTypeStart = 500,
    timeToTypeStep = 10,
  }: {
    indexStart?: number;
    indexStep?: number;
    timeStampStart?: number;
    timeStampStep?: number;
    timeToTypeStart?: number;
    timeToTypeStep?: number;
  } = {},
): KeySample[] {
  const samples = [];
  for (let i = 0; i < length; i++) {
    const timeToType = timeToTypeStart - i * timeToTypeStep;
    const filteredTimeToType = timeToType;
    samples.push({
      index: indexStart + i * indexStep,
      timeStamp: timeStampStart + i * timeStampStep,
      hitCount: 10,
      missCount: 1,
      timeToType,
      filteredTimeToType,
    } satisfies KeySample);
  }
  return samples;
}

export function FakeResultContext({
  initialResults = [],
  children,
}: {
  readonly initialResults?: readonly Result[];
  readonly children: ReactNode;
}): ReactNode {
  const [results, setResults] = useState(initialResults);
  return (
    <ResultContext.Provider
      value={{
        results,
        appendResults: (newResults) => {
          setResults([...results, ...newResults]);
        },
        clearResults: () => {
          setResults([]);
        },
      }}
    >
      {children}
    </ResultContext.Provider>
  );
}
