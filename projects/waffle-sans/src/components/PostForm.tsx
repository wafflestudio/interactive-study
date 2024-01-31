import { useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { GRID } from '../constants/breakpoint';
import ShareIcon from '../icons/ShareIcon';
import { postFormState } from '../store/post';
import { Mode } from '../types/mode';
import { encoder } from '../utils/crypto';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';

interface Props {
  mode?: Mode;
  handlePreviewClick: () => void;
}

export default function PostForm({
  mode = Mode.OUTSIDE,
  handlePreviewClick,
}: Props) {
  const [form, setForm] = useRecoilState(postFormState);
  const THRESHOLD = useMemo(() => {
    return {
      SENDER: 20,
      RECEIVER: 20,
      CONTENT: 200,
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
    [THRESHOLD.CONTENT, THRESHOLD.RECEIVER, THRESHOLD.SENDER, setForm],
  );

  const handleShare = useCallback(() => {
    const currentURL = new URL(window.location.href);
    const encodedSender = encoder(form.sender);
    const encodedContent = encoder(form.content);
    const encodedReceiver = encoder(form.receiver);
    const targetUrl = `${currentURL}&sender=${encodedSender}&receiver=${encodedReceiver}&content=${encodedContent}`;

    window.navigator.clipboard
      .writeText(targetUrl)
      .then(() => alert('URL이 복사되었습니다.'));
  }, [form.content, form.receiver, form.sender]);

  return (
    <Container>
      <Announce>
        {
          '사랑하는 사람에게\n직접 만든 크리스마스 리스와 함께\n편지를 보내보세요!'
        }
      </Announce>
      <Input
        name="sender"
        label={'보내는 사람'}
        value={form.sender}
        handleChange={handleChange}
        placeholder="ex) 즐거운 와플이"
        threshold={THRESHOLD.SENDER}
        width={'100%'}
        height={'54px'}
        thresholdColor={mode === Mode.OUTSIDE ? '#718F8D' : '#8D674D'}
      />
      <Input
        name="receiver"
        label={'받는 사람'}
        value={form.receiver}
        handleChange={handleChange}
        placeholder="ex) 행복한 와플이"
        threshold={THRESHOLD.RECEIVER}
        width={'100%'}
        height={'54px'}
        thresholdColor={mode === Mode.OUTSIDE ? '#718F8D' : '#8D674D'}
      />
      <Textarea
        name="content"
        label={'편지 내용'}
        value={form.content}
        handleChange={handleChange}
        threshold={THRESHOLD.CONTENT}
        placeholder="새해복 많이 받아~!"
        width={'100%'}
        height={'226px'}
        thresholdColor={mode === Mode.OUTSIDE ? '#718F8D' : '#8D674D'}
      />
      <ButtonContainer>
        <MobilePreview>
          <Button
            text={'미리보기'}
            handleClick={handlePreviewClick}
            color={mode === Mode.OUTSIDE ? '#FFFFFF' : '#FFFFFF'}
            textColor={mode === Mode.OUTSIDE ? '#2E3A2C' : '#624835'}
            hoveredColor={mode === Mode.OUTSIDE ? '#E6F0F0' : '#F4E4D4'}
            icon={
              <ShareIcon
                color={mode === Mode.OUTSIDE ? '#2E3A2C' : '#624835'}
              />
            }
          />
        </MobilePreview>
        <Button
          text={'링크 공유하기'}
          handleClick={handleShare}
          color={mode === Mode.OUTSIDE ? '#D2E6E4' : '#E8C5A6'}
          textColor={mode === Mode.OUTSIDE ? '#2E3A2C' : '#624835'}
          hoveredColor={mode === Mode.OUTSIDE ? '#BFDBD9' : '#D8BDA3'}
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  flex-shrink: 0;
  gap: 30px;
  width: 100%;
  height: auto;
`;

const Announce = styled.h2`
  color: #f1f6f6;
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: center;

  @media ${GRID.MOBILE} {
    white-space: pre-line;
  }
`;

const MobilePreview = styled.div`
  display: none;
  width: auto;
  height: auto;

  @media ${GRID.MOBILE} {
    display: block;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
`;
