// src/SnowCanvas.tsx
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

export interface Snowflake {
  x: number;
  y: number;
  radius: number;
  density: number;
}

export default function SnowFlakes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakes: Snowflake[] = [];

  // 눈송이 초기화
  const initializeSnowflakes = () => {
    for (let i = 0; i < 150; i++) {
      snowflakes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 10 + 1,
        density: Math.random(),
      });
    }
  };

  // 눈송이 그리기
  const drawSnowflakes = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    snowflakes.forEach((flake) => {
      ctx.moveTo(flake.x, flake.y);
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true);
    });
    ctx.fill();
  };

  // 눈송이 움직임 업데이트
  const updateSnowflakes = () => {
    snowflakes.forEach((flake) => {
      flake.y += Math.pow(flake.density, 2) + 1;
      flake.x += Math.sin(flake.y) * 2;

      // 화면 아래로 넘어가면 위로 다시 이동
      if (flake.y > window.innerHeight) {
        flake.x = Math.random() * window.innerWidth;
        flake.y = 0;
      }
    });
  };

  // 애니메이션 실행
  const animate = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawSnowflakes(ctx);
        updateSnowflakes();
      }
    }
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    initializeSnowflakes();
    animate();
  }, []);

  return (
    <Canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;
