export enum MessageAction {
  APPLY_FILTER = 'apply-filter',
  START_SELECTION = 'start-selection',
  STOP_SELECTION = 'stop-selection',
}

export interface Message {
  action: MessageAction;
  filter?: string;
}
