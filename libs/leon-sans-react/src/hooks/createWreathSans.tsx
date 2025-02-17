import { CHARSET } from 'leonsans';
import { ComponentPropsWithoutRef } from 'react';

import WreathSansController from '../domain/WreathSansController';

type Props = {
  // leon config
  initialText: string;
  color?: string;
  size?: number;
  weight?: number;
  // canvas config
  width?: number;
  height?: number;
  pixelRatio?: number;
  background?: string;
  backgroundAlpha?: number;
  darkMode?: boolean;
};

export default function createWreathSans({
  initialText,
  color = '#000000',
  size = 60,
  weight = 400,
  width = 800,
  height = 600,
  background = '#ffffff',
  backgroundAlpha = 1,
  darkMode,
}: Props) {
  const wreathSansController = new WreathSansController({
    initialText,
    background,
    backgroundAlpha,
    darkMode,
    leonOptions: {
      color,
      size,
      weight,
    },
  });

  wreathSansController.resize(width, height);

  const canvas = wreathSansController.canvas;
  const graphics = wreathSansController.graphics;
  const leon = wreathSansController.leon;
  const renderer = wreathSansController.renderer;
  const stage = wreathSansController.stage;

  function animate() {
    // create loop
    requestAnimationFrame(animate);

    // clear canvas
    graphics.clear();

    // default draw function
    leon.drawPixi(graphics);
    renderer.render(stage);
  }

  const onInputHandler = (
    e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const inputElement = e.currentTarget;
    const newText: string = e.currentTarget.value;
    const caretIdx = inputElement.selectionStart!;
    const inputEvent = e.nativeEvent as InputEvent;
    const data = inputEvent.data;
    const inputType = inputEvent.inputType;

    if (
      inputType === 'insertLineBreak' ||
      (inputType === 'insertText' && data === null)
    ) {
      const insertIdx = caretIdx - 1; // 입력된 문자의 인덱스
      wreathSansController.insertText('\n', insertIdx);
    } else if (
      inputType === 'insertText' ||
      inputType === 'insertCompositionText'
    ) {
      // 입력 가능한 문자인지 검사
      const isValid = CHARSET.includes(data!) || ' '.includes(data!);
      if (!isValid) {
        alert(`"${data}"는 허용되지 않는 문자입니다.`);
        inputElement.value = inputElement.value.replace(data!, '');
        return;
      }

      const insertIdx = caretIdx - 1; // 입력된 문자의 인덱스
      const deleted =
        wreathSansController.leon.text.length - newText.length + 1; // 삭제된 글자 수

      // 삭제된 글자가 있을 경우
      if (deleted > 0) wreathSansController.deleteText(insertIdx, deleted);

      wreathSansController.insertText(data!, insertIdx);
    } else if (inputType.startsWith('delete') && newText.length > 0) {
      wreathSansController.deleteText(
        caretIdx,
        wreathSansController.leon.text.length - newText.length,
      );
    } else {
      // 입력 가능한 문자만 포함되어 있는지 검사
      const isValid = newText
        .split('')
        .every((c) => CHARSET.includes(c) || ' \n'.includes(c));
      if (!isValid) {
        alert(`"${newText}"에는 허용되지 않는 문자가 포함되어 있습니다.`);
        inputElement.value = inputElement.value.replace(newText, '');
        return;
      }

      wreathSansController.replaceText(newText);
    }
  };

  function resize(width: number, height: number) {
    wreathSansController.resize(width, height);
  }

  function WreathSansCanvas(props: ComponentPropsWithoutRef<'div'>) {
    requestAnimationFrame(animate);
    return <div {...props} ref={(inst) => inst?.appendChild(canvas)}></div>;
  }

  function redraw() {
    wreathSansController.redraw();
  }

  function getText() {
    return wreathSansController.leon.text;
  }

  return {
    WreathSansCanvas,
    onInputHandler,
    resize,
    redraw,
    getText,
  };
}
