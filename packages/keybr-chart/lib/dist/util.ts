export function smooth(data: readonly number[], wnd: number): number[] {
  const result = [...data];
  for (let i = wnd; i < data.length - wnd; i++) {
    let sum = data[i];
    for (let j = 1; j <= wnd; j++) {
      sum += data[i - j] + data[i + j];
    }
    result[i] = sum / (wnd * 2 + 1);
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
