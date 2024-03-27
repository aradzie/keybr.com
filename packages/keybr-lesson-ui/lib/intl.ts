import { defineMessages } from "react-intl";

export const messages = defineMessages({
  averageSpeedName: {
    id: "metric.averageSpeed.name",
    defaultMessage: "Average speed",
  },
  averageSpeedDescription: {
    id: "metric.averageSpeed.description",
    defaultMessage:
      "Average typing speed in all lessons ({speedUnitName}). The more, the better.",
  },
  bestSpeedName: {
    id: "metric.bestSpeed.name",
    defaultMessage: "Best speed",
  },
  bestSpeedDescription: {
    id: "metric.bestSpeed.description",
    defaultMessage:
      "Best typing speed in all lessons ({speedUnitName}). The more, the better.",
  },
  lastSpeedName: {
    id: "metric.lastSpeed.name",
    defaultMessage: "Last speed",
  },
  lastSpeedDescription: {
    id: "metric.lastSpeed.description",
    defaultMessage:
      "Typing speed in the last lesson ({speedUnitName}). The more, the better.",
  },
  confidenceLevelName: {
    id: "metric.confidenceLevel.name",
    defaultMessage: "Confidence level",
  },
  confidenceLevelDescription: {
    id: "metric.confidenceLevel.description",
    defaultMessage: "How close you are to unlocking this key.",
  },
  learningRateName: {
    id: "metric.learningRate.name",
    defaultMessage: "Learning rate",
  },
  learningRateDescription: {
    id: "metric.learningRate.description",
    defaultMessage: "How your typing speed is changing with each lesson.",
  },
  learningRateValue: {
    id: "metric.learningRate.value",
    defaultMessage: "{value}/lesson",
  },
  uncertainValue: {
    id: "metric.uncertainValue",
    defaultMessage: "Uncertain",
  },
  notCalibratedText: {
    id: "lesson.notCalibrated.message",
    defaultMessage: "Not calibrated, need more samples.",
  },
  characterName: {
    id: "lesson.characterName",
    defaultMessage: "Character ‘{name}’",
  },
  focusedKeyText: {
    id: "lesson.focusedKeyText",
    defaultMessage: "A key with increased frequency.",
  },
  forcedKeyText: {
    id: "lesson.forcedKeyText",
    defaultMessage: "A manually added key.",
  },
  wpmName: {
    id: "speedUnit.wpm.name",
    defaultMessage: "Words per minute",
  },
  wpmDescription: {
    id: "speedUnit.wpm.description",
    defaultMessage: "Measure typing speed in words per minute.",
  },
  cpmName: {
    id: "speedUnit.cpm.name",
    defaultMessage: "Characters per minute",
  },
  cpmDescription: {
    id: "speedUnit.cpm.description",
    defaultMessage: "Measure typing speed in characters per minute.",
  },
  cpsName: {
    id: "speedUnit.cps.name",
    defaultMessage: "Characters per second",
  },
  cpsDescription: {
    id: "speedUnit.cps.description",
    defaultMessage: "Measure typing speed in characters per second.",
  },
});
