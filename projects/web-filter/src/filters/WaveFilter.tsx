export function WaveFilter() {
  return (
    <filter
      id="filter"
      x="-20%"
      y="-20%"
      width="140%"
      height="140%"
      filterUnits="objectBoundingBox"
      primitiveUnits="userSpaceOnUse"
      color-interpolation-filters="linearRGB"
    >
      <feTurbulence
        type="turbulence"
        baseFrequency="0.01 0.05"
        numOctaves="2"
        seed="2"
        stitchTiles="noStitch"
        result="turbulence"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="turbulence"
        scale="20"
        xChannelSelector="G"
        yChannelSelector="A"
        result="displacementMap"
      />
    </filter>
  );
}
