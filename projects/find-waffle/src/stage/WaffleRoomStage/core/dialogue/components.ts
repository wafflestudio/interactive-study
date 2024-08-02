import van from 'vanjs-core';

import './styles.css';

const { div, img, span } = van.tags;

// types
export type Chunk = {
  size?: 'normal' | 'large' | 'huge';
  value: string;
};

export type DialogueState = {
  currentChunks: Chunk[];
  currentIndex: number;
  lastIndex: number;
};

// util
export const SlicedChunks = ({
  currentChunks,
  currentIndex,
}: DialogueState) => {
  const { slicedChunks } = currentChunks.reduce(
    (acc, chunk) => {
      if (acc.remainingCounts === 0) {
        const newChunk = {
          ...chunk,
          value: ' ',
        };
        acc.slicedChunks.push(newChunk);
        return acc;
      }
      if (acc.remainingCounts > chunk.value.length) {
        acc.remainingCounts = acc.remainingCounts - chunk.value.length;
        acc.slicedChunks.push(chunk);
        return acc;
      }
      const newChunk = {
        ...chunk,
        value: chunk.value.slice(0, acc.remainingCounts),
      };
      acc.slicedChunks.push(newChunk);
      acc.remainingCounts = 0;
      return acc;
    },
    {
      slicedChunks: [] as Chunk[],
      remainingCounts: currentIndex,
    },
  );
  return slicedChunks.map(({ size, value }) =>
    span({ class: size ?? 'normal' }, value),
  );
};

// states
export const containerVisibility = van.state(false);

// Container
const containerClassName = van.derive(() =>
  containerVisibility.val ? `DialogueContainer` : `DialogueContainer invisible`,
);

export const DialogueContainer = div(
  { class: containerClassName },
  img({ src: '/ui/dialogue_ui.png' }),
  div({ class: 'textsContainer' }),
);
