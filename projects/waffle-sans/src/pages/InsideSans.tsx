import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Background from '../components/Background';
import Header from '../components/Header';
import NavigateButton, { Direction } from '../components/NavigateButton';
import SansForm from '../components/SansForm';
import SnowFlakes from '../components/SnowFlakes';
import { GRID } from '../constants/breakpoint';
import { Mode } from '../types/mode';

export default function OutsideSans() {
  const router = useNavigate();

  return (
    <Container>
      <BgColor />
      <Background mode={Mode.INSIDE} />

      <Content>
        <Header mode={'dark'} />
        <SansForm mode={Mode.INSIDE} />
      </Content>

      <WindowContainer>
        <Window>
          <CanvasContainer>
            <Snow>
              <SnowFlakes />
            </Snow>
          </CanvasContainer>
        </Window>
        <Window>
          <Snow>
            <SnowFlakes />
          </Snow>
        </Window>
      </WindowContainer>
      <BackBtnContainer>
        <NavigateButton
          width="auto"
          height="auto"
          color={'#fff'}
          hoveredColor={'#fff'}
          text={'GO TO OUTSIDE'}
          direction={Direction.FORWARD}
          handleClick={() => router('/o-sans')}
        />
      </BackBtnContainer>
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 30px;
`;

const BgColor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -5;
  background: #5e3517;
  pointer-events: none;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  height: auto;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

const BackBtnContainer = styled.div`
  width: auto;
  height: auto;
  z-index: 3;
  position: absolute;
  top: 20px;
  right: 16vw;

  @media ${GRID.TABLET} {
    right: 2vw;
  }
  @media ${GRID.MOBILE} {
    left: 20px;
  }
`;

const WindowContainer = styled.div`
  width: auto;
  height: auto;
  display: flex;
  position: absolute;
  top: 60px;
  right: 16vw;
  border: 0.6vw solid #292222;
  border-radius: 10px;
  z-index: -4;
  pointer-events: none;

  @media ${GRID.TABLET} {
    right: 2vw;
  }
  @media ${GRID.MOBILE} {
    display: none;
  }
`;

const Window = styled.div`
  display: flex;
  position: relative;
  justify-content: flex-end;
  align-items: center;
  height: 20vh;
  aspect-ratio: 235 / 255;
  background: #bfcde3;
  border: 0.8vh solid #292222;
`;

const Snow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  top: 0;
  left: 0;
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
