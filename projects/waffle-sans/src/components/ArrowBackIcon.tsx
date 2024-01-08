interface Props {
  size?: number;
  color?: string;
}

export default function ArrowBackIcon({ size = 16, color = '#93AFAE' }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4.91536 8.49999L8.7128 12.2974L8 13L3 8L8 3L8.7128 3.70255L4.91536 7.50002H13V8.49999H4.91536Z"
        fill={color}
      />
    </svg>
  );
}
