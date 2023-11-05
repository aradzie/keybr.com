import { defineMessages } from "react-intl";

export const messages = defineMessages({
  averageSpeedLabel: {
    id: "metric.averageSpeed.label",
    description: "Widget name.",
    defaultMessage: "Average typing speed",
  },
  averageSpeedTitle: {
    id: "metric.averageSpeed.title",
    description: "Widget description.",
    defaultMessage:
      "Average typing speed in all lessons ({speedUnitName}). The more, the better.",
  },
  bestSpeedLabel: {
    id: "metric.bestSpeed.label",
    description: "Widget name.",
    defaultMessage: "Best typing speed",
  },
  bestSpeedTitle: {
    id: "metric.bestSpeed.title",
    description: "Widget description.",
    defaultMessage:
      "Best typing speed in all lessons ({speedUnitName}). The more, the better.",
  },
  lastSpeedLabel: {
    id: "metric.lastSpeed.label",
    description: "Widget name.",
    defaultMessage: "Last typing speed",
  },
  lastSpeedTitle: {
    id: "metric.lastSpeed.title",
    description: "Widget description.",
    defaultMessage:
      "Typing speed in the last lesson ({speedUnitName}). The more, the better.",
  },
  confidenceLevelLabel: {
    id: "metric.confidenceLevel.label",
    description: "Widget name.",
    defaultMessage: "Confidence level",
  },
  confidenceLevelTitle: {
    id: "metric.confidenceLevel.title",
    description: "Widget description.",
    defaultMessage: "How close you are to unlocking this key.",
  },
  learningRateLabel: {
    id: "metric.learningRate.label",
    description: "Widget name.",
    defaultMessage: "Learning rate",
  },
  learningRateTitle: {
    id: "metric.learningRate.title",
    description: "Widget description.",
    defaultMessage: "How your typing speed is changing with each lesson.",
  },
  learningRateValue: {
    id: "metric.learningRate.value",
    description: "Value text.",
    defaultMessage: "{value} per lesson",
  },
  uncertainValue: {
    id: "metric.uncertainValue",
    description: "Value text.",
    defaultMessage: "Uncertain",
  },
  notCalibratedText: {
    id: "lesson.notCalibrated.message",
    description: "Message text.",
    defaultMessage: "Not calibrated, need more samples.",
  },
  characterName: {
    id: "lesson.characterName",
    description: "Message text.",
    defaultMessage: "Character ''{name}''",
  },
  boostedKeyText: {
    id: "lesson.boostedKeyText",
    description: "Message text.",
    defaultMessage: "A key with boosted frequency.",
  },
  forcedKeyText: {
    id: "lesson.forcedKeyText",
    description: "Message text.",
    defaultMessage: "A manually added key.",
  },
  wpmName: {
    id: "speedUnit.wpm.name",
    description: "Widget name.",
    defaultMessage: "Words per minute",
  },
  wpmDescription: {
    id: "speedUnit.wpm.description",
    description: "Widget description.",
    defaultMessage: "Measure typing speed in words per minute.",
  },
  cpmName: {
    id: "speedUnit.cpm.name",
    description: "Widget name.",
    defaultMessage: "Characters per minute",
  },
  cpmDescription: {
    id: "speedUnit.cpm.description",
    description: "Widget description.",
    defaultMessage: "Measure typing speed in characters per minute.",
  },
  cpsName: {
    id: "speedUnit.cps.name",
    description: "Widget name.",
    defaultMessage: "Characters per second",
  },
  cpsDescription: {
    id: "speedUnit.cps.description",
    description: "Widget description.",
    defaultMessage: "Measure typing speed in characters per second.",
  },
});
