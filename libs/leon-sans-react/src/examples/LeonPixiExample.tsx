import { CHARSET } from 'leonsans';
import { useCallback, useEffect, useRef, useState } from 'react';

import LeonPixi from '../components/LeonPixi';
import { usePixiDispatcher } from '../hooks/usePixiDispatcher';

const URL_MSG = atob(
  new URLSearchParams(window.location.search).get('msg') ?? '',
).replaceAll('\\n', '\n');
const URL_MSG_IS_VALID =
  URL_MSG &&
  URL_MSG.split('').every((c) => CHARSET.includes(c) || ' \n'.includes(c));
const INITIAL_TEXT = URL_MSG_IS_VALID ? URL_MSG : 'INTERACTIVE STUDY';

export default function LeonPixiExample() {
  const [windowSize, setWindowSize] = useState<[number, number]>([
    window.innerWidth,
    window.innerHeight - 100,
  ]);
  const canvasWidth = windowSize[0];
  const canvasHeight = windowSize[1];

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
          wreath.insertText('\n', caretIdx - 1);
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

          const start = caretIdx - 1;
          const deleted = wreath.leon.text.length - newText.length + 1;

          // remove containers if text is deleted
          if (deleted > 0) wreath.deleteText(start, deleted);

          wreath.insertText(data!, start);
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

  const moveLeft = useCallback(() => {
    dispatcher.send((wreath) => {
      wreath.leon.position(wreath.leon.rect.x + 10, wreath.leon.rect.y);
      wreath.updatePositions();
    });
  }, [dispatcher]);

  const moveRight = useCallback(() => {
    dispatcher.send((wreath) => {
      wreath.leon.position(wreath.leon.rect.x + 10, wreath.leon.rect.y);
      wreath.updatePositions();
    });
  }, [dispatcher]);

  const shareUrl = useCallback(() => {
    const url =
      window.location.origin + `/?msg=${btoa(inputRef.current!.value)}`;
    window.navigator.clipboard
      .writeText(url.replaceAll('\n', '\\n'))
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
      setWindowSize([window.innerWidth, window.innerHeight - 100]);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <LeonPixi
        initialText={INITIAL_TEXT}
        color={'#704234'}
        size={130}
        width={canvasWidth}
        height={canvasHeight}
        dispatcher={dispatcher}
      />
      <div>
        <textarea ref={inputRef} onInput={onInputHandler} />
        <button onClick={() => dispatcher.send((wreath) => wreath.redraw())}>다시 쓰기</button>
        <button onClick={() => moveLeft()}>{'<'}</button>
        <button onClick={() => moveRight()}>{'>'}</button>
        <button onClick={() => shareUrl()}>공유</button>
      </div>
    </div>
  );
}
