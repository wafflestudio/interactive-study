import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import useWreathSans from '../hooks/useWreathSans';

type ReceivedContentProps = {
  sender: string;
  content: string;
  sans: string;
  mode: string;
  stage: string;
  align: string;
  onHeightChange: (height: number) => void;
};

export default function ReceivedContent({
  sender,
  content,
  sans,
  mode,
  stage,
  align,
  onHeightChange,
}: ReceivedContentProps) {
  const [width, setWidth] = useState(280);
  const [height, setHeight] = useState(196);
  const [baseHeight, setBaseHeight] = useState<number | null>(null);
  // const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [sansHeight, setSansHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseSansHeight = useMemo(
    () => (baseHeight ? baseHeight * 0.3 : null),
    [baseHeight],
  );

  const { ref, WreathSansCanvas, redraw, resize, getTextRect } = useWreathSans({
    width,
    height,
    initialText: sans,
    darkMode: mode === 'o',
    fontColor: mode === 'o' ? '#704234' : '#B27E41',
    fitToWidth: true,
    minSize: 0,
    align:
      align === 'left' || align === 'center' || align === 'right'
        ? align
        : undefined,
  });

  useEffect(() => {
    const updateBaseSize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      setBaseHeight(containerWidth / 0.55);
      if (ref.current) {
        const wrapperWidth = ref.current.offsetWidth;
        setWidth(wrapperWidth);
      }
    };
    updateBaseSize();
    window.addEventListener('resize', updateBaseSize);
    return () => {
      window.removeEventListener('resize', updateBaseSize);
    };
  }, []);

  useEffect(() => {
    if (!baseHeight) return;
    const updateSansHeight = () => {
      const rect = getTextRect();
      if (!rect || rect.h === 0) return;
      const targetHeight = Math.ceil(rect.h + 12);
      const minHeight = baseSansHeight ?? 0;
      setSansHeight(Math.max(targetHeight, minHeight));
    };
    const rafId = requestAnimationFrame(updateSansHeight);
    return () => cancelAnimationFrame(rafId);
  }, [baseHeight, baseSansHeight, getTextRect, sans, stage]);

  // TODO: 필요한가?
  // useEffect(() => {
  //   if (!baseHeight || !baseSansHeight) return;
  //   const nextSansHeight = sansHeight ?? baseSansHeight;
  //   const delta = Math.max(0, nextSansHeight - baseSansHeight);
  //   const nextHeight = Math.ceil(baseHeight + delta);
  //   setContainerHeight(nextHeight);
  //   onHeightChange?.(nextHeight);
  // }, [baseHeight, baseSansHeight, onHeightChange, sansHeight]);

  useEffect(() => {
    if (!containerRef.current) return;
    onHeightChange(containerRef.current.offsetHeight);
  }, [sansHeight, containerRef, onHeightChange]);


  useEffect(() => {
    if (!sansHeight || !width) return;
    setHeight(sansHeight);
    resize(width, sansHeight);
    redraw();
  }, [redraw, resize, sansHeight, width]);

  useEffect(() => {
    redraw();
  }, [redraw, stage]);

  return (
    <Container
      ref={containerRef}
      $isOutside={mode === 'o'}
      // $height={containerHeight}
    >
      <SansWrapper ref={ref} $height={sansHeight}>
        <WreathSansCanvas />
      </SansWrapper>
      <MainText $isOutside={mode === 'o'}>{content}</MainText>
      <From $isOutside={mode === 'o'}>From. {sender}</From>
      {/* <LetterFooter /> */}
    </Container>
  );
}

const OUTSIDE_LETTER_BG = `${import.meta.env.BASE_URL}background_outside_letter.png`;
const INSIDE_LETTER_BG = `${import.meta.env.BASE_URL}background_inside_letter.png`;

const Container = styled.div<{ $isOutside: boolean; $height?: number | null }>`
  position: relative;
  top: 10px;
  width: 100%;
  /* TODO: auto로 두면 안 되는 이유? */
  /* height: ${({ $height }) => ($height ? `${$height}px` : 'auto')};
  aspect-ratio: ${({ $height }) => ($height ? 'auto' : '0.55')}; */
  box-sizing: border-box;

  padding: 45px 40px 80px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  background-image: url(${({ $isOutside }) => $isOutside ? OUTSIDE_LETTER_BG : INSIDE_LETTER_BG});
  background-size: cover;
  background-position: bottom center;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.15);
`;

const SansWrapper = styled.div<{ $height: number | null }>`
  width: 100%;
  height: ${({ $height }) => ($height ? `${$height}px` : '30%')};
`;

const MainText = styled.pre<{ $isOutside: boolean }>`
  color: ${({ $isOutside }) => ($isOutside ? `#315c57` : `#FEDCB4`)};

  width: 100%;
  flex-shrink: 0;
  overflow-y: auto;
  white-space: pre-wrap;

  text-align: justify;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;

const From = styled.div<{ $isOutside: boolean }>`
  color: ${({ $isOutside }) => ($isOutside ? `#315c57` : `#FEDCB4`)};

  width: 100%;

  text-align: justify;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;
