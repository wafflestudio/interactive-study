import { State } from 'vanjs-core';

import {
  Chunk,
  DialogueContainer,
  DialogueState,
  SlicedChunks,
  containerVisibility,
} from './components';

export class Dialogue {
  public element: HTMLElement;
  public containerVisibility: State<boolean>;
  public currentState: DialogueState;
  public currentQueue: Chunk[][] = [];
  public endCallback?: () => void;
  public isAnimating = false;

  constructor({ app }: { app: HTMLElement }) {
    this.containerVisibility = containerVisibility;
    this.currentState = {
      currentChunks: [],
      currentIndex: 0,
      lastIndex: 0,
    };
    this.currentQueue = [];
    this.endCallback = () => {};

    // check if element exists
    const element = app.querySelector('.DialogueContainer');
    if (element) {
      this.element = element as HTMLElement;
      return;
    }

    // add element
    this.element = DialogueContainer;
    app.appendChild(this.element);
  }

  public begin(chunksQueue: Chunk[][], onEndDialogue?: () => void) {
    this.currentQueue = chunksQueue;
    this.endCallback = onEndDialogue;
    this.next();
  }

  public next() {
    if (this.isAnimating) {
      this.currentState.currentIndex = this.currentState.lastIndex;
      return;
    }

    const nextChunks = this.currentQueue.shift();

    if (!nextChunks) {
      if (this.endCallback) this.endCallback();
      this.containerVisibility.val = false;
      return;
    }

    if (!nextChunks) {
      this.end();
    }

    this.currentState = {
      currentChunks: nextChunks,
      currentIndex: 0,
      lastIndex: nextChunks.reduce(
        (acc, { value }) => (acc += value.length),
        0,
      ),
    };

    const animate = () => {
      const target = this.element.querySelector('.textsContainer');
      if (target) {
        target.innerHTML = '';
        const chunks = SlicedChunks(this.currentState);
        for (let i = 0; i < chunks.length; i++) {
          target.appendChild(chunks[i]);
        }
      }
      this.containerVisibility.val = true;
      this.currentState.currentIndex += 1;

      setTimeout(() => {
        if (this.currentState.currentIndex > this.currentState.lastIndex) {
          this.isAnimating = false;
        } else {
          this.isAnimating = true;
          animate();
        }
      }, 80);
    };

    animate();
  }

  public end() {
    this.endCallback = undefined;
  }

  public dispose() {
    this.element.remove();
  }
}
