import { GOOSE_QUIZ_ANGLE, GOOSE_TO_CLICK } from '../../constant';
import { QuizWindow } from './QuizWindow';

export class GooseQuizWindow extends QuizWindow {
  #clickedId = new Set<number>();
  #completed = false;

  constructor() {
    super(GOOSE_QUIZ_ANGLE, '/goose/goose3.png');
    this.toolbar.innerText = 'Pet Goose';
    this.button.innerText = 'Done';
    this.input.hidden = true;
    this.button.disabled = true;

    this.#updateHeading(0);
  }

  gooseClicked(id: number) {
    this.#clickedId.add(id);

    const cnt = this.#clickedId.size;
    this.#updateHeading(cnt);

    if (GOOSE_TO_CLICK <= cnt && !this.#completed) {
      this.button.disabled = false;
    }
  }

  addSolvedListener(fn: () => void) {
    this.button.onclick = () => {
      this.button.disabled = true;
      this.button.innerText = '>>';
      this.#completed = true;
      fn();
    };
  }

  #updateHeading(cnt: number) {
    this.heading.innerText = `Pet Goose (${cnt}/${GOOSE_TO_CLICK})`;
  }
}
