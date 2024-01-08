import styled from 'styled-components';

import Background from '../components/Background';
import Footer from '../components/Footer';
import SansWriter from '../components/SansWriter';
import LogoIcon from '/logo.svg';

export default function Sans() {
  return (
    <Container>
      <Background />

      <Header>
        <Logo src={LogoIcon} alt="waffle sans" />
      </Header>

      <SansWriter />

      <Footer />
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
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
