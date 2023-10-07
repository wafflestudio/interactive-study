'use client';
import React, { useMemo } from 'react';
import { Mode } from '@/types/bill';
import S from './styles.module.css';

export default function LightToggle({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}) {
  const isDark = useMemo(() => {
    return mode !== Mode.LIGHTED;
  }, [mode]);

  return (
    <div className={S.container}>
      <h3 className={`${isDark ? S.title_dark : S.title_light}`}>LIGHT</h3>
      <div
        className={`${
          isDark ? S.button_container_dark : S.button_container_light
        }`}
      >
        <button
          onClick={() => setMode(Mode.WHITE_LIGHTED)}
          className={`${isDark ? S.off_active : S.off_n_active}`}
        >
          OFF
        </button>
        <button
          onClick={() => setMode(Mode.LIGHTED)}
          className={`${isDark ? S.on_n_active : S.on_active}`}
        >
          ON
        </button>
      </div>
    </div>
  );
}
