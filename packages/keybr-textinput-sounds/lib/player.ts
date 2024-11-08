import { type Settings, useSettings } from "@keybr/settings";
import { Feedback } from "@keybr/textinput";
import { useMemo } from "react";
import { PlaySounds, soundProps, SoundTheme } from "./settings.ts";
import { Theme } from "./sound.ts";
import { themeDefault } from "./themes/default.ts";
import { themeMechanical1 } from "./themes/mechanical1.ts";
import { themeTypewriter1 } from "./themes/typewriter1.ts";

export function useSoundPlayer() {
  const { settings } = useSettings();
  return useMemo(() => makeSoundPlayer(settings), [settings]);
}

export function makeSoundPlayer(settings: Settings) {
  const playSounds = settings.get(soundProps.playSounds);
  const soundVolume = settings.get(soundProps.soundVolume);
  const soundTheme = settings.get(soundProps.soundTheme);
  const theme = loadTheme(soundTheme);
  return (feedback: Feedback) => {
    if (playSounds === PlaySounds.All) {
      switch (feedback) {
        case Feedback.Succeeded:
        case Feedback.Recovered:
          theme.play("click", soundVolume);
          break;
        case Feedback.Failed:
          theme.play("blip", soundVolume);
          break;
      }
    }
    if (playSounds === PlaySounds.ErrorsOnly) {
      switch (feedback) {
        case Feedback.Failed:
          theme.play("blip", soundVolume);
          break;
      }
    }
  };
}

function loadTheme(soundTheme: SoundTheme) {
  switch (soundTheme) {
    case SoundTheme.MECHANICAL1:
      return new Theme(themeMechanical1);
    case SoundTheme.TYPEWRITER1:
      return new Theme(themeTypewriter1);
    default:
      return new Theme(themeDefault);
  }
}
