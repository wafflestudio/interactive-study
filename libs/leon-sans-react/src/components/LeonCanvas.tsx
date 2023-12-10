import { useCallback, useEffect, useRef } from 'react';

import LeonSans from '../leonsans/leonsans';
// import LeonSans from '../leonsans-js/leonsans.js';
import { CanvasDataRefs } from '../types/DataRefs';
import { CanvasDispatcher } from '../types/Dispatcher';
import { CanvasHandlers } from '../types/Handler';

type LeonCanvasProps = {
  // leon config
  text: string;
  color?: string;
  size?: number;
  weight?: number;
  isDraw?: boolean;
  // wave config
  isWave?: boolean;
  pathGap?: number;
  amplitude?: number;
  fps?: number;
  // canvas config
  width?: number;
  height?: number;
  pixelRatio?: number;
  // animation
  dispatcher?: CanvasDispatcher;
} & CanvasHandlers;

export default function LeonCanvas({
  text,
  color = '#000000',
  size = 60,
  weight = 400,
  isWave = false,
  pathGap = 0.5,
  amplitude = 0.5,
  fps = 30,
  width = 800,
  height = 600,
  pixelRatio = 2,
  dispatcher,
  onAnimate,
}: LeonCanvasProps) {
  /**
   * Stored Refs
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRefs = useRef<CanvasDataRefs | null>(null);
  const handlers = useRef<CanvasHandlers>({});

  /**
   * Functions
   */
  const animate: FrameRequestCallback = useCallback(
    (currentFrame) => {
      // create loop
      requestAnimationFrame(animate);

      // parse dataRefs
      if (!dataRefs.current) return;
      const { ctx, leon } = dataRefs.current;

      // clear canvas
      ctx.clearRect(0, 0, width, height);

      // set position
      const x = (width - leon.rect.w) / 2;
      const y = (height - leon.rect.h) / 2;
      leon.position(x, y);

      // resolve handlers
      if (handlers.current.onAnimate)
        handlers.current.onAnimate(dataRefs.current, currentFrame);

      // default draw function
      leon.draw(ctx, currentFrame);
    },
    [dataRefs, width, height, handlers],
  );

  /**
   * Initiate LeonCanvas
   * canvasRef는 마운트 되었지만, dataRefs는 생성되지 않았을 때 한 번만 실행된다
   */
  useEffect(() => {
    if (!canvasRef.current || dataRefs.current) return;
    const canvas = canvasRef.current;

    // create ctx and leon instance, and store them as dataRefs
    if (!dataRefs.current) {
      const ctx = canvas.getContext('2d');
      const leon = new LeonSans({
        text,
        color: [color],
        size,
        weight,
        isWave,
        pathGap,
        amplitude,
        fps,
      });
      /**
       * ?Question: 어째서 ctx가 null일 수 있지?
       */
      if (ctx) {
        ctx.scale(pixelRatio, pixelRatio); // pixelRatio에 맞게 canvas 크기 조절
        dataRefs.current = { canvas, ctx, leon, pixelRatio }; // dataRefs 저장
        if (dispatcher) dispatcher.initiate(dataRefs.current); // dispatcher에 dataRefs 전달
        if (onAnimate) handlers.current.onAnimate = onAnimate;
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
    dataRefs.current.leon.isWave = isWave;
    dataRefs.current.leon.pathGap = pathGap;
    dataRefs.current.leon.amplitude = amplitude;
    dataRefs.current.leon.fps = fps;
    dataRefs.current.pixelRatio = pixelRatio;
  }, [text, color, size, weight, isWave, pathGap, amplitude, fps, pixelRatio]);

  /**
   * update handler
   */
  useEffect(() => {
    handlers.current.onAnimate = onAnimate;
  }, [onAnimate]);

  /**
   * Clenup on unmount
   * 컴포넌트가 언마운트할 때 한 번만 실행
   */
  useEffect(
    () => () => {
      if (!dataRefs.current) return;
      const pixelRatio = dataRefs.current.pixelRatio;
      dataRefs.current.ctx.scale(1 / pixelRatio, 1 / pixelRatio);
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
