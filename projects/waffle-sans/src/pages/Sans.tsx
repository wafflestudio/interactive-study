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
      {/* <Sun /> */}

      <BackBtnContainer>
        <NavigateButton
          text={'BACK TO HOME'}
          direction={Direction.BACK}
          handleClick={() => router('/')}
        />
      </BackBtnContainer>
      <Content>
        <Header>
          <Logo src={LogoIcon} alt="waffle sans" />
        </Header>

        <SansWriter />

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

const Sun = styled.div`
  width: 4vw;
  aspect-ratio: 1;
  background: #fcf4a3;
  border-radius: 50%;
  box-shadow:
    0 0 30px 8px #ffcc00,
    0 0 60px 50px #fcf4a3;
  position: absolute;
  top: 130px;
  right: 200px;
  opacity: 0.7;

  @keyframes sunset {
    to {
      transform: translateY(100vh) scale(0.5);
      opacity: 0;
    }
  }
  animation: sunset 3s forwards;
`;
