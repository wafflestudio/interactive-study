import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../components/Button';

export default function Home() {
  const router = useNavigate();

  return (
    <Container>
      <Background />

      <Button
        text={'편지쓰러가기 (임시)'}
        handleClick={() => router('/sans')}
      />
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center; // TODO
  align-items: center;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 30px;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-image: url('/background_outside.png');
  z-index: -1;
`;
