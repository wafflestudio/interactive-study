import Image from 'next/image';

import styles from './DiskFront.module.css';

type DiskFrontProps = {
  type?: 'classic' | 'paper' | 'holographic';
  imageUrl?: string;
};

function ImageOrDiv({
  imageUrl,
  className,
}: {
  imageUrl?: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <img src={imageUrl} className={className} alt={'앨범 커버 이미지'} />
    );
  } else {
    return <div className={className} />;
  }
}

function DiskFront({ type = 'classic', imageUrl }: DiskFrontProps) {
  return (
    <div className={styles.container}>
      <div className={styles.mainLayer}>
        <div className={styles.hologram} />
        <div className={styles.opaque} />
      </div>
      <div className={styles.blendLayer}>
        {type === 'classic' && (
          <>
            <ImageOrDiv
              imageUrl={imageUrl}
              className={`${styles.blend} ${styles.classic1}`}
            />
            <ImageOrDiv
              imageUrl={imageUrl}
              className={`${styles.blend} ${styles.classic2}`}
            />
            <ImageOrDiv
              imageUrl={imageUrl}
              className={`${styles.blend} ${styles.classic3}`}
            />
            <ImageOrDiv
              imageUrl={imageUrl}
              className={`${styles.blend} ${styles.classic4}`}
            />
            <ImageOrDiv
              imageUrl={imageUrl}
              className={`${styles.blend} ${styles.classic5}`}
            />
          </>
        )}
        {type === 'paper' && (
          <>
            <ImageOrDiv
              imageUrl={imageUrl}
              className={`${styles.blend} ${styles.paper1}`}
            />
            <ImageOrDiv
              imageUrl={imageUrl}
              className={`${styles.blend} ${styles.paper2}`}
            />
          </>
        )}
        {type === 'holographic' && (
          <>
            <ImageOrDiv
              imageUrl={imageUrl}
              className={`${styles.blend} ${styles.holographic1}`}
            />
            <ImageOrDiv
              imageUrl={imageUrl}
              className={`${styles.blend} ${styles.holographic2}`}
            />
          </>
        )}
      </div>
      <div className={styles.holeLayer}>
        <div className={`${styles.hole} ${styles.hole1}`} />
        <div className={`${styles.hole} ${styles.hole2}`} />
      </div>
    </div>
  );
}

export default DiskFront;
