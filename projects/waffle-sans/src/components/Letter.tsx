import { useCallback, useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import ReceivedContent from './ReceivedContent';

const stages = [`shake`, `close`, `open`, `out`] as const;

const isTextured = true;

type LetterProps = {
  sender: string;
  content: string;
  sans: string;
  mode: string;
};

export default function Letter({ sender, content, sans, mode }: LetterProps) {
  const [stage, setStage] = useState<(typeof stages)[number]>('shake');
  const parsedMode = useMemo(
    () => (mode === 'o' ? 'outside' : 'inside'),
    [mode],
  );

  const onClickLetter = useCallback(() => {
    const currentStageIndex = stages.findIndex((s) => s === stage);
    if (currentStageIndex === stages.length - 1) return;
    setStage(stages[currentStageIndex + 1]);
  }, [stage]);

  return (
    <>
      <BackgroundHider
        $isOutside={parsedMode === 'outside'}
        $isOut={stage === 'out'}
      />
      <Container onClick={onClickLetter} $stage={stage}>
        <LetterBack
          $isOutside={parsedMode === 'outside'}
          $isOut={stage === 'out'}
        />
        <PaperWrapper $isOut={stage === 'out'}>
          <ReceivedContent
            sans={sans}
            sender={sender}
            content={content}
            mode={mode}
          />
        </PaperWrapper>
        <LetterFront
          src={`letter_front_main_${parsedMode}${
            isTextured ? '_textured' : ''
          }.png`}
          $isOut={stage === 'out'}
        />
        <LetterFront
          src={`letter_front_bottom_${parsedMode}${
            isTextured ? '_textured' : ''
          }.png`}
          $isOut={stage === 'out'}
        />
        <LetterCoverWrapper $isOpen={stage === 'open'} $isOut={stage === 'out'}>
          <LetterCoverInside
            src={`letter_cover_inner_${parsedMode}${
              isTextured ? '_textured' : ''
            }.png`}
            $isOut={stage === 'out'}
          />
          <LetterCoverOutside
            src={`letter_cover_outer_${parsedMode}${
              isTextured ? '_textured' : ''
            }.png`}
            $isOut={stage === 'out'}
          />
        </LetterCoverWrapper>
        <Ribbon
          $isOutside={parsedMode === 'outside'}
          $isGone={stage !== 'shake'}
          $isOpen={stage === 'open' || stage === 'out'}
          src={`sealing_${parsedMode}.png`}
        />
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
  ${({ $stage }) =>
    ($stage === 'open' || $stage === 'out') &&
    `
    transform: translateY(20px);
  `}
`;

const BackgroundHider = styled.div<{ $isOut: boolean; $isOutside: boolean }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: ${({ $isOutside }) => ($isOutside ? `#475e65` : '#251509')};
  transition: opacity 1s ease;
  opacity: ${({ $isOut }) => ($isOut ? 1 : 0)};
  z-index: 1;
`;

const LetterBack = styled.div<{ $isOut: boolean; $isOutside: boolean }>`
  position: absolute;
  background-color: ${({ $isOutside }) => ($isOutside ? '#97baba' : '#8D674D')};
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
  bottom: 0;

  width: 100%;
  aspect-ratio: 1.45;

  transition: opacity 1s ease;

  transition: 1s ease;
  transition-property: transform, opacity;

  transform-style: preserve-3d;
  transform-origin: center top;
  ${({ $isOpen, $isOut }) =>
    ($isOpen || $isOut) && `transform: rotateX(180deg);`}

  z-index: ${({ $isOut }) => ($isOut ? -1 : 1)};
  pointer-events: none;
`;

const LetterCoverInside = styled.img<{ $isOut: boolean }>`
  position: absolute;
  width: 100%;
  top: 0;

  transition: 1s ease;

  opacity: ${({ $isOut }) => ($isOut ? 0 : 1)};
  filter: drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.1));
`;

const LetterCoverOutside = styled.img<{ $isOut: boolean }>`
  position: absolute;
  width: 100%;
  top: 0;

  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;

  transition: 1s ease;

  opacity: ${({ $isOut }) => ($isOut ? 0 : 1)};
  filter: drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.1));
`;

const Ribbon = styled.img<{
  $isOutside: boolean;
  $isGone: boolean;
  $isOpen: boolean;
}>`
  position: relative;
  opacity: ${({ $isGone }) => ($isGone ? 0 : 1)};
  transform: translateY(${({ $isOutside }) => ($isOutside ? 24 : 120)}%);
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
