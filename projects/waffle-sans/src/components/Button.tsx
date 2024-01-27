import styled from 'styled-components';

interface Props {
  text: string;
  color?: string;
  textColor?: string;
  hoveredColor?: string;
  icon?: React.ReactNode;
  handleClick: () => void;
}

export default function Button({
  icon,
  text,
  color = '#FFFFFF',
  textColor = '#2E3A2C',
  hoveredColor = '#FFFFFF',
  handleClick,
}: Props) {
  return (
    <Container
      $color={color}
      $textColor={textColor}
      $hoveredColor={hoveredColor}
      onClick={handleClick}
    >
      {icon}
      {text}
    </Container>
  );
}

/* STYLES */
const Container = styled.button<{
  $color: string;
  $textColor: string;
  $hoveredColor: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  padding: 5px 8px;
  gap: 4px;
  border: none;
  border-radius: 2px;
  color: ${({ $textColor }) => $textColor};
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
