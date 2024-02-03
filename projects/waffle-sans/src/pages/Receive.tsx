import { useMemo } from 'react';
import styled from 'styled-components';

import Letter from '../components/Letter';
import MobileFooter from '../components/MobileFooter';
import { decodeParams } from '../utils/crypto';

export default function Receive() {
  const { sender, content, receiver, sans, mode } = useMemo(
    () => decodeParams(new URL(window.location.href)),
    [],
  );

  return (
    <Container $isOutside={mode === 'o'}>
      <Dim />
      <Main>
        <ToWhom>{receiver}님에게 편지가 왔어요!</ToWhom>
        <Letter sender={sender} content={content} sans={sans} mode={mode} />
        <FooterWrapper>
          <MobileFooter />
        </FooterWrapper>
      </Main>
    </Container>
  );
}

const Container = styled.div<{ $isOutside: boolean }>`
  width: 100%;
  height: 100%;

  background-size: cover;
  background-position: top;
  background-image: url(${({ $isOutside }) =>
    $isOutside
      ? `${import.meta.env.BASE_URL}background_outside_m_ver.png`
      : `${import.meta.env.BASE_URL}background_inside_m_ver.png`});

  display: flex;
  justify-content: center;
  overflow: hidden;
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
  width: 380px;
  min-width: 320px;
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
