import { type Settings, useSettings } from "@keybr/settings";
import { Feedback } from "@keybr/textinput";
import { useMemo } from "react";
import { PlaySounds, soundProps, SoundTheme } from "./settings.ts";
import { Theme } from "./sound.ts";
import { defaultTheme } from "./themes/default.ts";
import { mechanical1 } from "./themes/mechanical1.ts";
import { mechanical2 } from "./themes/mechanical2.ts";
import { typewriter1 } from "./themes/typewriter1.ts";
import { typewriter2 } from "./themes/typewriter2.ts";

export function useSoundPlayer() {
  const { settings } = useSettings();
  return useMemo(() => makeSoundPlayer(settings), [settings]);
}

export function makeSoundPlayer(settings: Settings) {
  const playSounds = settings.get(soundProps.playSounds);
  const soundVolume = settings.get(soundProps.soundVolume);
  const soundTheme = settings.get(soundProps.soundTheme);
  if (playSounds === PlaySounds.None) {
    return () => {};
  }
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

const cache = new Map();

function loadTheme(id: SoundTheme) {
  let theme = cache.get(id);
  if (theme == null) {
    cache.set(id, (theme = loadTheme0(id)));
  }
  return theme;
}

function loadTheme0(id: SoundTheme) {
  switch (id) {
    case SoundTheme.MECHANICAL1:
      return new Theme(mechanical1);
    case SoundTheme.MECHANICAL2:
      return new Theme(mechanical2);
    case SoundTheme.TYPEWRITER1:
      return new Theme(typewriter1);
    case SoundTheme.TYPEWRITER2:
      return new Theme(typewriter2);
    default:
      return new Theme(defaultTheme);
  }
}
