import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { postFormState } from '../store/post';
import { Mode } from '../types/mode';

interface Props {
  mode?: Mode;
}

export default function PostPreview({ mode = Mode.OUTSIDE }: Props) {
  const value = useRecoilValue(postFormState);
  const today = useMemo(() => {
    const date = new Date();
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  }, []);

  return (
    <Container $mode={mode}>
      <Sans></Sans>

      <PostContainer>
        <Receiver>
          {`TO. ${
            value?.receiver ? value?.receiver : '받는 사람을 입력해주세요.'
          }`}
        </Receiver>
        <Content>{value?.content}</Content>
        <Sender>
          {`FROM. ${
            value?.sender ? value?.sender : '보내는 사람을 입력해주세요.'
          }`}
        </Sender>
        <SendDate>{today}</SendDate>
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

const Sans = styled.div``;

const PostContainer = styled.div`
  width: 100%;
  flex: 1;
  padding: 14px 40px;
  box-sizing: border-box;
`;

const Receiver = styled.h5`
  margin-bottom: 15px;
  color: #2e3a2c;
  font-family: Inter;
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
`;

const Content = styled.p`
  height: 220px;
  color: #2e3a2c;
  font-family: Inter;
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
  white-space: pre-line;
  margin-bottom: 15px;
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

const Sender = styled.h5`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  color: #2e3a2c;
  text-align: right;
  font-family: Inter;
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
`;

const SendDate = styled.span`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  color: #2e3a2c;
  text-align: right;
  font-family: Inter;
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
`;
