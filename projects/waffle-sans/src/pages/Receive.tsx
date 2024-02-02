import styled from 'styled-components';

import Letter from '../components/Letter';
import MobileFooter from '../components/MobileFooter';

export default function Receive() {
  return (
    <Container>
      <Dim />
      <Main>
        <ToWhom>채원님에게 편지가 왔어요!</ToWhom>
        <Letter />
        <FooterWrapper>
          <MobileFooter />
        </FooterWrapper>
      </Main>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;

  background-size: cover;
  background-position: left;
  background-image: url('${import.meta.env.BASE_URL}background_outside.png');

  display: flex;
  justify-content: center;
`;

const Dim = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
`;

const Main = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  min-width: 380px;
  height: 100%;

  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const ToWhom = styled.div`
  position: absolute;
  top: 20%;
  color: #f1f6f6;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const FooterWrapper = styled.div`
  position: absolute;
  bottom: 60px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;
