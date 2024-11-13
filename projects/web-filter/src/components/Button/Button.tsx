import { PropsWithChildren } from 'react';

import styles from './Button.module.css';

type ButtonProps = PropsWithChildren<{
  theme?: 'blue' | 'gray';
}>;

export const Button = ({ children, theme = 'blue' }: ButtonProps) => {
  return (
    <button className={`${styles.Button} ${styles[theme]}`}>{children}</button>
  );
};
