import * as PIXI from 'pixi.js';
import { useCallback, useEffect, useRef } from 'react';

import { usePixiDispatcher } from '../hooks/usePixiDispatcher';
import LeonSans from '../leon-temp/leon';
import { PixiDataRefs } from '../types/DataRefs';
import { PixiHandlers } from '../types/Handler';

type LeonPixiProps = {
  // leon config
  text: string;
  color?: string | number;
  size?: number;
  weight?: number;
  isDraw?: boolean;
  // canvas config
  width?: number;
  height?: number;
  pixelRatio?: number;
  // animation
  dispatcher?: ReturnType<typeof usePixiDispatcher>;
} & PixiHandlers;

export default function LeonPixi({
  text,
  color = 0x000000,
  size = 60,
  weight = 400,
  isDraw = true,
  width = 800,
  height = 600,
  pixelRatio = 2,
  dispatcher,
  onAnimate,
}: LeonPixiProps) {
  /**
   * Stored Refs
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRefs = useRef<PixiDataRefs | null>(null);
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
      const { graphics, renderer, stage, leon, isDraw } = dataRefs.current;

      // clear canvas
      graphics.clear();

      // set position
      const x = (width - leon.rect.w) / 2;
      const y = (height - leon.rect.h) / 2;
      leon.position(x, y);

      // resolve handlers
      if (handlers.current.onAnimate)
        handlers.current.onAnimate(dataRefs.current, currentFrame);

      // default draw function
      if (isDraw) {
        leon.drawPixi(graphics);
        renderer.render(stage);
      }
    },
    [dataRefs, width, height],
  );

  /**
   * Initiate LeonPixi
   * canvasRef는 마운트 되었지만, dataRefs는 생성되지 않았을 때 한 번만 실행된다
   */
  useEffect(() => {
    if (!canvasRef.current || dataRefs.current) return;
    const canvas = canvasRef.current;

    // create leon
    const leon = new LeonSans({
      text,
      color: [color],
      size,
      weight,
    });

    // create pixi
    const renderer = new PIXI.Renderer({
      width,
      height,
      resolution: pixelRatio,
      antialias: true,
      autoDensity: true,
      powerPreference: 'high-performance',
      view: canvas,
      background: 0xffffff,
    });
    const stage = new PIXI.Container();
    const graphics = new PIXI.Graphics();
    stage.addChild(graphics);

    // save dataRefs
    dataRefs.current = {
      canvas: canvasRef.current,
      leon,
      renderer,
      stage,
      graphics,
      isDraw,
      pixelRatio,
    };
    if (dispatcher) dispatcher.initiate(dataRefs.current); // dispatcher에 dataRefs 전달

    // start animation
    requestAnimationFrame(animate);
  }, [canvasRef]);

  /**
   *  Update Leon
   */
  useEffect(() => {
    if (!dataRefs.current) return;
    dataRefs.current.leon.text = text;
    dataRefs.current.leon.color = [color];
    dataRefs.current.leon.size = size;
    dataRefs.current.leon.weight = weight;
    dataRefs.current.isDraw = isDraw;
    dataRefs.current.pixelRatio = pixelRatio;
  }, [dataRefs, text, color, size, weight, isDraw, pixelRatio]);

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