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
        <Paper>편지입니다</Paper>
      </PaperWrapper>
      <LetterFront src="letter_front.png" $isOut={stage === 'out'} />
      <LetterFrontWrapper $isOut={stage === 'out'}>
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
  transition: opacity 1s ease;
  opacity: ${({ $isOut }) => ($isOut ? 0 : 1)};
`;

const LetterFrontWrapper = styled.div<{ $isOut: boolean }>`
  position: absolute;

  width: 100%;
  aspect-ratio: 1.45;
  bottom: 0;
  transition: opacity 1s ease;

  opacity: ${({ $isOut }) => ($isOut ? 0 : 1)};
  z-index: ${({ $isOut }) => ($isOut ? 0 : 1)};
`;

const LetterFront = styled.img<{ $isOut: boolean }>`
  position: absolute;
  width: 104%;
  left: -2%;
  bottom: -2%;
  transition: opacity 1s ease;
  z-index: ${({ $isOut }) => ($isOut ? 100 : 0)};
  opacity: ${({ $isOut }) => ($isOut ? 0 : 1)};
`;

const LetterCover = styled.img<{ $isOpen: boolean; $isOut: boolean }>`
  position: absolute;
  width: 104%;
  left: -2%;
  top: 0%;

  transform-origin: center top;
  transition: transform 1s ease;
  ${({ $isOpen, $isOut }) =>
    $isOpen
      ? `transform: rotateX(180deg);`
      : $isOut
        ? `transform: rotateX(0deg);`
        : `transform:  rotateX(0deg);`}
  z-index: ${({ $isOut }) => ($isOut ? -1 : 1)};
`;

const PaperWrapper = styled.div<{ $isOut: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  aspect-ratio: ${({ $isOut }) => ($isOut ? 0.583 : 1.45)};
  z-index: ${({ $isOut }) => ($isOut ? 1 : 0)};

  padding: 0 10px;
  box-sizing: border-box;
`;

const Paper = styled.div`
  position: absolute;
  background-color: #f1f6f6;
  top: 10px;
  left: 0;
  width: 100%;
  aspect-ratio: 0.55;
`;
