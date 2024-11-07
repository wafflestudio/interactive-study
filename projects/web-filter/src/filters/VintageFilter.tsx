export function VintageFilter() {
  return (
    <filter id="vintageFilter">
      {/* 그레인 효과 추가 */}
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.8"
        numOctaves="2"
        stitchTiles="stitch"
        result="noise"
      />

      <feColorMatrix
        type="saturate"
        values="0"
        in="noise"
        result="grayscaleNoise"
      />
      <feBlend
        mode="overlay"
        in="sepia"
        in2="grayscaleNoise"
        result="grainApplied"
      />
    </filter>
  );
}
