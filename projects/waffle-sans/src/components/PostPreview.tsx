import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { postFormState } from '../store/post';
import Footer from './Footer';
import SampleTypo from './SampleTypo';

export default function PostPreview() {
  const value = useRecoilValue(postFormState);
  const today = useMemo(() => {
    const date = new Date();
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  }, []);

  return (
    <Container>
      <Sans>
        <Logo src="/logo_white.svg" alt="waffle sans" />
        <SansContainer>{/* <SampleTypo /> */}</SansContainer>
      </Sans>

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

      <Footer fontSize={9} />
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 715px;
  background: #f1f6f6;
  box-sizing: border-box;
  padding-bottom: 20px;
  box-shadow: 0px 5.72px 5.72px 0px rgba(0, 0, 0, 0.25);

  @media (max-width: 1200px) {
    height: 660px;
  }
  @media (max-width: 1024px) {
    height: 660px;
  }
  @media (max-width: 840px) {
    height: 660px;
  }
`;

const Sans = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 308px;
  padding: 22px;
  box-sizing: border-box;
  background-size: cover;
  background-position: center;
  background-image: url('/background_day.png');
`;

const SansContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  overflow: auto;
`;

const Logo = styled.img`
  width: 54px;
  height: auto;
`;

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
