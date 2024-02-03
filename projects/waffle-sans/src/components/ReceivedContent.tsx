import styled from 'styled-components';

import useWreathSans from '../hooks/useWreathSans';
import { Mode } from '../types/mode';

type ReceivedContentProps = {
  sender: string;
  content: string;
  sans: string;
  mode: string;
};

export default function ReceivedContent({
  sender,
  content,
  sans,
  mode,
}: ReceivedContentProps) {
  const { ref, WreathSansCanvas } = useWreathSans({
    initialText: sans,
    darkMode: mode === Mode.OUTSIDE,
    fontColor: mode === Mode.OUTSIDE ? '#704234' : '#B27E41',
  });

  return (
    <Container $isOutside={mode === 'o'}>
      <SansWrapper ref={ref}>
        <WreathSansCanvas />
      </SansWrapper>
      <MainText $isOutside={mode === 'o'}>{content}</MainText>
      <From $isOutside={mode === 'o'}>From. {sender}</From>
      {/* <LetterFooter /> */}
    </Container>
  );
}

const Container = styled.div<{ $isOutside: boolean }>`
  position: relative;
  top: 10px;
  width: 100%;
  aspect-ratio: 0.55;
  box-sizing: border-box;

  padding: 45px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3%;

  background-image: url(${({ $isOutside }) =>
    $isOutside
      ? '/background_outside_letter.png'
      : `/background_inside_letter.png`});
  background-size: cover;
  background-position: bottom center;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.15);
`;

const SansWrapper = styled.div`
  width: 100%;
  height: 30%;
`;

const MainText = styled.div<{ $isOutside: boolean }>`
  color: ${({ $isOutside }) => ($isOutside ? `#315c57` : `#FEDCB4`)};

  width: 100%;
  height: 30%;
  flex-shrink: 0;
  overflow-y: auto;

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
