import sampleSrc from '../../assets/sample-image.png';
import { Header } from '../../components/Header/Header';
import styles from './Popup.module.css';

export const Popup = () => {
  return (
    <article className={styles.Popup}>
      <Header />
      <img src={sampleSrc} />
      <div className={styles.slider}>
        <div className={styles.filterList}>
          {['적록색맹', '필름카메라', '유리창', '빛 번짐', '기타'].map(
            (filterName) => (
              <div key={filterName} className={styles.filterItem}>
                <img src={sampleSrc} />
                <h3 className={styles.filterName}>{filterName}</h3>
              </div>
            ),
          )}
        </div>
      </div>
      <footer></footer>
    </article>
  );
};
