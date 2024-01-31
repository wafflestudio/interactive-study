import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import useWreathSans from '../hooks/useWreathSans';
import { postFormState } from '../store/post';
import { Mode } from '../types/mode';
import { decoder } from '../utils/crypto';

interface Props {
  mode?: Mode;
}

export default function PostPreview({ mode = Mode.OUTSIDE }: Props) {
  const value = useRecoilValue(postFormState);
  const url = useMemo(() => new URL(window.location.href), []);
  const sans = useMemo(() => decoder(url, 'sans'), [url]);
  const { ref, WreathSansCanvas } = useWreathSans({ initialText: sans });

  return (
    <Container $mode={mode}>
      <Sans ref={ref}>
        <WreathSansCanvas />
      </Sans>

      <PostContainer>
        <Content $color={mode === Mode.OUTSIDE ? '#315c57' : '#fff'}>
          {value?.content}
        </Content>
        {!!value?.sender && (
          <Sender $color={mode === Mode.OUTSIDE ? '#315c57' : '#fff'}>
            {`From. ${value?.sender}`}
          </Sender>
        )}
      </PostContainer>
    </Container>
  );
}

/* STYLES */
const Container = styled.div<{ $mode: Mode }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 330px;
  height: 600px;
  padding: 24px 0;
  background: #f1f6f6;
  box-sizing: border-box;
  padding-bottom: 20px;
  background-size: cover;
  background-position: center;
  background-image: ${({ $mode }) =>
    $mode === Mode.OUTSIDE
      ? 'url(/background_outside_letter.png)'
      : 'url(/background_inside_letter.png)'};
`;

const Sans = styled.div`
  width: 100%;
  height: 234px;
`;

const PostContainer = styled.div`
  width: 100%;
  flex: 1;
  padding: 0 34px;
  box-sizing: border-box;
`;

const Content = styled.p<{ $color: string }>`
  height: 208px;
  color: ${({ $color }) => $color};
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  white-space: pre-line;
  margin-bottom: 20px;
  overflow: auto;

  @media (max-width: 1200px) {
    height: 184px;
  }
  @media (max-width: 1024px) {
    height: 184px;
  }
  @media (max-width: 840px) {
    height: 184px;
  }
`;

const Sender = styled.h5<{ $color: string }>`
  color: ${({ $color }) => $color};
  text-align: justify;
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;
