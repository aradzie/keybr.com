export function hashCode(value: string): number {
  const { length } = value;
  let result = 1;
  for (let i = 0; i < length; i++) {
    result = (result * 31 + value.charCodeAt(i)) >>> 0;
  }
  return result;
}
