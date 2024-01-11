import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import NavigateButton, { Direction } from '../components/NavigateButton';
import PostPreview from '../components/PostPreview';
import PostWriter from '../components/PostWriter';

export default function Post() {
  const router = useNavigate();

  return (
    <Container>
      <Dim />

      <Contents>
        <ButtonContainer>
          <NavigateButton
            text={'돌아가기'}
            color="#F1F6F6"
            hoveredColor="#F1F6F6"
            direction={Direction.BACK}
            handleClick={() => router('/sans')}
          />
        </ButtonContainer>

        <Grid>
          <PostPreview />
          <PostWriter />
        </Grid>
      </Contents>
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: auto;
  min-height: 100vh;
  box-sizing: border-box;

  @media (max-width: 840px) {
    padding: 30px 24px;
  }
`;

const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-size: cover;
  background-position: center;
  background-image: url('/background_paper.png');
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
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

  @media (max-width: 1200px) {
    max-width: 100vw;
  }
  @media (max-width: 1024px) {
    max-width: 100vw;
  }
  @media (max-width: 840px) {
    width: 100%;
    min-width: 240px;
    max-width: 470px;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 132px;
  width: 100%;
  height: auto;
  align-items: center;
  grid-template-columns: 472px 532px;

  @media (max-width: 1200px) {
    gap: 60px;
    grid-template-columns: 420px 480px;
  }
  @media (max-width: 1024px) {
    gap: 40px;
    grid-template-columns: 360px 400px;
  }
  @media (max-width: 840px) {
    display: flex;
    flex-direction: column;
    gap: 60px;
    width: 100%;
  }
`;
