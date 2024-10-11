export function ensureVisible(
  list: HTMLElement | null,
  item: HTMLElement | null,
): void {
  if (list == null || item == null) {
    return;
  }
  if (item.offsetTop - list.scrollTop < 0) {
    list.scrollTop = item.offsetTop;
    return;
  }
  if (item.offsetTop + item.offsetHeight - list.scrollTop > list.offsetHeight) {
    list.scrollTop = item.offsetTop + item.offsetHeight - list.offsetHeight;
    return;
  }
}
