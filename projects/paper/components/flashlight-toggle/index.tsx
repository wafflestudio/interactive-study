'use client';

import React from 'react';
import { Mode } from '@/types/bill';
import S from './styles.module.css';

export default function FlashlightToggle({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}) {
  return (
    <div className={S.container}>
      <h3 className={S.title}>FLASHLIGHT</h3>
      <div className={S.button_container}>
        <button
          onClick={() => setMode(Mode.WHITE_LIGHTED)}
          className={`${
            mode === Mode.WHITE_LIGHTED ? S.white_active : S.white_n_active
          }`}
        >
          WHITE
        </button>
        <button
          onClick={() => setMode(Mode.BLUE_LIGHTED)}
          className={`${
            mode === Mode.BLUE_LIGHTED ? S.blue_active : S.blue_n_active
          }`}
        >
          BLUE
        </button>
        <button
          onClick={() => setMode(Mode.BACK_LIGHTED)}
          className={`${
            mode === Mode.BACK_LIGHTED ? S.back_active : S.back_n_active
          }`}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
