export function VintageFilter() {
  return (
    <filter
      id="vintage"
      x="0"
      y="0"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
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

      {/* 원본 이미지의 투명도 조절 */}
      <feComponentTransfer in="SourceGraphic" result="transparent">
        <feFuncA type="linear" slope="0.5" /> {/* 투명도 50% */}
      </feComponentTransfer>

      <feBlend
        mode="overlay"
        in="transparent"
        in2="grayscaleNoise"
        result="grainApplied"
      />
    </filter>
  );
}
