import { type Settings, useSettings } from "@keybr/settings";
import { loadSounds, playSound } from "@keybr/sound";
import { Feedback, PlaySounds, textDisplayProps } from "@keybr/textinput";
import { useMemo } from "react";
import { TextInputSound, textInputSounds } from "./assets.ts";

export function useSoundPlayer() {
  const { settings } = useSettings();
  return useMemo(() => makeSoundPlayer(settings), [settings]);
}

export function makeSoundPlayer(settings: Settings) {
  const playSounds = settings.get(textDisplayProps.playSounds);
  const soundVolume = settings.get(textDisplayProps.soundVolume);
  return (feedback: Feedback) => {
    loadSounds(textInputSounds);
    if (playSounds === PlaySounds.All) {
      switch (feedback) {
        case Feedback.Succeeded:
        case Feedback.Recovered:
          playSound(TextInputSound.Click, soundVolume);
          break;
        case Feedback.Failed:
          playSound(TextInputSound.Blip, soundVolume);
          break;
      }
    }
    if (playSounds === PlaySounds.ErrorsOnly) {
      switch (feedback) {
        case Feedback.Failed:
          playSound(TextInputSound.Blip, soundVolume);
          break;
      }
    }
  };
}
