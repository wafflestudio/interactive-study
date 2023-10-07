'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import S from './styles.module.css';
import { Fake, Mode } from '@/types/bill';

import Bill from '@/components/bill';
import Announce from '@/components/announce';
import LightToggle from '@/components/light-toggle';
import StageAnnouncer from '@/components/stage-announce';
import FlashlightToggle from '@/components/flashlight-toggle';

export default function Game() {
  const [stage, setStage] = useState(1);
  const [mode, setMode] = useState(Mode.LIGHTED);
  const [clipPath, setClipPath] = useState('none');

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (mode === Mode.WHITE_LIGHTED || mode === Mode.BLUE_LIGHTED) {
        const offsetX = e.clientX - screen.width / 7; // TODO: bug
        const offsetY = e.clientY - screen.height / 2.5; // TODO: bug

        setClipPath(`circle(80px at ${offsetX}px ${offsetY}px)`);
      } else {
        setClipPath('none');
      }
    },
    [mode],
  );

  useEffect(() => {
    if (stage === 6) {
      setMode(Mode.LIGHTED);
    }
  }, [stage, mode]);

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`${S.bg_container} 
      ${mode === Mode.LIGHTED && S.bg_container_lighted}
      ${mode === Mode.BLUE_LIGHTED && S.bg_container_blue_lighted} 
      ${mode === Mode.WHITE_LIGHTED && S.bg_container_white_lighted} 
      ${mode === Mode.BACK_LIGHTED && S.bg_container_back_lighted}`}
    >
      {stage !== 6 && (
        <>
          <div className={S.tools}>
            <Announce mode={mode} />
            <LightToggle mode={mode} setMode={setMode} />
            <div className={S.button_container}>
              {mode !== Mode.LIGHTED && (
                <FlashlightToggle mode={mode} setMode={setMode} />
              )}
            </div>
          </div>
          <div className={S.stages}>
            <StageAnnouncer currStage={stage} />
          </div>
          {(mode === Mode.WHITE_LIGHTED || mode === Mode.BLUE_LIGHTED) && (
            <div className={S.filter}></div>
          )}
        </>
      )}

      {stage === 1 && (
        <div className={S.bills}>
          <Bill
            mode={mode}
            clipPath={clipPath}
            answer={{ x: 166, y: 21 }}
            onNext={() => setStage(2)}
          />
          <Bill
            mode={mode}
            clipPath={clipPath}
            fakeType={Fake.TYPE_1}
            answer={{ x: 166, y: 21 }}
            onNext={() => setStage(2)}
          />
        </div>
      )}
      {stage === 2 && (
        <div className={S.bills}>
          <Bill
            mode={mode}
            clipPath={clipPath}
            answer={{ x: 24, y: 126 }}
            onNext={() => setStage(3)}
          />
          <Bill
            mode={mode}
            clipPath={clipPath}
            fakeType={Fake.TYPE_2}
            answer={{ x: 24, y: 126 }}
            onNext={() => setStage(3)}
          />
        </div>
      )}
      {stage === 3 && (
        <div className={S.bills}>
          <Bill
            mode={mode}
            clipPath={clipPath}
            answer={{ x: 149, y: 150 }}
            onNext={() => setStage(4)}
          />
          <Bill
            mode={mode}
            clipPath={clipPath}
            fakeType={Fake.TYPE_3}
            answer={{ x: 149, y: 150 }}
            onNext={() => setStage(4)}
          />
        </div>
      )}
      {stage === 4 && (
        <div className={S.bills}>
          <Bill
            mode={mode}
            clipPath={clipPath}
            answer={{ x: 198, y: 102 }}
            onNext={() => setStage(5)}
          />
          <Bill
            mode={mode}
            clipPath={clipPath}
            fakeType={Fake.TYPE_4}
            answer={{ x: 198, y: 102 }}
            onNext={() => setStage(5)}
          />
        </div>
      )}
      {stage === 5 && (
        <div className={S.bills}>
          <Bill
            mode={mode}
            clipPath={clipPath}
            answer={{ x: 0, y: 0 }}
            onNext={() => setStage(6)}
          />
          <Bill
            mode={mode}
            clipPath={clipPath}
            fakeType={Fake.TYPE_5}
            answer={{ x: 0, y: 0 }}
            onNext={() => setStage(6)}
          />
        </div>
      )}
      {stage === 6 && (
        <div className={S.congrat_container}>
          <h1 className={S.congrat}>
            축하드립니다! 당신은 interactive 화폐왕!
          </h1>
          <Link href={'/'} className={S.link}>
            홈으로 가기
          </Link>
        </div>
      )}
    </div>
  );
}
