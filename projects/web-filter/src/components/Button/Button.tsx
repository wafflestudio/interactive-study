import { PropsWithChildren } from 'react';

import styles from './Button.module.css';

type ButtonProps = PropsWithChildren<{
  theme?: 'blue' | 'gray';
  onClick?: () => void;
}>;

export const Button = ({ children, theme = 'blue', onClick }: ButtonProps) => {
  return (
    <button className={`${styles.Button} ${styles[theme]}`} onClick={onClick}>
      {children}
    </button>
  );
};
