import van from 'vanjs-core';

import styles from './Items.module.css';

const { div, button } = van.tags;

export const Items = div(
  { class: styles.background },
  div(
    { class: styles.main },
    div(
      { class: styles.left },
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) =>
        div({ class: styles.item, key: i }, div({ class: styles.dot })),
      ),
    ),
    div(
      { class: styles.right },
      div(
        { class: styles.canvasWrapper },
        div({ class: styles.label }, '우유 아이스크림'),
        button({ class: styles.button }, '찾았다!'),
      ),
    ),
  ),
);
