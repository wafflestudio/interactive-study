import { useEffect } from 'react';

import { MessageAction } from '../types/message';

/**
 * useMessageListener
 *
 * Chrome 런타임 환경에서 들어오는 메시지를 감지, 메시지 유형에 따라 동작을 실행
 *
 * @param {function} onStartSelection
 * @param {function} onApplyFilter
 * @param {function} onStopSelection
 */
interface Params {
  onStartSelection: () => void;
  onApplyFilter: (filter: string) => void;
  onStopSelection: () => void;
}

export const useMessageListener = ({
  onStartSelection,
  onApplyFilter,
  onStopSelection,
}: Params) => {
  const messageListener = (message: {
    action: MessageAction;
    filter?: string;
  }) => {
    switch (message.action) {
      case MessageAction.START_SELECTION:
        onStartSelection();
        break;
      case MessageAction.APPLY_FILTER:
        if (message.filter) onApplyFilter(message.filter);
        break;
      case MessageAction.STOP_SELECTION:
        onStopSelection();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener);

    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, [messageListener, onStartSelection, onApplyFilter, onStopSelection]);
};
