import { atom } from 'recoil';

export const sansInputState = atom<string>({
  key: 'sansInputState',
  default: '',
});
