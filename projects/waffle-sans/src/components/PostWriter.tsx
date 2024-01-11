import { useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { postFormState } from '../store/post';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';

export default function PostWriter() {
  const [form, setForm] = useRecoilState(postFormState);
  const THRESHOLD = useMemo(() => {
    return {
      SENDER: 20,
      RECEIVER: 20,
      CONTENT: 1000,
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      switch (e.target.name) {
        case 'sender':
          if (e.target.value.length > THRESHOLD.SENDER) return;
          setForm((prev) => ({ ...prev, sender: e.target.value }));
          break;
        case 'receiver':
          if (e.target.value.length > THRESHOLD.RECEIVER) return;
          setForm((prev) => ({ ...prev, receiver: e.target.value }));
          break;
        case 'content':
          if (e.target.value.length > THRESHOLD.CONTENT) return;
          setForm((prev) => ({ ...prev, content: e.target.value }));
          break;
      }
    },
    [],
  );

  return (
    <Container>
      <Announce>
        {
          '사랑하는 사람에게\n직접 만든 크리스마스 리스와 함께 편지를 보내보세요!'
        }
      </Announce>
      <Input
        name="sender"
        value={form.sender}
        handleChange={handleChange}
        threshold={THRESHOLD.SENDER}
        width={'100%'}
        height={'54px'}
        label={'보내는 사람'}
        placeholder="기철이"
      />
      <Input
        name="receiver"
        value={form.receiver}
        handleChange={handleChange}
        threshold={THRESHOLD.RECEIVER}
        width={'100%'}
        height={'54px'}
        label={'받는 사람'}
        placeholder="귀여운 기영이"
      />
      <Textarea
        name="content"
        value={form.content}
        handleChange={handleChange}
        threshold={THRESHOLD.CONTENT}
        width={'100%'}
        height={'375px'}
        label={'편지 내용'}
        placeholder="새해복 많이 받아~!"
      />
      <Button
        text={'링크 공유하기'}
        color={'#D2E6E4'}
        handleClick={() => {}}
        hoveredColor="#BFDBD9"
        icon={<Icon src="/share.svg" alt="share" />}
      />
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 30px;
  display: inline-flex;
  width: 100%;
  box-sizing: border-box;
  height: 716px;
  padding: 10px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-shrink: 0;
`;

const Announce = styled.h2`
  color: #f1f6f6;
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: center;

  @media (max-width: 1200px) {
    white-space: pre-line;
  }
  @media (max-width: 1024px) {
    white-space: pre-line;
  }
  @media (max-width: 840px) {
    word-break: keep-all;
  }
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
