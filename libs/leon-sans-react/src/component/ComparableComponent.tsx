import { useCallback, useEffect, useRef } from 'react';

import LeonSans from '../leon-temp/leon';

type LeonCanvasProps = {
  text: string;
  color?: string;
  size?: number;
  weight?: number;
  width?: number;
  height?: number;
  pixelRatio?: number;
};

export default function LeonCanvasWithoutMemoization({
  text,
  color = '#000000',
  size = 60,
  weight = 400,
  width = 800,
  height = 600,
  pixelRatio = 2,
}: LeonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leonData = useRef<{
    ctx: CanvasRenderingContext2D;
    leon: any;
  } | null>(null);

  const animate = useCallback(() => {
    // create loop
    requestAnimationFrame(animate);

    if (!leonData.current) return;

    // get data
    const { ctx, leon } = leonData.current;

    // clear canvas
    ctx.clearRect(0, 0, width, height);

    // update and draw leon
    const x = (width - leon.rect.w) / 2;
    const y = (height - leon.rect.h) / 2;
    leon.position(x, y);
    leon.draw(ctx);
  }, [leonData, width, height]);

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
      if (ctx) leonData.current = { ctx, leon };
      requestAnimationFrame(animate);
    }
  }, [canvasRef, text, color, size, weight, animate]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      width={width * pixelRatio}
      height={height * pixelRatio}
    />
  );
}
