import { TOFU } from './constants';
import { LATIN } from './latin';
import { LOWER } from './lower';
import { NUMBER } from './number';
import { SPECIAL } from './special';
import { UPPER } from './upper';

const DATA = Object.assign({}, UPPER, LOWER, NUMBER, SPECIAL, LATIN);

export function typo(v: string) {
  const t = DATA[v] || DATA[TOFU];
  const clone = t.clone();
  clone.v = v;
  return clone;
}
