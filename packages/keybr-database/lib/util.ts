const alphabet =
  "0123456789" + //
  "abcdefghijklmnopqrstuvwxyz" + //
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class Random {
  static string(length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return result;
  }
}
