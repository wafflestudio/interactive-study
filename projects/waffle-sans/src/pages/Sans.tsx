import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Background from '../components/Background';
import Footer from '../components/Footer';
import NavigateButton, { Direction } from '../components/NavigateButton';
import SansWriter from '../components/SansWriter';
import LogoIcon from '/logo_black.svg';

export default function Sans() {
  const router = useNavigate();

  return (
    <Container>
      <Background />

      <Content>
        <Header>
          <Logo src={LogoIcon} alt="waffle sans" />
        </Header>

        <SansWriter />

        <BackBtnContainer>
          <NavigateButton
            text={'BACK TO HOME'}
            direction={Direction.BACK}
            handleClick={() => router('/')}
          />
        </BackBtnContainer>
        <Footer />
      </Content>
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

const Header = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 43px;
`;

const Logo = styled.img`
  width: 99px;
  height: 53px;
`;

const BackBtnContainer = styled.div`
  position: absolute;
  width: auto;
  height: auto;
  left: 100px;
  bottom: 150px;
`;
