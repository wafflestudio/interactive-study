'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import S from './styles.module.css';
import bill from '@/public/images/pictures/front.png';
import bills from '@/public/images/pictures/front_blue_light.png';

export default function Navigation({ onNext }: { onNext: () => void }) {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimation(true);
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <main className={S.bg_container}>
      <div className={S.bill_container}>
        <h1 className={S.announce}>총 5개의 스테이지가 있습니다.</h1>
        <h3 className={S.next}>CLICK !</h3>

        <Image
          src={bill}
          alt="bill"
          onClick={onNext}
          className={`${S.bill_1} ${animation && S.animation_up_down}`}
        />
        <Image src={bills} alt="bill" className={S.bill_2} />
        <Image src={bills} alt="bill" className={S.bill_3} />
        <Image src={bills} alt="bill" className={S.bill_4} />
        <Image src={bills} alt="bill" className={S.bill_5} />
      </div>
    </main>
  );
}
