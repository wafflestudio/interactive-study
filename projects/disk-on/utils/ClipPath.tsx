type ClipPathProps = {
  holeSize: number;
};

function ClipPath({ holeSize }: ClipPathProps) {
  const radiusUnit = holeSize / 100 / 2;
  return (
    <svg>
      <defs>
        <clipPath
          id={`cd${holeSize}`}
          clipPathUnits="objectBoundingBox"
          clipRule="evenodd"
        >
          <path
            d={`
        M1 0.5
        A0.5 0.5 0 0 1 0 0.5
        A0.5 0.5 0 0 1 1 0.5
        L${0.5 + radiusUnit} 0.5
        A${radiusUnit} ${radiusUnit} 0 0 1 ${0.5 - radiusUnit} 0.5
        A${radiusUnit} ${radiusUnit} 0 0 1 ${0.5 + radiusUnit} 0.5
        Z`}
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default ClipPath;
