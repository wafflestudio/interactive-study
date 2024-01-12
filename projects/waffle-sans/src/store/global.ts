import { atom } from 'recoil';

export enum Mode {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export const modeState = atom<Mode>({
  key: 'modeState',
  default: Mode.LIGHT,
});
