import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import LogoIcon from '../components/Logo';
import { GRID } from '../constants/breakpoint';

export default function Home() {
  const router = useNavigate();

  return (
    <Container>
      <LogoContainer>
        <LogoIcon color={'#fff'} width={'100%'} height={'100%'} />
      </LogoContainer>

      <PositionContainer onClick={() => router('/o-sans')}>
        <Blur>OUTDOOR</Blur>
        <Outside></Outside>
      </PositionContainer>

      <PositionContainer onClick={() => router('/i-sans')}>
        <Blur>INDOOR</Blur>
        <Inside></Inside>
      </PositionContainer>
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;

  @media ${GRID.MOBILE} {
    grid-template-columns: 100%;
  }
`;

const LogoContainer = styled.div`
  position: fixed;
  top: 40px;
  left: 48px;
  width: 99px;
  height: 53px;
  z-index: 2;

  @media ${GRID.MOBILE} {
    width: 66px;
    height: 35px;
    top: 24px;
    left: 21px;
  }
`;

const PositionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Blur = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: 74px;
  z-index: 1;
  pointer-events: none;

  @media ${GRID.MOBILE} {
    font-size: 20px;
  }
`;

const SideButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 100%;
  border: none;
  padding: 0;
  background-size: cover;
  background-position: center;
  backdrop-filter: blur(15px);
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.26);
  }
`;

const Outside = styled(SideButton)`
  background-image: url('/background_outside_home.png');
`;

const Inside = styled(SideButton)`
  background-image: url('/background_inside_home.png');
`;
