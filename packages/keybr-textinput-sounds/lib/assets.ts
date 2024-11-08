import { type SoundAssets } from "@keybr/sound";
import blipMp3 from "../assets/sound-blip.mp3";
import blipWav from "../assets/sound-blip.wav";
import clickMp3 from "../assets/sound-click.mp3";
import clickWav from "../assets/sound-click.wav";
import correctMp3 from "../assets/sound-correct.mp3";
import correctWav from "../assets/sound-correct.wav";
import wrongMp3 from "../assets/sound-wrong.mp3";
import wrongWav from "../assets/sound-wrong.wav";

export enum TextInputSound {
  Click = "click",
  Blip = "blip",
  Correct = "correct",
  Wrong = "wrong",
}

export const textInputSounds = {
  [TextInputSound.Click]: { urls: [clickMp3, clickWav] },
  [TextInputSound.Blip]: { urls: [blipMp3, blipWav] },
  [TextInputSound.Correct]: { urls: [correctMp3, correctWav] },
  [TextInputSound.Wrong]: { urls: [wrongMp3, wrongWav] },
} as const satisfies SoundAssets;
