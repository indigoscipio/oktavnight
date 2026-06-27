const offeringImages = [
  "/offerings/ash-hourglass.webp",
  "/offerings/ashen-chalice.webp",
  "/offerings/black-quill.webp",
  "/offerings/broken-mask.webp",
  "/offerings/chapel-bell.webp",
  "/offerings/crown-of-thorns.webp",
  "/offerings/dried-lily.webp",
  "/offerings/ember-vial.webp",
  "/offerings/gothic-key.webp",
  "/offerings/mourning-locket.webp",
  "/offerings/mourning-ring.webp",
  "/offerings/prayer-beads.webp",
  "/offerings/sealed-eye.webp",
  "/offerings/sealed-prayer.webp",
  "/offerings/votive-candle.webp",
  "/offerings/withered-rose.webp",
];

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getOfferingImagePath(id: string): string {
  return offeringImages[hashId(id) % offeringImages.length];
}
