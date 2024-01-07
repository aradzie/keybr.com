import { type CodePoint, toCodePoints } from "@keybr/unicode";

export type Language = {
  readonly id: string;
  readonly alphabet: readonly CodePoint[];
};

export const languages: readonly Language[] = [
  { id: "be", alphabet: "абвгдеёжзійклмнопрстуўфхцчшыьэюя" },
  { id: "cs", alphabet: "aábcčdďeéěfghiíjklmnňoóprřsštťuúůvwxyýzž" },
  { id: "de", alphabet: "aäbcdefghijklmnoöpqrstuüvwxyzß" },
  { id: "en", alphabet: "abcdefghijklmnopqrstuvwxyz" },
  { id: "es", alphabet: "abcdefghijklmnñopqrstuvwxyz" },
  { id: "fr", alphabet: "abcçdeéèfghijklmnopqrstuvwxyz" },
  { id: "it", alphabet: "abcdefghijklmnopqrstuvwxyz" },
  { id: "pl", alphabet: "aąbcćdeęfghijklłmnńoóprsśtuwyzźż" },
  { id: "pt", alphabet: "aáâãàbcçdeéêfghiíjklmnoóôõpqrstuúvwxyz" },
  { id: "ru", alphabet: "абвгдеёжзийклмнопрстуфхцчшщъыьэюя" },
  { id: "sl", alphabet: "abcčdefghijklmnoprsštuvzž" },
  { id: "sv", alphabet: "abcdefghijklmnoprstuvwxyzåäö" },
  { id: "uk", alphabet: "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя" },
].map(({ id, alphabet }) => ({ id, alphabet: [...toCodePoints(alphabet)] }));
