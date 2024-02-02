import { useEffect, useMemo, useRef } from 'react';

import createWreathSans from '../../../../libs/leon-sans-react/src/hooks/createWreathSans';

interface Params {
  fontSize?: number;
  fontColor?: string;
  initialText: string;
}

export default function useWreathSans({
  fontSize,
  fontColor,
  initialText,
}: Params) {
  const ref = useRef<HTMLDivElement>(null);

  const { WreathSansCanvas, resize, redraw, getText, onInputHandler } =
    useMemo(() => {
      return createWreathSans({
        initialText: initialText,
        width: ref?.current?.offsetWidth ?? 330,
        height: ref?.current?.offsetHeight ?? 234,
        size: fontSize ?? 40,
        color: fontColor ?? '#704234',
        background: 'transparent',
      });
    }, [
      fontSize,
      fontColor,
      initialText,
      ref?.current?.offsetWidth,
      ref?.current?.offsetHeight,
    ]);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current?.offsetWidth && ref.current?.offsetHeight) {
        resize(ref.current.offsetWidth, ref.current.offsetHeight);
        redraw();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [redraw, resize, ref]);

  return { WreathSansCanvas, ref, resize, redraw, getText, onInputHandler };
}
