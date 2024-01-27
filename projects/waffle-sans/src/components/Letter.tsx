import { useState } from 'react';
import styled from 'styled-components';

export default function Letter() {
  const [stage, setStage] = useState<'close' | 'open' | 'out'>('close');
  return (
    <Container
      onClick={() => (stage === 'close' ? setStage('open') : setStage('out'))}
      $stage={stage}
    >
      <LetterBack $isOut={stage === 'out'} />
      <PaperWrapper $isOut={stage === 'out'}>
        <Paper>가나다</Paper>
      </PaperWrapper>
      <LetterFrontWrapper $isOut={stage === 'out'}>
        <LetterFront src="letter_front.png" />
        <LetterCover
          src="letter_cover.png"
          $isOpen={stage !== 'close'}
          $isOut={stage === 'out'}
        />
      </LetterFrontWrapper>
    </Container>
  );
}

const Container = styled.div<{ $stage: 'close' | 'open' | 'out' }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $stage }) => ($stage === 'out' ? 0.583 : 1.45)};

  background-color: rgba(0, 0, 0, 0.5);
  transition: 1s ease;

  display: flex;
  flex-direction: column;

  align-items: center;

  z-index: 1;
`;

const LetterBack = styled.div<{ $isOut: boolean }>`
  position: absolute;
  background-color: #97baba;
  width: 100%;
  aspect-ratio: 1.45;
  bottom: 0;
  transition: 1s ease;
  opacity: 1;
  ${({ $isOut }) => ($isOut ? `opacity: 0;` : ``)}
`;

const LetterFrontWrapper = styled.div<{ $isOut: boolean }>`
  position: absolute;

  width: 100%;
  aspect-ratio: 1.45;
  bottom: 0;
  transition: 1s ease;

  opacity: 1;
  ${({ $isOut }) => ($isOut ? `opacity: 0;` : ``)}
`;

const LetterFront = styled.img`
  position: absolute;
  width: 104%;
  left: -2%;
  bottom: -2%;
`;

const LetterCover = styled.img<{ $isOpen: boolean; $isOut: boolean }>`
  position: absolute;
  width: 104%;
  left: -2%;
  top: 0%;

  transform-origin: center top;
  transition: 1s ease;
  ${({ $isOpen }) =>
    $isOpen ? `transform: rotateX(180deg);` : `transform: rotateX(0deg);`}
  ${({ $isOut }) => ($isOut ? `z-index:-1` : ``)}
`;

const PaperWrapper = styled.div<{ $isOut: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  aspect-ratio: ${({ $isOut }) => ($isOut ? 0.583 : 1.45)};

  padding: 0 10px;
  box-sizing: border-box;
`;

const Paper = styled.div`
  background-color: #f1f6f6;
  width: 100%;
  aspect-ratio: 0.55;
`;
