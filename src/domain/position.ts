export function generatePosition(): { x: number; y: number } {
  const x = Math.floor(Math.random() * 71) + 8;
  const y = Math.floor(Math.random() * 61) + 12;
  return { x, y };
}
