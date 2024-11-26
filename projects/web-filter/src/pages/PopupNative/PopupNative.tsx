import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { ACTION } from '../../types/status';
import styles from './PopupNative.module.css';

export const PopupNative = () => {
  const handleStartSelectElement = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0]?.id;

    if (tabId) {
      await chrome.runtime.sendMessage({
        tabId,
        action: ACTION.START_SELECT_ELEMENT,
      });
    }
  };

  const handleFilterClick = async (filterId: string) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0]?.id;
    const action = ACTION.APPLY_FILTER;

    if (tabId) {
      await chrome.runtime.sendMessage({ tabId, action, filterId });
    }
  };

  return (
    <article className={styles.PopupNative}>
      <Header />
      <img src="/sample-image.png" />
      <div className={styles.slider}>
        <div className={styles.filterList}>
          {[
            {
              filterId: 'wave',
              filterName: '파도',
            },
            {
              filterId: 'vintage',
              filterName: '빈티지',
            },
          ].map(({ filterId, filterName }) => (
            <div
              key={filterId}
              className={styles.filterItem}
              onClick={() => handleFilterClick(filterId)}
            >
              <img src="/sample-image.png" />
              <h3 className={styles.filterName}>{filterName}</h3>
            </div>
          ))}
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
