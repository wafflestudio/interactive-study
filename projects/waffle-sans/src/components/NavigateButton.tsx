import { useState } from 'react';
import styled from 'styled-components';

import { GRID } from '../constants/breakpoint';
import ArrowBackIcon from '../icons/ArrowBackIcon';
import ArrowForwardIcon from '../icons/ArrowForwardIcon';

export enum Direction {
  BACK = 'back',
  FORWARD = 'forward',
}

interface Props {
  text: string;
  color?: string;
  width?: string;
  height?: string;
  hoveredColor?: string;
  direction: Direction;
  handleClick: () => void;
}

export default function NavigateButton({
  text,
  width,
  height,
  color = '#676f6f',
  hoveredColor = '#2E3A2C',
  direction = Direction.BACK,
  handleClick,
}: Props) {
  const [mouseEnter, setMouseEnter] = useState(false);

  return (
    <Container
      onClick={handleClick}
      $width={width}
      $height={height}
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
const Container = styled.button<{ $width?: string; $height?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 5px 0;
  cursor: pointer;
  border: none;
  background: transparent;
  transition: all 0.2s ease-in-out;
  width: ${({ $width }) => (!$width ? '200px' : $width)};
  height: ${({ $height }) => (!$height ? '100px' : $height)};

  &:hover {
    transform: scale(1.06);
  }

  @media ${GRID.MOBILE} {
    width: ${({ $width }) => (!$width ? '200px' : $width)};
    height: ${({ $height }) => (!$height ? '50px' : $height)};
  }
`;

const Text = styled.span<{ $color: string }>`
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  color: ${({ $color }) => $color};
`;
