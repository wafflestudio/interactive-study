import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import styles from './PopupNative.module.css';

export const PopupNative = () => {
  return (
    <article className={styles.PopupNative}>
      <Header />
      <img src="/sample-image.png" />
      <div className={styles.slider}>
        <div className={styles.filterList}>
          {['적록색맹', '필름카메라', '유리창', '빛 번짐', '기타'].map(
            (filterName) => (
              <div key={filterName} className={styles.filterItem}>
                <img src="/sample-image.png" />
                <h3 className={styles.filterName}>{filterName}</h3>
              </div>
            ),
          )}
        </div>
      </div>
      <div className={styles.divider} />
      <footer className={styles.footer}>
        <Button theme="gray">필터 초기화</Button>
        <Button>적용하기</Button>
      </footer>
    </article>
  );
};
