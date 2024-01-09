import styled from 'styled-components';

import PostPreview from '../components/PostPreview';
import PostWriter from '../components/PostWriter';

export default function Post() {
  return (
    <Container>
      <Dim />

      <Contents>
        <PostPreview />
        <PostWriter />
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

const Contents = styled.div`
  display: grid;
  gap: 132px;
  width: auto;
  height: auto;
  align-items: center;
  grid-template-columns: 472px 532px;

  @media (max-width: 1200px) {
    gap: 60px;
    max-width: 100vw;
    grid-template-columns: 420px 480px;
  }
  @media (max-width: 1024px) {
    gap: 40px;
    max-width: 100vw;
    grid-template-columns: 360px 400px;
  }
  @media (max-width: 840px) {
    display: flex;
    flex-direction: column;
    gap: 60px;
    width: 100%;
    min-width: 240px;
    max-width: 470px;
  }
`;
