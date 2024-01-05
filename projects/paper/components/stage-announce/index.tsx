'use client';

import S from './styles.module.css';
import Image from 'next/image';
import { Mode } from '@/types/bill';
import bill from '@/public/images/pictures/front.png';
import bills from '@/public/images/pictures/front_blue_light.png';

export default function StageAnnounce({
  mode,
  currStage,
}: {
  mode: Mode;
  currStage: number;
}) {
  return (
    <div className={S.bill_container}>
      <h1
        className={`${mode === Mode.LIGHTED ? S.stage : S.stage_dark}`}
      >{`STAGE ${currStage}`}</h1>

      {currStage === 1 && (
        <>
          <Image src={bill} alt="bill" className={`${S.bill_1}`} />
          <Image src={bills} alt="bill" className={S.bill_2} />
          <Image src={bills} alt="bill" className={S.bill_3} />
          <Image src={bills} alt="bill" className={S.bill_4} />
          <Image src={bills} alt="bill" className={S.bill_5} />
        </>
      )}
      {currStage === 2 && (
        <>
          <Image src={bills} alt="bill" className={`${S.bill_1}`} />
          <Image src={bill} alt="bill" className={S.bill_2} />
          <Image src={bills} alt="bill" className={S.bill_3} />
          <Image src={bills} alt="bill" className={S.bill_4} />
          <Image src={bills} alt="bill" className={S.bill_5} />
        </>
      )}
      {currStage === 3 && (
        <>
          <Image src={bills} alt="bill" className={`${S.bill_1}`} />
          <Image src={bills} alt="bill" className={S.bill_2} />
          <Image src={bill} alt="bill" className={S.bill_3} />
          <Image src={bills} alt="bill" className={S.bill_4} />
          <Image src={bills} alt="bill" className={S.bill_5} />
        </>
      )}
      {currStage === 4 && (
        <>
          <Image src={bills} alt="bill" className={`${S.bill_1}`} />
          <Image src={bills} alt="bill" className={S.bill_2} />
          <Image src={bills} alt="bill" className={S.bill_3} />
          <Image src={bill} alt="bill" className={S.bill_4} />
          <Image src={bills} alt="bill" className={S.bill_5} />
        </>
      )}
      {currStage === 5 && (
        <>
          <Image src={bills} alt="bill" className={`${S.bill_1}`} />
          <Image src={bills} alt="bill" className={S.bill_2} />
          <Image src={bills} alt="bill" className={S.bill_3} />
          <Image src={bills} alt="bill" className={S.bill_4} />
          <Image src={bill} alt="bill" className={S.bill_5} />
        </>
      )}
    </div>
  );
}
