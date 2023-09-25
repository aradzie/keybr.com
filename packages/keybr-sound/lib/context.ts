let context: null | AudioContext = null;

export function getAudioContext(): AudioContext | null {
  if (context == null) {
    try {
      context = new AudioContext();
    } catch {
      context = null;
    }
  }
  return context;
}
