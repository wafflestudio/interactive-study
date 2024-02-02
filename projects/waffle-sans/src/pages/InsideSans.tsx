import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Background from '../components/Background';
import Header from '../components/Header';
import NavigateButton, { Direction } from '../components/NavigateButton';
import SansForm from '../components/SansForm';
import { GRID } from '../constants/breakpoint';
import { Mode } from '../types/mode';

export default function OutsideSans() {
  const router = useNavigate();
  // TODO: back button 위치 애매함

  return (
    <Container>
      <Content>
        <Header mode={'dark'} />
        <SansForm mode={Mode.INSIDE} />
      </Content>

      <Background mode={Mode.INSIDE} />
      <BackBtnContainer>
        <NavigateButton
          isWideArea
          color={'#2B1C1A'}
          hoveredColor={'#2B1C1A'}
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
  position: absolute;
  width: auto;
  height: auto;
  top: 14%;
  right: 5vw;
  z-index: 3;

  @media ${GRID.TABLET} {
    top: 14%;
    right: 5vw;
  }
  @media ${GRID.MOBILE} {
    bottom: 190px;
    left: 0;
  }
`;
