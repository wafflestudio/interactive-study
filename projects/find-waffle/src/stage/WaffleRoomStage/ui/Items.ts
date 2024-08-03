import van from 'vanjs-core';

import './Items.css';
import { Bag, bags } from './itemData';

const { div, button, img } = van.tags;

export const currentBag = van.state<null | Bag>(null);

export const bagSuccess = van.state(false);

export const Items = (endCallback: () => void) => () => {
  const bagName = van.derive(() => currentBag.val?.name ?? '');
  const isSuccess = van.derive(() => bagSuccess.val);
  return div(
    { class: '__background' },
    div(
      { class: '__main' },
      div(
        { class: '__left' },
        bags.map((row, i) => {
          return div(
            { class: '__row' },
            row.map((item) => {
              if (!item)
                return div(
                  { class: '__item', key: i },
                  div({ class: '__dot' }),
                );
              return div(
                { class: '__item', key: i },
                button(
                  { class: '__bag', onclick: () => (currentBag.val = item) },
                  img({ src: item.imageSrc }),
                ),
              );
            }),
          );
        }),
      ),
      div(
        { class: '__right' },
        div(
          { class: '__canvasWrapper' },
          div({ class: '__label' }, div(bagName)),
          () =>
            isSuccess.val
              ? button(
                  { class: '__buttonSuccess', onclick: () => endCallback() },
                  '찾았다!',
                )
              : button({ class: '__button' }, '찾았다!'),
        ),
      ),
    ),
  );
};
