import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { STATUS } from '../../types/status';
import styles from './PopupNative.module.css';

export const PopupNative = () => {
  const handleStartSelectElement = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0]?.id;

    if (tabId) {
      await chrome.runtime.sendMessage({ tabId, action: STATUS.SURFING });
    }
  };

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
        <Button theme="blue" onClick={handleStartSelectElement}>
          요소 선택하기
        </Button>
      </footer>
    </article>
  );
};
