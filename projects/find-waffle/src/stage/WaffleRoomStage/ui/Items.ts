import van from 'vanjs-core';

import styles from './Items.module.css';
import { Bag, bags } from './itemData';

const { div, button, img } = van.tags;

export const currentBag = van.state<null | Bag>(null);

export const bagSuccess = van.state(false);

export const Items = () => {
  const bagName = van.derive(() => currentBag.val?.name ?? '');
  const isSuccess = van.derive(() => bagSuccess.val);
  return div(
    { class: styles.background },
    div(
      { class: styles.main },
      div(
        { class: styles.left },
        bags.map((row, i) => {
          return div(
            { class: styles.row },
            row.map((item) => {
              if (!item)
                return div(
                  { class: styles.item, key: i },
                  div({ class: styles.dot }),
                );
              return div(
                { class: styles.item, key: i },
                button(
                  { class: styles.bag, onclick: () => (currentBag.val = item) },
                  img({ src: item.imageSrc }),
                ),
              );
            }),
          );
        }),
      ),
      div(
        { class: styles.right },
        div(
          { class: styles.canvasWrapper },
          div({ class: styles.label }, div(bagName)),
          () =>
            isSuccess.val
              ? button({ class: styles.button }, '찾았다!')
              : button({ class: styles.button }, '못찾았다!'),
        ),
      ),
    ),
  );
};
