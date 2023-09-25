export function positionName(position: number): string {
  switch (position) {
    case 0:
      return "-";
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${position}th`;
  }
}
