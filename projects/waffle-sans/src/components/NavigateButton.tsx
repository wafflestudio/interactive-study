import { useState } from 'react';
import styled from 'styled-components';

import ArrowBackIcon from './ArrowBackIcon';
import ArrowForwardIcon from './ArrowForwardIcon';

export enum Direction {
  BACK = 'back',
  FORWARD = 'forward',
}

interface Props {
  text: string;
  color?: string;
  isWideArea?: boolean;
  hoveredColor?: string;
  direction: Direction;
  handleClick: () => void;
}

export default function NavigateButton({
  text,
  color = '#93AFAE',
  isWideArea = false,
  hoveredColor = '#2E3A2C',
  direction = Direction.BACK,
  handleClick,
}: Props) {
  const [mouseEnter, setMouseEnter] = useState(false);

  return (
    <Container
      onClick={handleClick}
      $isWideArea={isWideArea}
      onMouseEnter={() => setMouseEnter(true)}
      onMouseLeave={() => setMouseEnter(false)}
    >
      {direction === Direction.BACK && (
        <ArrowBackIcon color={mouseEnter ? hoveredColor : color} />
      )}
      <Text $color={mouseEnter ? hoveredColor : color}>{text}</Text>
      {direction === Direction.FORWARD && (
        <ArrowForwardIcon color={mouseEnter ? hoveredColor : color} />
      )}
    </Container>
  );
}

/* STYLES */
const Container = styled.button<{ $isWideArea?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  cursor: pointer;
  border: none;
  background: transparent;
  transition: all 0.2s ease-in-out;
  width: ${({ $isWideArea }) => ($isWideArea ? '250px' : 'auto')};
  height: ${({ $isWideArea }) => ($isWideArea ? '164px' : 'auto')};

  &:hover {
    transform: scale(1.06);
  }
`;

const Text = styled.span<{ $color: string }>`
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  color: ${({ $color }) => $color};
`;
