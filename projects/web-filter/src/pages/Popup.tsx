import { useEffect } from 'react';

import { MessageAction } from '../helpers/types/message';
import './Popup.css';

export default function () {
  useEffect(() => {
    console.log('Hello from the popup!');
  }, []);

  /**
   * @context chrome.tabs
   * https://developer.chrome.com/docs/extensions/mv2/reference/tabs?hl=ko
   */

  // 테스트
  const getCurrentTab = async () => {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  };

  const applyFilter = async (filter: string) => {
    const tab = await getCurrentTab();
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: MessageAction.APPLY_FILTER,
        filter, // filter 정보를 담아서 전송 {key: filter}
      });
    }
  };

  const startSelection = async () => {
    const tab = await getCurrentTab();
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: MessageAction.START_SELECTION,
      });
    }
  };

  // TODO: (테스트) 인라인 스타일은 후에 css 파일로 분리
  return (
    <div>
      <img src="/coffee-filter.png" />
      <h1>Web Filter</h1>
      <button
        onClick={startSelection}
        style={{
          width: '100px',
          height: '30px',
        }}
      >
        요소 선택
      </button>

      <section style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => applyFilter('filter')}
          style={{
            width: '100px',
            height: '30px',
          }}
        >
          Wave Filter
        </button>
        <button
          onClick={() => applyFilter('vintageFilter')}
          style={{
            width: '100px',
            height: '30px',
          }}
        >
          Vintage Filter
        </button>
      </section>
    </div>
  );
}
