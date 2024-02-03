import { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  density: number;
  t: number; // DESC: 눈송이 회전 각도
  sp: number; // DESC: 눈송이 속도
  sz: number; // DESC: 눈송이 크기
}

export default function SnowFlakes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let animationFrameId: number;

  // DESC: 캔버스 클리어 함수
  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    if (canvasRef?.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // DESC: 눈송이 초기화 및 애니메이션 실행 함수
  const initializeAndAnimateSnowflakes = () => {
    const snowflakes: Snowflake[] = [];
    const numberFlakes = 30; // 눈송이 수
    const d = 7; // 크기 조정 인자

    for (let i = 0; i < numberFlakes; i++) {
      const sz = (100 / (10 + 100 * Math.random())) * d; // 눈송이 크기 계산
      snowflakes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 10 + 1,
        density: Math.random(),
        t: Math.random() * (2 * Math.PI), // 각도 초기화
        sp: 0.004 * Math.pow(0.8 * sz, 2), // 속도 계산
        sz: sz, // 크기 저장
      });
    }

    // DESC: 이전 애니메이션 프레임 취소
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    const drawSnowflakes = (ctx: CanvasRenderingContext2D) => {
      clearCanvas(ctx); // 캔버스 클리어
      snowflakes.forEach((flake) => {
        const gradient = ctx.createRadialGradient(
          flake.x,
          flake.y,
          0,
          flake.x,
          flake.y,
          flake.sz,
        );
        gradient.addColorStop(0, 'hsla(255, 255%, 255%, 1)');
        gradient.addColorStop(1, 'hsla(255, 255%, 255%, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.sz, 0, Math.PI * 2, true);
        ctx.fill();
      });
    };

    const updateSnowflakes = () => {
      snowflakes.forEach((flake) => {
        flake.t += 0.005; // 각도 업데이트
        flake.y += flake.sp; // 속도에 따른 y 위치 업데이트
        flake.x += Math.sin(flake.t) * 2; // x 위치 업데이트

        // DESC: 화면 밖으로 나가면 위치 재설정
        if (flake.y > window.innerHeight + 50) {
          flake.y = -10 - Math.random() * 20;
          flake.x = Math.random() * window.innerWidth;
        }
      });
    };

    const animate = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawSnowflakes(ctx);
          updateSnowflakes();
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    initializeAndAnimateSnowflakes();

    const handleResize = () => {
      // DESC: 윈도우 크기가 변경될 때 캔버스 사이즈 재설정
      if (canvasRef?.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
      initializeAndAnimateSnowflakes();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId); // 컴포넌트 언마운트 시 애니메이션 중단
    };
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
