import { CHARSET } from 'leonsans';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PixiDispatcher } from '../types/Dispatcher';
import styles from './LeonPixiControlPanel.module.css';

const URL_PARAMS = new URLSearchParams(window.location.search);

const DEFAULT_MSG = 'INTERACTIVE STUDY';
const URL_MSG = atob(URL_PARAMS.get('msg') ?? '').replaceAll('\\n', '\n');
const URL_MSG_IS_VALID =
  URL_MSG &&
  URL_MSG.split('').every((c) => CHARSET.includes(c) || ' \n'.includes(c));
const INITIAL_TEXT = URL_MSG_IS_VALID
  ? URL_MSG
  : localStorage.getItem('msg') ?? DEFAULT_MSG;

const URL_ALIGN = URL_PARAMS.get('align');
const INITIAL_ALIGN = (URL_ALIGN ?? 'left') as 'left' | 'center' | 'right';

const DEFAULT_ORNAMENT_ORDER = [
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
const URL_ORNAMENT_ORDER = URL_PARAMS.get('ornamentOrder')?.split(',');
const URL_ORNAMENT_ORDER_IS_VALID =
  URL_ORNAMENT_ORDER &&
  URL_ORNAMENT_ORDER.every((name) => ORNAMENT_NAMES.includes(name));
const INITIAL_ORNAMENT_ORDER = URL_ORNAMENT_ORDER_IS_VALID
  ? URL_ORNAMENT_ORDER
  : localStorage.getItem('ornamentOrder')?.split(',') ?? DEFAULT_ORNAMENT_ORDER;

type LeonPixiControllerProps = {
  dispatcher: PixiDispatcher;
};

export default function LeonPixiController({
  dispatcher,
}: LeonPixiControllerProps) {
  const [ornamentOrder, setOrnamentOrder] = useState<string[]>(
    INITIAL_ORNAMENT_ORDER,
  );
  const [, setUpdateId] = useState<number>(0);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const backgroundColorRef = useRef<HTMLInputElement>(null);
  const alignRef = useRef<HTMLSelectElement>(null);
  const fontSizeRef = useRef<HTMLInputElement>(null);
  const ornamentDisabledRef = useRef<HTMLInputElement>(null);
  const ornamentAmplitudeRef = useRef<HTMLInputElement>(null);
  const ornamentSizeRef = useRef<HTMLInputElement>(null);
  const ornamentGapRef = useRef<HTMLInputElement>(null);
  const leafLightRingRatioRef = useRef<HTMLInputElement>(null);
  const leafGapRef = useRef<HTMLInputElement>(null);
  const entireDensityRef = useRef<HTMLInputElement>(null);
  const snowModeOnOffRef = useRef<HTMLInputElement>(null);
  const snowFlakeCountRef = useRef<HTMLInputElement>(null);
  const snowFlakeSizeLowerBoundRef = useRef<HTMLInputElement>(null);
  const snowFlakeSizeUpperBoundRef = useRef<HTMLInputElement>(null);

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
    const params = new URLSearchParams();
    params.set('msg', btoa(inputRef.current!.value));
    params.set('align', alignRef.current!.value);
    if (
      JSON.stringify(ornamentOrder) !== JSON.stringify(DEFAULT_ORNAMENT_ORDER)
    )
      params.set('ornamentOrder', ornamentOrder.join(','));
    const url = new URL(window.location.origin);
    url.search = params.toString();
    window.navigator.clipboard
      .writeText(url.toString().replaceAll('\n', '\\n'))
      .then(() => alert('URL이 복사되었습니다.'));
  }, [ornamentOrder]);

  const saveMsg = useCallback(() => {
    if (inputRef.current && inputRef.current.value.length > 0)
      localStorage.setItem('msg', inputRef.current?.value ?? '');
    else localStorage.removeItem('msg');
    if (ornamentOrder.length > 0)
      localStorage.setItem('ornamentOrder', ornamentOrder.join(',') ?? '');
    else localStorage.removeItem('ornamentOrder');
  }, [ornamentOrder]);

  const initialize = useCallback(() => {
    if (
      confirm(
        '메시지와 오나먼트 순서가 모두 초기화됩니다.\n정말 초기화하시겠습니까?',
      )
    ) {
      localStorage.clear();
      window.location.href = window.location.origin;
    }
  }, []);

  const changeBackgroundColor = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatcher.send((wreath) => {
        wreath.renderer.background.color = e.target.value;
      });
    },
    [dispatcher],
  );

  const changeAlignType = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatcher.send((wreath) => {
        wreath.align = e.target.value as 'left' | 'center' | 'right';
      });
    },
    [dispatcher],
  );

  const changeFontSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatcher.send((wreath) => {
        wreath.leon.size = Number(e.target.value);
        wreath.updateLeonPosition();
        wreath.redraw();
        setUpdateId((prev) => prev + 1);
      });
    },
    [dispatcher],
  );

  const toggleDarkMode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatcher.send((wreath) => {
        wreath.darkMode = e.target.checked;
        wreath.redraw();
      });
    },
    [dispatcher],
  );

  const addOrnament = useCallback(
    (name: string) => {
      setOrnamentOrder((prev) => {
        const newOrder = [...prev, name];
        dispatcher.send((wreath) => {
          wreath.ornamentOrder = newOrder;
          wreath.redraw();
        });
        setOrnamentOrder(newOrder);
        return newOrder;
      });
    },
    [dispatcher],
  );

  const removeOrnament = useCallback(
    (i: number) => {
      setOrnamentOrder((prev) => {
        const newOrder = [...prev.slice(0, i), ...prev.slice(i + 1)];
        dispatcher.send((wreath) => {
          wreath.ornamentOrder = newOrder;
          wreath.redraw();
        });
        setOrnamentOrder(newOrder);
        return newOrder;
      });
    },
    [dispatcher],
  );

  const toggleOrnamentDisabled = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        wreath.ornamentDisabled = e.target.checked;
        wreath.redraw();
      }),
    [dispatcher],
  );

  const changeOrnamentAmplitude = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        wreath.ornamentAmplitude = Number(e.target.value);
        wreath.redraw();
        setUpdateId((prev) => prev + 1);
      }),
    [dispatcher],
  );

  const changeOrnamentSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        for (const [name, ornament] of Object.entries(wreath.ornamentMap)) {
          if (name === 'star') continue;
          ornament.scale = Number(e.target.value) / 100;
        }
        wreath.redraw();
        setUpdateId((prev) => prev + 1);
      }),
    [dispatcher],
  );

  const changeOrnamentGap = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        wreath.ornamentGap = Number(e.target.value);
        wreath.redraw();
        setUpdateId((prev) => prev + 1);
      }),
    [dispatcher],
  );

  const changeLeafLightRingRatio = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        wreath.leafLightRingRatio = Number(e.target.value);
        wreath.redraw();
        setUpdateId((prev) => prev + 1);
      }),
    [dispatcher],
  );

  const changeLeafGap = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        wreath.leafGap = Number(e.target.value);
        wreath.redraw();
        setUpdateId((prev) => prev + 1);
      }),
    [dispatcher],
  );

  const changeEntireDensity = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        wreath.leon.pathGap = 1 / Number(e.target.value);
        wreath.redraw();
        setUpdateId((prev) => prev + 1);
      }),
    [dispatcher],
  );

  const toggleSnowModeOnOff = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        wreath.snowMode = e.target.checked;
      }),
    [dispatcher],
  );

  const changeSnowFlakeCount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        wreath.snowFlakeCount = Number(e.target.value);
        setUpdateId((prev) => prev + 1);
      }),
    [dispatcher],
  );

  const changeSnowFlakeSizeLowerBound = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        const value = Number(e.target.value);
        if (value > wreath.snowFlakeSizeBound[1]) {
          wreath.snowFlakeSizeBound = [value, value + 0.1];
          snowFlakeSizeUpperBoundRef.current!.value = value + 0.1 + "";
        } else {
          wreath.snowFlakeSizeBound = [value, wreath.snowFlakeSizeBound[1]];
        }
        setUpdateId((prev) => prev + 1);
      }),
    [dispatcher],
  );

  const changeSnowFlakeSizeUpperBound = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatcher.send((wreath) => {
        const value = Number(e.target.value);
        if (value < wreath.snowFlakeSizeBound[0]) {
          wreath.snowFlakeSizeBound = [value - 0.1, value];
          snowFlakeSizeLowerBoundRef.current!.value = value - 0.1 + "";
        } else {
          wreath.snowFlakeSizeBound = [wreath.snowFlakeSizeBound[0], value];
        }
        setUpdateId((prev) => prev + 1);
      }),
    [dispatcher],
  );

  /**
   * 마운트될 때 INITIAL_ORNAMENT_ORDER, INITIAL_TEXT 적용
   */
  useEffect(() => {
    dispatcher.send((wreath) => {
      wreath.ornamentOrder = INITIAL_ORNAMENT_ORDER;
      wreath.loadingPromise.then(() => {
        wreath.align = INITIAL_ALIGN;
        wreath.replaceText(INITIAL_TEXT);
      });
    });
    setUpdateId((prev) => prev + 1);
  }, [dispatcher]);

  return (
    <div className={styles.container}>
      <div className={styles.configuration}>
        <span className={styles.key}>에디터</span>
        <textarea
          className={styles.editor}
          ref={inputRef}
          onInput={onInputHandler}
          defaultValue={INITIAL_TEXT}
        />
      </div>
      <div className={styles.configuration}>
        <div className={styles.buttonSet}>
          <button
            className={styles.button}
            onClick={() => dispatcher.send((wreath) => wreath.redraw())}
          >
            다시 쓰기
          </button>
          <button className={styles.button} onClick={shareUrl}>
            공유
          </button>
          <button className={styles.button} onClick={saveMsg}>
            저장
          </button>
          <button className={styles.button} onClick={initialize}>
            초기화
          </button>
        </div>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>배경색</span>
        <input
          className={styles.backgroundColor}
          ref={backgroundColorRef}
          type="color"
          onChange={changeBackgroundColor}
          defaultValue="#FFFFFF"
        />
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>정렬</span>
        <select
          className={styles.alignSelector}
          ref={alignRef}
          onChange={changeAlignType}
          defaultValue={INITIAL_ALIGN}
        >
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </select>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>글자 크기</span>
        <input
          className={styles.fontSize}
          ref={fontSizeRef}
          type="range"
          min="1"
          max="1000"
          step="1"
          onChange={changeFontSize}
          defaultValue="130"
        />
        <label className={styles.fontSizeLabel}>
          {fontSizeRef.current?.value}
        </label>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>다크모드</span>
        <input
          className={styles.darkMode}
          type="checkbox"
          onChange={toggleDarkMode}
        />
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>오나먼트 추가</span>
        <div className={styles.ornamentSelector}>
          {ORNAMENT_NAMES.map((name) => (
            <div
              key={name}
              className={styles.ornament}
              onClick={() => addOrnament(name)}
            >
              <img src={`/ornaments/${name}.svg`} alt={name} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>오나먼트 순서</span>
        <div className={styles.ornamentOrder}>
          {ornamentOrder?.map((name, i) => (
            <div
              key={i}
              className={styles.ornament}
              onClick={() => removeOrnament(i)}
            >
              <img src={`/ornaments/${name}.svg`} alt={name} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>오나먼트 제거</span>
        <input
          className={styles.ornamentDisabled}
          ref={ornamentDisabledRef}
          type="checkbox"
          onChange={toggleOrnamentDisabled}
        />
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>오나먼트 진폭</span>
        <input
          className={styles.ornamentAmplitude}
          ref={ornamentAmplitudeRef}
          type="range"
          min="0"
          max="100"
          step="1"
          onChange={changeOrnamentAmplitude}
          defaultValue="50"
        />
        <label className={styles.ornamentAmplitudeLabel}>
          {ornamentAmplitudeRef.current?.value ?? 50}
        </label>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>오나먼트 크기</span>
        <input
          className={styles.ornamentSize}
          ref={ornamentSizeRef}
          type="range"
          min="1"
          max="100"
          step="1"
          onChange={changeOrnamentSize}
          defaultValue="28"
        />
        <label className={styles.ornamentSizeLabel}>
          {ornamentSizeRef.current?.value ?? 28}
        </label>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>오나먼트 간격</span>
        <input
          className={styles.ornamentGap}
          ref={ornamentGapRef}
          type="range"
          min="0"
          max="30"
          step="1"
          onChange={changeOrnamentGap}
          defaultValue="10"
        />
        <label className={styles.ornamentGapLabel}>
          {ornamentGapRef.current?.value ?? 5}
        </label>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>전구 당 잎사귀</span>
        <input
          className={styles.leafLightRingRatio}
          ref={leafLightRingRatioRef}
          type="range"
          min="0"
          max="10"
          step="1"
          onChange={changeLeafLightRingRatio}
          defaultValue="3"
        />
        <label className={styles.leafLightRingRatioLabel}>
          {leafLightRingRatioRef.current?.value ?? 5}
        </label>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>잎사귀 간격</span>
        <input
          className={styles.leafDensity}
          ref={leafGapRef}
          type="range"
          min="1"
          max="30"
          step="1"
          onChange={changeLeafGap}
          defaultValue="10"
        />
        <label className={styles.leafDensityLabel}>
          {leafGapRef.current?.value ?? 10}
        </label>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>최소 간격</span>
        <input
          className={styles.leafDensity}
          ref={entireDensityRef}
          type="range"
          min="1"
          max="100"
          step="1"
          onChange={changeEntireDensity}
          defaultValue="20"
        />
        <label className={styles.leafDensityLabel}>
          1 / {entireDensityRef.current?.value}
        </label>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>눈 모드</span>
        <input
          className={styles.snowModeOnOff}
          ref={snowModeOnOffRef}
          type="checkbox"
          onChange={toggleSnowModeOnOff}
        />
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>눈 개수</span>
        <input
          className={styles.snowFlakeCount}
          ref={snowFlakeCountRef}
          type="range"
          min="1"
          max="1024"
          step="1"
          onChange={changeSnowFlakeCount}
          defaultValue="256"
        />
        <label className={styles.snowFlakeCountLabel}>
          {snowFlakeCountRef.current?.value}
        </label>
      </div>
      <div className={styles.configuration}>
        <span className={styles.key}>눈 크기</span>
        <input
          className={styles.snowFlakeSizeLowerBound}
          ref={snowFlakeSizeLowerBoundRef}
          type="range"
          min="0.1"
          max="9.9"
          step="0.1"
          onChange={changeSnowFlakeSizeLowerBound}
          defaultValue="0.5"
        />
        <label className={styles.snowFlakeSizeLowerBoundLabel}>
          {snowFlakeSizeLowerBoundRef.current?.value}
        </label>
        <input
          className={styles.snowFlakeSizeUpperBound}
          ref={snowFlakeSizeUpperBoundRef}
          type="range"
          min="0.2"
          max="10"
          step="0.1"
          onChange={changeSnowFlakeSizeUpperBound}
          defaultValue="4.2"
        />
        <label className={styles.snowFlakeSizeUpperBoundLabel}>
          {snowFlakeSizeUpperBoundRef.current?.value}
        </label>
      </div>
    </div>
  );
}
