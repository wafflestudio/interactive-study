import { useEffect, useMemo, useRef } from 'react';

import createWreathSans from '../../../../libs/leon-sans-react/src/hooks/createWreathSans';

interface Params {
  width?: number;
  height?: number;
  fontColor?: string;
  darkMode?: boolean;
  initialText: string;
}

export default function useWreathSans({
  width,
  height,
  darkMode,
  fontColor,
  initialText,
}: Params) {
  const ref = useRef<HTMLDivElement>(null);

  const { WreathSansCanvas, resize, redraw, getText, onInputHandler } =
    useMemo(() => {
      return createWreathSans({
        initialText: initialText,
        width: width ? width : ref.current?.offsetWidth ?? 330,
        height: height ? height : ref.current?.offsetHeight ?? 234,
        size: width ? width / 8 : 40,
        color: fontColor ?? '#704234',
        background: 'transparent',
        backgroundAlpha: 0,
        darkMode: darkMode ?? false,
      });
    }, [
      initialText,
      width,
      height,
      fontColor,
      darkMode,
      ref.current?.offsetWidth,
      ref.current?.offsetHeight,
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
