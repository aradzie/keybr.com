import { type CodePoint, toCodePoints } from "@keybr/unicode";

export type Language = {
  readonly id: string;
  readonly alphabet: readonly CodePoint[];
};

export const languages: readonly Language[] = [
  { id: "be", alphabet: "абвгдежзійклмнопрстуўфхцчшыьэюя" },
  { id: "cs", alphabet: "aábcčdďeéěfghiíjklmnňoóprřsštťuúůvxyýzž" },
  { id: "de", alphabet: "aäbcdefghijklmnoöpqrstuüvwxyzß" },
  { id: "el", alphabet: "αάβγδεέζηήθιίκλμνξοόπρσςτυύφχψωώ" },
  { id: "en", alphabet: "abcdefghijklmnopqrstuvwxyz" },
  { id: "es", alphabet: "aábcdeéfghiíjlmnñoópqrstuúüvxyz" },
  { id: "fr", alphabet: "aàbcçdeéèfghijlmnopqrstuvxyz" },
  { id: "he", alphabet: "אבגדהוזחטיכךלמםנןסעפףצץקרשת" },
  { id: "hu", alphabet: "aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz" },
  { id: "it", alphabet: "abcdefghijklmnopqrstuvwxyz" },
  { id: "nb", alphabet: "abcdefghijklmnoprstuvwxyæøå" },
  { id: "nl", alphabet: "abcdefghijklmnopqrstuvwxyz" },
  { id: "pl", alphabet: "aąbcćdeęfghijklłmnńoóprsśtuwyzźż" },
  { id: "pt", alphabet: "aáâãàbcçdeéêfghiíjklmnoóôõpqrstuúvwxyz" },
  { id: "ru", alphabet: "абвгдежзийклмнопрстуфхцчшщъыьэюя" },
  { id: "sl", alphabet: "abcčdefghijklmnoprsštuvzž" },
  { id: "sv", alphabet: "abcdefghijklmnoprstuvwxyåäö" },
  { id: "uk", alphabet: "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя" },
].map(({ id, alphabet }) => ({ id, alphabet: [...toCodePoints(alphabet)] }));
