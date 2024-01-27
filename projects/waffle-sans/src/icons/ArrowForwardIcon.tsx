interface Props {
  size?: number;
  color?: string;
}

export default function ArrowForwardIcon({
  size = 16,
  color = '#93AFAE',
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size + 1}
      viewBox="0 0 16 17"
      fill="none"
    >
      <path
        d="M11.0846 8.00001L7.2872 4.20255L8 3.5L13 8.5L8 13.5L7.2872 12.7974L11.0846 8.99998H3V8.00001H11.0846Z"
        fill={color}
      />
    </svg>
  );
}
