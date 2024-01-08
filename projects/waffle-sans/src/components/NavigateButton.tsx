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
  direction: Direction;
  handleClick: () => void;
}

export default function NavigateButton({
  text,
  color = '#93AFAE',
  direction = Direction.BACK,
  handleClick,
}: Props) {
  return (
    <Container onClick={handleClick}>
      {direction === Direction.BACK && <ArrowBackIcon color={color} />}
      <Text color={color}>{text}</Text>
      {direction === Direction.FORWARD && <ArrowForwardIcon color={color} />}
    </Container>
  );
}

/* STYLES */
const Container = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  cursor: pointer;
  border: none;
  background: transparent;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const Text = styled.span<{ color: string }>`
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  color: ${({ color }) => color};
`;
