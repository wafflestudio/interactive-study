'use client';

import { useEffect, useState } from 'react';

import { Mode } from '@/types/bill';
import S from './styles.module.css';
import InformationIcon from '../icons/Information';

export default function Announce({ mode }: { mode: Mode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={S.container}>
      <InformationIcon
        width={40}
        height={40}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        color={mode === Mode.LIGHTED ? '#000' : '#fff'}
      />

      {open && (
        <div className={S.modal}>
          {
            '왼쪽은 진짜 지폐, 오른쪽은 가짜 지폐입니다.\n여러 도구를 활용해 위조방지 장치를 확인하고,\n가짜 지폐의 잘못된 부분을 찾아내세요!'
          }
        </div>
      )}
    </div>
  );
}
