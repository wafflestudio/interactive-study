import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Background from '../components/Background';
import Header from '../components/Header';
import NavigateButton, { Direction } from '../components/NavigateButton';
import SansForm from '../components/SansForm';
import { GRID } from '../constants/breakpoint';

export default function OutsideSans() {
  const router = useNavigate();

  return (
    <Container>
      <Content>
        <Header />
        <SansForm />
      </Content>

      <Background />
      <BackBtnContainer>
        <NavigateButton
          text={'BACK TO HOME'}
          direction={Direction.BACK}
          handleClick={() => router('/i-sans')}
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
  left: 72px;
  bottom: 110px;

  @media ${GRID.TABLET} {
    bottom: 0;
    left: 0;
  }
  @media ${GRID.MOBILE} {
    top: 20px;
    left: 20px;
  }
`;
