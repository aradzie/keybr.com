import { defineMessages } from "react-intl";

export const messages = defineMessages({
  averageSpeedName: {
    id: "metric.averageSpeed.name",
    description: "Widget name.",
    defaultMessage: "Average typing speed",
  },
  averageSpeedDescription: {
    id: "metric.averageSpeed.description",
    description: "Widget description.",
    defaultMessage:
      "Average typing speed in all lessons ({speedUnitName}). The more, the better.",
  },
  bestSpeedName: {
    id: "metric.bestSpeed.name",
    description: "Widget name.",
    defaultMessage: "Best speed",
  },
  bestSpeedDescription: {
    id: "metric.bestSpeed.description",
    description: "Widget description.",
    defaultMessage:
      "Best typing speed in all lessons ({speedUnitName}). The more, the better.",
  },
  lastSpeedName: {
    id: "metric.lastSpeed.name",
    description: "Widget name.",
    defaultMessage: "Last speed",
  },
  lastSpeedDescription: {
    id: "metric.lastSpeed.description",
    description: "Widget description.",
    defaultMessage:
      "Typing speed in the last lesson ({speedUnitName}). The more, the better.",
  },
  confidenceLevelName: {
    id: "metric.confidenceLevel.name",
    description: "Widget name.",
    defaultMessage: "Confidence level",
  },
  confidenceLevelDescription: {
    id: "metric.confidenceLevel.description",
    description: "Widget description.",
    defaultMessage: "How close you are to unlocking this key.",
  },
  learningRateName: {
    id: "metric.learningRate.name",
    description: "Widget name.",
    defaultMessage: "Learning rate",
  },
  learningRateDescription: {
    id: "metric.learningRate.description",
    description: "Widget description.",
    defaultMessage: "How your typing speed is changing with each lesson.",
  },
  learningRateValue: {
    id: "metric.learningRate.value",
    description: "Value text.",
    defaultMessage: "{value}/lesson",
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
  focusedKeyText: {
    id: "lesson.focusedKeyText",
    description: "Message text.",
    defaultMessage: "A key with increased frequency.",
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
