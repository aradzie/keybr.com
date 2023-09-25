import { randomSample } from "@keybr/rand";
import quotes from "./data/quotes.json";

export function nextQuote(): string {
  const [text, author] = randomSample(quotes);
  return `${text} ${author}`;
}
