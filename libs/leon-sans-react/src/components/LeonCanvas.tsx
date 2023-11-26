import { useCallback, useEffect, useRef } from 'react';

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
  dispatcher?: (data: { ctx: CanvasRenderingContext2D; leon: Leon }) => void;
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
   * Initiate Canvas
   */
  useEffect(() => {
    // initiate
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      // create ctx and leon instance, and store them as state
      /**
       * ?Question: 어째서 ctx가 null일 수 있지?
       */
      const ctx = canvas.getContext('2d');
      const leon = new LeonSans({ text, color, size, weight });
      if (ctx) {
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
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      width={width * pixelRatio}
      height={height * pixelRatio}
    />
  );
}
