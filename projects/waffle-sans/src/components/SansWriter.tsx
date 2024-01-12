import { CHARSET } from 'leonsans';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import LeonPixi from '../../../../libs/leon-sans-react/src/components/LeonPixi';
import styles from '../../../../libs/leon-sans-react/src/examples/LeonPixiExample.module.css';
import { usePixiDispatcher } from '../../../../libs/leon-sans-react/src/hooks/usePixiDispatcher';
import { sansInputState } from '../store/sans';
import Button from './Button';
import SampleTypo from './SampleTypo';
import Textarea from './Textarea';

// ------------------------

const URL_MSG = atob(
  new URLSearchParams(window.location.search).get('msg') ?? '',
).replace(/\\n/g, '\n');
const URL_MSG_IS_VALID =
  URL_MSG &&
  URL_MSG.split('').every((c) => CHARSET.includes(c) || ' \n'.includes(c));
const INITIAL_TEXT = URL_MSG_IS_VALID ? URL_MSG : 'INTERACTIVE STUDY';
const ORNAMENT_NAMES = [
  'ball_1',
  'ball_2',
  'candy',
  'fruit_1',
  'fruit_2',
  'pinecone_1',
  'pinecone_2',
  'poinsettia_1',
  'poinsettia_2',
  'ribbon',
  'star',
];
const INITIAL_ORNAMENT_ORDER = [
  'pinecone_2',
  'ball_2',
  'ribbon',
  'candy',
  'fruit_1',
  'pinecone_1',
  'poinsettia_1',
  'ball_1',
  'pinecone_2',
  'fruit_2',
  'ball_2',
  'ribbon',
  'candy',
  'poinsettia_2',
  'fruit_1',
  'ball_1',
  'pinecone_1',
  'poinsettia_1',
  'fruit_2',
];
// ------------------------

export default function SansWriter() {
  const router = useNavigate();
  const [value, setValue] = useRecoilState(sansInputState);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (e.target.value.length > 50) return;
      setValue(e.target.value);
    },
    [],
  );

  // -------------------------

  const [windowSize, setWindowSize] = useState<[number, number]>([
    window.innerWidth,
    window.innerHeight,
  ]);
  const canvasWidth = windowSize[0];
  const canvasHeight = 600;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatcher = usePixiDispatcher();

  const onInputHandler = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      const newText: string = e.currentTarget.value;
      const caretIdx = inputRef.current!.selectionStart!;
      const inputEvent = e.nativeEvent as InputEvent;
      const data = inputEvent.data;
      const inputType = inputEvent.inputType;

      dispatcher.send((wreath) => {
        if (
          inputType === 'insertLineBreak' ||
          (inputType === 'insertText' && data === null)
        ) {
          const insertIdx = caretIdx - 1; // 입력된 문자의 인덱스
          wreath.insertText('\n', insertIdx);
        } else if (
          inputType === 'insertText' ||
          inputType === 'insertCompositionText'
        ) {
          // 입력 가능한 문자인지 검사
          const isValid = CHARSET.includes(data!) || ' '.includes(data!);
          if (!isValid) {
            alert(`"${data}"는 허용되지 않는 문자입니다.`);
            inputRef.current!.value = inputRef.current!.value.replace(
              data!,
              '',
            );
            return;
          }

          const insertIdx = caretIdx - 1; // 입력된 문자의 인덱스
          const deleted = wreath.leon.text.length - newText.length + 1; // 삭제된 글자 수

          // 삭제된 글자가 있을 경우
          if (deleted > 0) wreath.deleteText(insertIdx, deleted);

          wreath.insertText(data!, insertIdx);
        } else if (inputType.startsWith('delete') && newText.length > 0) {
          wreath.deleteText(caretIdx, wreath.leon.text.length - newText.length);
        } else {
          // 입력 가능한 문자만 포함되어 있는지 검사
          const isValid = newText
            .split('')
            .every((c) => CHARSET.includes(c) || ' \n'.includes(c));
          if (!isValid) {
            alert(`"${newText}"에는 허용되지 않는 문자가 포함되어 있습니다.`);
            inputRef.current!.value = inputRef.current!.value.replace(
              newText,
              '',
            );
            return;
          }

          wreath.replaceText(newText);
        }
      });
    },
    [dispatcher],
  );

  const shareUrl = useCallback(() => {
    const url =
      window.location.origin + `/?msg=${btoa(inputRef.current!.value)}`;
    window.navigator.clipboard
      .writeText(url.replace(/\n/g, '\\n'))
      .then(() => alert('URL이 복사되었습니다.'));
  }, []);

  /**
   * 마운트될 때 input에 INITIAL_TEXT 적용
   */
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = INITIAL_TEXT;
  }, []);

  /**
   * window resize
   */
  useEffect(() => {
    function handleResize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  //--------------------------

  return (
    <Container>
      <SansContainer>
        {/* <LeonPixi
          initialText={INITIAL_TEXT}
          color={'#704234'}
          size={100}
          width={canvasWidth}
          height={canvasHeight}
          dispatcher={dispatcher}
        /> */}
      </SansContainer>

      <Textarea
        name="sans"
        width="635px"
        value={value}
        threshold={50}
        ref={inputRef}
        handleInput={onInputHandler}
        handleChange={handleChange}
        placeholder="interactive study"
      />
      <ButtonContainer>
        <Button
          text={'SHARE'}
          color={'#FFFFFF'}
          hoveredColor="#E6F0F0"
          handleClick={() => router(`/post?msg=${value}`)}
          icon={<Icon src="/share.svg" alt="share" />}
        />
        <Button
          text={'WRITE'}
          color={'#D2E6E4'}
          hoveredColor="#BFDBD9"
          handleClick={() => {}}
          icon={<Icon src="/write.svg" alt="write" />}
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
`;

const SansContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 62vh;
  max-height: calc(100vh - 320px);
  overflow: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
