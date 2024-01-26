import styled from 'styled-components';

interface Props {
  text: string;
  color?: string;
  hoveredColor?: string;
  icon?: React.ReactNode;
  handleClick: () => void;
}

export default function Button({
  icon,
  text,
  color = '#FFFFFF',
  hoveredColor = '#FFFFFF',
  handleClick,
}: Props) {
  return (
    <Container
      $color={color}
      $hoveredColor={hoveredColor}
      onClick={handleClick}
    >
      {icon}
      {text}
    </Container>
  );
}

/* STYLES */
const Container = styled.button<{ $color: string; $hoveredColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  padding: 5px 8px;
  gap: 4px;
  border: none;
  border-radius: 2px;
  color: #2e3a2c;
  background-color: ${({ $color }) => $color};
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.06);
    background-color: ${({ $hoveredColor }) => $hoveredColor};
  }
`;
