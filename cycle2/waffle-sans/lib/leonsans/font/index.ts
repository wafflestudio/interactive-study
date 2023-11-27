import { LATIN } from './latin';
import { LOWER } from './lower';
import { NUMBER } from './number';
import { SPECIAL } from './special';
import { UPPER } from './upper';

const DATA = { ...UPPER, ...LOWER, ...NUMBER, ...SPECIAL, ...LATIN };

export function typo(v: string) {
  const t = v in DATA ? DATA[v as keyof typeof DATA] : DATA[TOFU];
  const clone = t.clone();
  clone.v = v;
  return clone;
}
