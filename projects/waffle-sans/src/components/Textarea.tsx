import { TextareaHTMLAttributes, useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  color?: string;
  label?: string;
  width?: string;
  height?: string;
  threshold?: number;
  placeholder?: string;
  defaultValue?: string;
  thresholdColor?: string;
  handleChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea(props: Props) {
  const {
    value,
    label,
    onInput,
    handleChange,
    threshold = 50,
    width = '100%',
    height = '88px',
    color = '#f1f6f6',
    defaultValue = '',
    thresholdColor = '#718f8d',
    placeholder = 'interactive study',
  } = props;
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (value) setCount(value?.length);
    if (defaultValue) setCount(defaultValue?.length);
  }, [defaultValue, value]);

  return (
    <Container $width={width} $height={height}>
      {!!label && <Label $color={color}>{label}</Label>}
      <Area
        value={value}
        onInput={(e) => {
          onInput && onInput(e);
          setCount(e.currentTarget.value.length);
        }}
        onChange={handleChange}
        placeholder={placeholder}
        {...props}
      />

      <TextCount $color={thresholdColor}>{`${count}/${threshold}`}</TextCount>
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

const Area = styled.textarea`
  resize: none;
  width: 100%;
  height: 100%;
  padding: 5px 8px 20px 8px;
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
  bottom: 5px;
  color: ${({ $color }) => $color};
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background: #fff;
  border-radius: 6px;
`;
