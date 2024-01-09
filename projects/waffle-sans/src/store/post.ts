import { atom } from 'recoil';

export const postFormState = atom<{
  sender: string;
  receiver: string;
  content: string;
}>({
  key: 'postFormState',
  default: {
    sender: '',
    receiver: '',
    content: '',
  },
});
