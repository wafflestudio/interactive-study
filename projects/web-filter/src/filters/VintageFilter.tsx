export function VintageFilter() {
  return (
    <filter id="vintageFilter">
      {/* 세피아 톤 추가 */}
      <feColorMatrix
        type="matrix"
        values="
          0.393 0.769 0.189 0 0
          0.349 0.686 0.168 0 0
          0.272 0.534 0.131 0 0
          0     0     0     1 0"
        result="sepia"
      />

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
