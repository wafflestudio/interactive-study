import styled from 'styled-components';

interface Props {
  name: string;
  value: string;
  color?: string;
  label?: string;
  width?: string;
  height?: string;
  threshold?: number;
  placeholder?: string;
  thresholdColor?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  name,
  value,
  label,
  handleChange,
  threshold = 50,
  width = '635px',
  height = '88px',
  color = '#f1f6f6',
  thresholdColor = '#718f8d',
  placeholder = 'interactive study',
}: Props) {
  return (
    <Container $width={width} $height={height}>
      {!!label && <Label $color={color}>{label}</Label>}
      <Area
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />

      <TextCount
        $color={thresholdColor}
      >{`${value?.length}/${threshold}`}</TextCount>
    </Container>
  );
}

/* STYLES */
const Container = styled.div<{ $width: string; $height: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
`;

const Label = styled.label<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Area = styled.input`
  width: 100%;
  height: 100%;
  padding: 5px 60px 5px 8px;
  flex-direction: column;
  border: none;
  border-radius: 2px;
  box-sizing: border-box;
  background: #fff;
  color: #2e3a2c;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  outline: none;

  &::placeholder {
    color: #a3a3a3;
  }
  &:focus {
    outline: none;
  }
`;

const TextCount = styled.div<{ $color: string }>`
  position: absolute;
  right: 8px;
  bottom: 4px;
  color: ${({ $color }) => $color};
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background: #fff;
  border-radius: 6px;
`;
