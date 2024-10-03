export function smooth(data: readonly number[], wnd: number): number[] {
  const result = [...data];
  for (let i = 0; i < data.length; i++) {
    const a = Math.max(0, i - wnd);
    const b = Math.min(data.length, i + wnd + 1);
    let sum = 0;
    for (let j = a; j < b; j++) {
      sum += data[j];
    }
    result[i] = sum / (b - a);
  }
  return result;
}

export function bucketize(data: readonly number[], buckets: number): number[] {
  const result = [...data];
  const bucketSize = data.length / buckets;
  for (let i = 0; i < buckets; i++) {
    const a = Math.floor(i * bucketSize);
    const b = Math.floor((i + 1) * bucketSize);
    let sum = 0;
    for (let j = a; j < b; j++) {
      sum += data[j];
    }
    for (let j = a; j < b; j++) {
      result[j] = sum / (b - a);
    }
  }
  return result;
}
