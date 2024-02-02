import { useCallback, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import ReceivedContent from './ReceivedContent';

const stages = [`shake`, `close`, `open`, `out`] as const;

export default function Letter() {
  const [stage, setStage] = useState<(typeof stages)[number]>('shake');

  const onClickLetter = useCallback(() => {
    const currentStageIndex = stages.findIndex((s) => s === stage);
    if (currentStageIndex === stages.length - 1) return;
    setStage(stages[currentStageIndex + 1]);
  }, [stage]);

  return (
    <>
      <BackgroundHider $isOut={stage === 'out'} />
      <Container onClick={onClickLetter} $stage={stage}>
        <LetterBack $isOut={stage === 'out'} />
        <PaperWrapper $isOut={stage === 'out'}>
          <ReceivedContent
            sansContent="interactive study"
            from="Interactive Study"
          />
        </PaperWrapper>
        <LetterFront
          src="letter_front_main_blue.png"
          $isOut={stage === 'out'}
        />
        <LetterFront
          src="letter_front_bottom_blue.png"
          $isOut={stage === 'out'}
        />
        <LetterCoverWrapper $isOpen={stage === 'open'} $isOut={stage === 'out'}>
          <LetterCoverInside
            src="letter_cover_inside_blue.png"
            $isOpen={stage === 'open' || stage === 'out'}
            $isOut={stage === 'out'}
          />
          <LetterCoverOutside
            src="letter_cover_outside_blue.png"
            $isOpen={stage === 'open' || stage === 'out'}
            $isOut={stage === 'out'}
          />
          <Ribbon
            $isGone={stage !== 'shake'}
            $isOpen={stage === 'open' || stage === 'out'}
            src="letter_ribbon.png"
          />
        </LetterCoverWrapper>
      </Container>
    </>
  );
}

const Container = styled.div<{ $stage: 'shake' | 'close' | 'open' | 'out' }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $stage }) => ($stage === 'out' ? 0.583 : 1.45)};

  transition: 1s ease;

  display: flex;
  flex-direction: column;
  align-items: center;

  z-index: 1;
  ${({ $stage }) =>
    $stage === 'shake' &&
    css`
      animation: ${shake} 0.2s infinite alternate linear;
    `}
`;

const BackgroundHider = styled.div<{ $isOut: boolean }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #475e65;
  pointer-events: none;
  transition: 1s ease;
  opacity: ${({ $isOut }) => ($isOut ? 1 : 0)};
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

const LetterFront = styled.img<{ $isOut: boolean }>`
  position: absolute;
  width: 100%;
  bottom: 0;

  transition: opacity 1s ease;

  z-index: ${({ $isOut }) => ($isOut ? 100 : 0)};
  opacity: ${({ $isOut }) => ($isOut ? 0 : 1)};

  filter: drop-shadow(0px -6px 6px rgba(0, 0, 0, 0.05));
  pointer-events: none;
`;

const LetterCoverWrapper = styled.div<{ $isOpen: boolean; $isOut: boolean }>`
  position: absolute;

  width: 100%;
  aspect-ratio: 1.45;
  bottom: 0;
  transition: opacity 1s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: 1s ease;
  transition-property: transform, opacity;

  transform-origin: center top;
  ${({ $isOpen, $isOut }) =>
    ($isOpen || $isOut) && `transform: rotateX(180deg);`}

  opacity: ${({ $isOut }) => ($isOut ? 0 : 1)};
  z-index: ${({ $isOut }) => ($isOut ? -1 : 1)};
  pointer-events: none;
`;

const LetterCoverInside = styled.img<{ $isOpen: boolean; $isOut: boolean }>`
  position: absolute;
  width: 100%;
  top: 0;

  filter: drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.1));
`;

const LetterCoverOutside = styled.img<{ $isOpen: boolean; $isOut: boolean }>`
  position: absolute;
  width: 100%;
  top: 0;

  filter: drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.1));
`;

const Ribbon = styled.img<{ $isGone: boolean; $isOpen: boolean }>`
  position: relative;
  width: 55%;
  opacity: ${({ $isGone }) => ($isGone ? 0 : 1)};
  transform: translateY(24%);
  transition: 1s ease;
  z-index: 1;
  ${({ $isOpen }) => $isOpen && `display: none;`}
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

const shake = keyframes`
  from {
    transform: rotate(-2deg);
  }
  to {
    transform: rotate(2deg);
  }
`;
