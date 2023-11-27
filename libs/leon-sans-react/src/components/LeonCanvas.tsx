import { useCallback, useEffect, useRef } from 'react';

import { useDispatcher } from '../hooks/useDispatcher';
import LeonSans from '../leon-temp/leon';

type Leon = any; // TODO: Leon 타입 확정하기

type LeonCanvasProps = {
  // leon config
  text: string;
  color?: string;
  size?: number;
  weight?: number;
  // canvas config
  width?: number;
  height?: number;
  pixelRatio?: number;
  // animation
  dataRefs?: () => void;
  dispatcher?: ReturnType<typeof useDispatcher>;
};

export default function LeonCanvas({
  text,
  color = '#000000',
  size = 60,
  weight = 400,
  width = 800,
  height = 600,
  pixelRatio = 2,
  dispatcher,
}: LeonCanvasProps) {
  /**
   * Stored Data
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRefs = useRef<{
    ctx: CanvasRenderingContext2D;
    leon: Leon;
  } | null>(null);

  /**
   * Functions
   */
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, leon: Leon) => {
      ctx.clearRect(0, 0, width, height);
      const x = (width - leon.rect.w) / 2;
      const y = (height - leon.rect.h) / 2;
      leon.position(x, y);
      leon.draw(ctx);
    },
    [width, height],
  );

  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    if (!dataRefs.current) return;
    const { ctx, leon } = dataRefs.current;
    draw(ctx, leon);
  }, [dataRefs, draw]);

  /**
   * Initiate LeonCanvas
   * canvasRef는 마운트 되었지만, dataRefs는 생성되지 않았을 때 한 번만 실행된다
   */
  useEffect(() => {
    // initiate
    if (!canvasRef.current || dataRefs.current) return;
    const canvas = canvasRef.current;

    // create ctx and leon instance, and store them as state
    if (!dataRefs.current) {
      const ctx = canvas.getContext('2d');
      const leon = new LeonSans({ text, color: [color], size, weight });
      /**
       * ?Question: 어째서 ctx가 null일 수 있지?
       */
      if (ctx) {
        ctx.scale(pixelRatio, pixelRatio);
        dataRefs.current = { ctx, leon };
        if (dispatcher) dispatcher(dataRefs.current);
      }
      requestAnimationFrame(animate);
    }
  }, [canvasRef]);

  /**
   * Update Leon
   */
  useEffect(() => {
    if (!dataRefs.current) return;
    dataRefs.current.leon.text = text;
    dataRefs.current.leon.color = [color];
    dataRefs.current.leon.size = size;
    dataRefs.current.leon.weight = weight;
  }, [text, color, size, weight]);

  /**
   * Clenup on unmount
   */
  useEffect(
    () => () => {
      dataRefs.current = null;
    },
    [],
  );

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      width={width * pixelRatio}
      height={height * pixelRatio}
    />
  );
}
