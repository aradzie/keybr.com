import { type SoundAssets } from "@keybr/sound";
import soundBlipMp3 from "../assets/sound-blip.mp3";
import soundBlipWav from "../assets/sound-blip.wav";
import soundClickMp3 from "../assets/sound-click.mp3";
import soundClickWav from "../assets/sound-click.wav";
import soundCorrectMp3 from "../assets/sound-correct.mp3";
import soundCorrectWav from "../assets/sound-correct.wav";
import soundWrongMp3 from "../assets/sound-wrong.mp3";
import soundWrongWav from "../assets/sound-wrong.wav";

export enum TextInputSound {
  Click = "click",
  Blip = "blip",
  Correct = "correct",
  Wrong = "wrong",
}

export const textInputSounds: SoundAssets = {
  [TextInputSound.Click]: { urls: [soundClickMp3, soundClickWav] },
  [TextInputSound.Blip]: { urls: [soundBlipMp3, soundBlipWav] },
  [TextInputSound.Correct]: { urls: [soundCorrectMp3, soundCorrectWav] },
  [TextInputSound.Wrong]: { urls: [soundWrongMp3, soundWrongWav] },
};
