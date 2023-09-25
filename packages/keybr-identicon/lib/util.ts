export function initials(name: string, limit: number = 3): string {
  let result = "";
  let last = " ";
  for (let i = 0; i < name.length && result.length < limit; i++) {
    const ch = name.charAt(i).toUpperCase();
    if (last === " " && ch !== " ") {
      result += ch;
    }
    last = ch;
  }
  return result;
}
