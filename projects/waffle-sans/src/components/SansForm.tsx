// TODO: import from leon-sans-react
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { GRID } from '../constants/breakpoint';
import useWreathSans from '../hooks/useWreathSans';
import ShareIcon from '../icons/ShareIcon';
import WriteIcon from '../icons/WriteIcon';
import { Mode } from '../types/mode';
import { encoder } from '../utils/crypto';
import Button from './Button';
import Textarea from './Textarea';

interface Props {
  mode?: Mode;
}

export default function SansForm({ mode = Mode.OUTSIDE }: Props) {
  const router = useNavigate();
  const defaultValue = useMemo(() => 'interactive study', []);
  const { ref, WreathSansCanvas, redraw, resize, getText, onInputHandler } =
    useWreathSans({
      width: window.innerWidth,
      height: (window.innerHeight / 100) * 62,
      initialText: defaultValue,
      darkMode: mode === Mode.OUTSIDE,
      fontColor: mode === Mode.OUTSIDE ? '#704234' : '#B27E41',
    });

  const handleShare = useCallback(() => {
    if (!getText().trim()) {
      alert('🎁 텍스트를 입력해주세요.');
      return;
    }
    const text = encoder(getText());
    mode === Mode.OUTSIDE
      ? router(`/o-post?sans=${text}&mode=${encoder('o')}`)
      : router(`/i-post?sans=${text}&mode=${encoder('i')}`);
  }, [getText, mode, router]);

  useEffect(() => {
    function handleResize() {
      resize(window.innerWidth, (window.innerHeight / 100) * 62);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [resize]);

  return (
    <Container>
      <SansContainer ref={ref}>
        <WreathSansCanvas />
      </SansContainer>

      <TextareaContainer>
        <Textarea
          autoFocus
          name="sans"
          width="100%"
          threshold={50}
          placeholder="interactive study"
          onInput={onInputHandler}
          defaultValue={defaultValue}
        />
      </TextareaContainer>

      <ButtonContainer>
        <Button
          text={'WRITE'}
          color={mode === Mode.OUTSIDE ? '#D2E6E4' : '#E8C5A6'}
          textColor={mode === Mode.OUTSIDE ? '#2E3A2C' : '#624835'}
          hoveredColor={mode === Mode.OUTSIDE ? '#BFDBD9' : '#D8BDA3'}
          handleClick={redraw}
          icon={
            <WriteIcon color={mode === Mode.OUTSIDE ? '#2E3A2C' : '#624835'} />
          }
        />
        <Button
          text={'SHARE'}
          color={mode === Mode.OUTSIDE ? '#FFFFFF' : '#FFFFFF'}
          textColor={mode === Mode.OUTSIDE ? '#2E3A2C' : '#624835'}
          hoveredColor={mode === Mode.OUTSIDE ? '#E6F0F0' : '#F4E4D4'}
          disabled={!getText()?.trim()}
          handleClick={handleShare}
          icon={
            <ShareIcon color={mode === Mode.OUTSIDE ? '#2E3A2C' : '#624835'} />
          }
        />
      </ButtonContainer>
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: auto;
  box-sizing: border-box;
`;

const SansContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 65vh;
  max-height: calc(100vh - 320px);
  overflow: auto;
  pointer-events: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
`;

const TextareaContainer = styled.div`
  width: 48vw;
  height: auto;
  box-sizing: border-box;

  @media ${GRID.MOBILE} {
    width: 100%;
    padding: 0 36px;
  }
`;
