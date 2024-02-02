import { useCallback, useEffect, useRef } from 'react';

import WreathSansController from '../domain/WreathSansController';
import { usePixiDispatcher } from '../hooks/usePixiDispatcher';
import { PixiHandlers } from '../types/Handler';

type LeonPixiProps = {
  // leon config
  initialText: string;
  color?: string;
  size?: number;
  weight?: number;
  // canvas config
  width?: number;
  height?: number;
  // animation
  dispatcher?: ReturnType<typeof usePixiDispatcher>;
} & PixiHandlers;

export default function LeonPixi({
  initialText,
  color = '#000000',
  size = 500,
  weight = 400,
  width = 800,
  height = 600,
  dispatcher,
  onAnimate,
}: LeonPixiProps) {
  /**
   * Stored Refs
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRefs = useRef<WreathSansController | null>(null);
  const handlers = useRef<PixiHandlers>({});

  /**
   * Functions
   */

  const animate: FrameRequestCallback = useCallback(
    (currentFrame) => {
      // create loop
      requestAnimationFrame(animate);

      // parse dataRefs
      if (!dataRefs.current) return;
      const { graphics, renderer, stage, leon } = dataRefs.current;

      // clear canvas
      graphics.clear();

      // resolve handlers
      if (handlers.current.onAnimate)
        handlers.current.onAnimate(dataRefs.current, currentFrame);

      // default draw function
      leon.drawPixi(graphics);
      // 배경을 투명하게 설정하기
      renderer.render(stage);
    },
    [dataRefs],
  );

  /**
   * Initiate LeonPixi
   * canvasRef는 마운트 되었지만, dataRefs는 생성되지 않았을 때 한 번만 실행된다
   */
  useEffect(() => {
    if (!canvasRef.current || dataRefs.current) return;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    
    const wreathsans = new WreathSansController({
      canvas,
      initialText,
      leonOptions: {
        color,
        size,
        weight,
      },
    });

    // create pixi
    const renderer = wreathsans.renderer;
    const stage = wreathsans.stage;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__PIXI_STAGE__ = stage;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__PIXI_RENDERER__ = renderer;

    // save dataRefs
    dataRefs.current = wreathsans;
    if (dispatcher) dispatcher.initiate(dataRefs.current); // dispatcher에 dataRefs 전달

    // start animation
    requestAnimationFrame(animate);
  }, [canvasRef]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   *  Update Leon
   */
  useEffect(() => {
    if (!dataRefs.current) return;
    dataRefs.current.leon.color = [color];
    dataRefs.current.leon.size = size;
    dataRefs.current.leon.weight = weight;
  }, [dataRefs, color, size, weight]);

  /**
   * update handler
   */
  useEffect(() => {
    handlers.current.onAnimate = onAnimate;
  }, [onAnimate]);

  /**
   * Clenup on unmount
   */
  useEffect(
    () => () => {
      dataRefs.current = null;
    },
    [],
  );

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
