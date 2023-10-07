let context: null | AudioContext = null;

export function getAudioContext(): AudioContext | null {
  if (context == null) {
    context = new AudioContext();
  }
  return context;
}
