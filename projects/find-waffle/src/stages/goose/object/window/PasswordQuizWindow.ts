import { PASSWORD, PASSWORD_QUIZ_ANGLE } from '../../constant';
import { QuizWindow } from './QuizWindow';

export class PasswordQuizWindow extends QuizWindow {
  constructor() {
    super(PASSWORD_QUIZ_ANGLE, '/goose/key.png');
    this.toolbar.innerText = 'Enter Password';
    this.button.innerText = 'Enter';
  }

  addSolvedListener(fn: () => void) {
    this.button.addEventListener('click', () => {
      if (this.input.value === PASSWORD) {
        this.toolbar.innerText = 'Correct!';
        this.button.disabled = true;
        this.button.innerText = '>>';
        this.input.disabled = true;
        fn();
      } else {
        this.toolbar.innerText = 'Wrong';
        this.input.value = '';
      }
    });
  }
}
