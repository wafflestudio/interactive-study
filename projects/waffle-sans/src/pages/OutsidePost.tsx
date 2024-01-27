import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Background from '../components/Background';
import Header from '../components/Header';
import NavigateButton, { Direction } from '../components/NavigateButton';
import PostForm from '../components/PostForm';
import PostPreview from '../components/PostPreview';
import { GRID } from '../constants/breakpoint';
import { Mode } from '../types/mode';

export default function OutsidePost() {
  const router = useNavigate();
  const [mobilePreview, setMobilePreview] = useState(false);

  const handlePreviewClick = useCallback(() => {
    setMobilePreview(true);
  }, []);

  const handlePreviewClose = useCallback(() => {
    setMobilePreview(false);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobilePreview(false);
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <Container>
      <Header mode={'dark'} />
      <Background mode={Mode.OUTSIDE} />
      <Dim />
      <MobileContainer visible={mobilePreview} onClick={handlePreviewClose}>
        <PostPreview mode={Mode.OUTSIDE} />
      </MobileContainer>

      <Contents>
        <ButtonContainer>
          <NavigateButton
            text={'돌아가기'}
            color="#F1F6F6"
            hoveredColor="#F1F6F6"
            direction={Direction.BACK}
            handleClick={() => router(-1)}
          />
        </ButtonContainer>

        <Grid>
          <PreviewContainer>
            <PostPreview mode={Mode.OUTSIDE} />
          </PreviewContainer>
          <FormContainer>
            <PostForm
              mode={Mode.OUTSIDE}
              handlePreviewClick={handlePreviewClick}
            />
          </FormContainer>
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
  width: 100vw;
  height: auto;
  gap: 10vh;
  min-height: 100vh;
  box-sizing: border-box;

  @media ${GRID.MOBILE} {
    gap: 35px;
  }
`;

const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.5;
  background: #000;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  height: auto;
  margin: 0 auto;
  padding: 0 20px 60px 20px;
  overflow: auto;
  box-sizing: border-box;
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

  @media ${GRID.MOBILE} {
    width: 100%;
    padding: 0 35px 60px 35px;
  }
`;

const PreviewContainer = styled.div`
  @media ${GRID.MOBILE} {
    display: none;
  }
`;

const FormContainer = styled.div`
  width: 483px;
  height: auto;

  @media ${GRID.MOBILE} {
    width: 100%;
  }
`;

const Grid = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: space-between;
  gap: 8vw;

  @media ${GRID.MOBILE} {
    width: 100%;
  }
`;

const MobileContainer = styled.div<{ visible?: boolean }>`
  display: none;

  @media ${GRID.MOBILE} {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease-in-out;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    visible: ${({ visible }) => (visible ? 'visible' : 'hidden')};
    pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
    z-index: 100;
  }
`;
