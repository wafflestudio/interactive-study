import * as PIXI from 'pixi.js';
import { useCallback, useEffect, useRef } from 'react';

import { usePixiDispatcher } from '../hooks/usePixiDispatcher';
import LeonSans from '../leon-temp/leon';

type Leon = any; // TODO: Leon 타입 확정하기

type LeonPixiProps = {
  // leon config
  text: string;
  color?: string | number;
  size?: number;
  weight?: number;
  // canvas config
  width?: number;
  height?: number;
  pixelRatio?: number;
  // animation
  dataRefs?: () => void;
  dispatcher?: ReturnType<typeof usePixiDispatcher>;
};

export default function LeonPixi({
  text,
  color = 0x000000,
  size = 60,
  weight = 400,
  width = 800,
  height = 600,
  pixelRatio = 2,
  dispatcher,
}: LeonPixiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRefs = useRef<{
    leon: Leon;
    canvas: HTMLCanvasElement;
    renderer: PIXI.Renderer;
    stage: PIXI.Container;
    graphics: PIXI.Graphics;
  } | null>(null);

  /**
   * Functions
   */
  const draw = useCallback(
    (
      graphics: PIXI.Graphics,
      renderer: PIXI.Renderer,
      stage: PIXI.Container,
      leon: Leon,
    ) => {
      const x = (width - leon.rect.w) / 2;
      const y = (height - leon.rect.h) / 2;
      leon.position(x, y);
      graphics.clear();
      leon.drawPixi(graphics);
      renderer.render(stage);
    },
    [width, height],
  );

  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    if (!dataRefs.current) return;
    const { graphics, renderer, stage, leon } = dataRefs.current;
    draw(graphics, renderer, stage, leon);
  }, [dataRefs, draw]);

  /**
   * Init Renderer
   */
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
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
      const leon = new LeonSans({
        text,
        color: [color],
        size,
        weight,
      });

      const stage = new PIXI.Container();
      const graphics = new PIXI.Graphics();
      stage.addChild(graphics);
      if (dispatcher) dispatcher({ leon, canvas, renderer, stage, graphics });

      dataRefs.current = {
        canvas: canvasRef.current,
        leon,
        renderer,
        stage,
        graphics,
      };
      requestAnimationFrame(animate);
    }
  }, [canvasRef]);

  /**
   *  Update Leon
   */
  useEffect(() => {
    if (!dataRefs.current) return;
    dataRefs.current.leon.text = text;
  }, [dataRefs, text]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
