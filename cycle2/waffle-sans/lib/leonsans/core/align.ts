export function setAlignGapX(sw: number, tw: number): AlignGapX {
  return {
    c: (sw - tw) / 2,
    r: sw - tw,
    l: 0,
  };
}

export function getAlignGapX(align: Align, alignGapX: AlignGapX): number {
  if (align == 'center') {
    return alignGapX.c;
  } else if (align == 'right') {
    return alignGapX.r;
  } else {
    return alignGapX.l;
  }
}
