import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as PIXI from 'pixi.js';

import { usePixiDispatcher } from '../hooks/usePixiDispatcher';
import LeonSans from '../leon-temp/leon';
import { PixiDataRefs } from '../types/DataRefs';
import { PixiHandlers } from '../types/Handler';

type LeonPixiMetaballProps = {
  // mode
  // mode?: 'default' | 'metaball' | 'pattern; -> to ENUM
  // leon config
  text: string;
  color?: string | number;
  bgColor?: string | number;
  size?: number;
  weight?: number;
  isDraw?: boolean;
  particleTotal?: number;
  // canvas config
  width?: number;
  height?: number;
  pixelRatio?: number;
  // animation
  dispatcher?: ReturnType<typeof usePixiDispatcher>;
} & PixiHandlers;

export default function LeonPixiMetaball({
  text,
  color = 0x000000,
  bgColor = 0xffffff,
  size = 60,
  weight = 400,
  isDraw = true,
  width = 800,
  height = 600,
  pixelRatio = 2,
  particleTotal = 10000,
  dispatcher,
  onAnimate,
}: LeonPixiMetaballProps) {
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
      const { graphics, renderer, stage, leon, isDraw, particleContainer, particles } = dataRefs.current;

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
      pathGap: -1,
      isPath: true,
      tracking: 0
    });

    // create pixi (generating pixi objects)
    const renderer = new PIXI.Renderer({
      width,
      height,
      resolution: pixelRatio,
      antialias: true,
      autoDensity: true,
      powerPreference: 'high-performance',
      view: canvas,
      background: bgColor,
    });
    const stage = new PIXI.Container();
    const graphics = new PIXI.Graphics();
    stage.addChild(graphics);
    const particleContainer = new PIXI.ParticleContainer(particleTotal, {
      vertices: false,
      scale: true,
      position: true,
      rotation: false,
      uvs: false,
      alpha: false
    });
    stage.addChild(particleContainer);

    const particles = [];
    const texture = PIXI.Texture.from('./assets/drop-alpha.png');
    for (let i = 0; i < particleTotal; i++) {
        const p = new PIXI.Sprite(texture);
        p.x = width / 2;
        p.y = height / 2;
        p.anchor.set(0.5);
        p.scale.x = p.scale.y = 0;
        particleContainer.addChild(p);
        particles.push(p);
    }

    const blurFilter = new PIXI.BlurFilter();
    blurFilter.blur = 10;
    blurFilter.autoFit = true;

    // TODO: 함수분리
    const fragSource = [
      'precision mediump float;',
      'varying vec2 vTextureCoord;',
      'uniform sampler2D uSampler;',
      'uniform float threshold;',
      'uniform float mr;',
      'uniform float mg;',
      'uniform float mb;',
      'void main(void)',
      '{',
      '    vec4 color = texture2D(uSampler, vTextureCoord);',
      '    vec3 mcolor = vec3(mr, mg, mb);',
      '    if (color.a > threshold) {',
      '       gl_FragColor = vec4(mcolor, 1.0);',
      '    } else {',
      '       gl_FragColor = vec4(vec3(0.0), 0.0);',
      '    }',
      '}'
    ].join('\n');

    const uniformsData = {
      threshold: 0.5,
      mr: 255.0/255.0,
      mg: 255.0/255.0,
      mb: 255.0/255.0,
  };

    const thresholdFilter = new PIXI.Filter(undefined, fragSource, uniformsData);
    stage.filters = [blurFilter, thresholdFilter];
    stage.filterArea = renderer.screen;

    // TODO: GUI 컨트롤 붙이기
    // const gui = new dat.GUI();
    // gui.add(leon, 'text');
    // const sizeControll = gui.add(leon, 'size', 200, 1000);
    // gui.add(leon, 'tracking', -6, 10);
    // gui.add(leon, 'leading', -8, 10);
    // weightControll = gui.add(controll, 'weight', 1, 9);
    // gui.add(controll, 'drawing');
    // const colorControll = gui.add(controll, 'color', [ 'white', 'black', 'red'] );

    // ----- AFTER CHANGE -----
    // save dataRefs
    dataRefs.current = {
      canvas: canvasRef.current,
      leon,
      renderer,
      stage,
      graphics,
      isDraw,
      pixelRatio,
      particles,
      particleContainer
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
