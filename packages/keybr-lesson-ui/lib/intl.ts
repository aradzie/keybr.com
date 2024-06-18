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
  topSpeedName: {
    id: "metric.topSpeed.name",
    defaultMessage: "Top speed",
  },
  topSpeedDescription: {
    id: "metric.topSpeed.description",
    defaultMessage:
      "Top typing speed in all lessons ({speedUnitName}). The more, the better.",
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
});
