import { Align, AlignGapX } from "./types";

export function setAlignGapX(sw: number, tw: number): AlignGapX {
  return {
    center: (sw - tw) / 2,
    right: sw - tw,
    left: 0,
  };
}

export function getAlignGapX(align: Align, alignGapX: AlignGapX): number {
  if (align == 'center') {
    return alignGapX.center;
  } else if (align == 'right') {
    return alignGapX.right;
  } else {
    return alignGapX.left;
  }
}
