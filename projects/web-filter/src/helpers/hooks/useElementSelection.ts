// TODO: refactor
import { useEffect, useRef, useState } from 'react';

import { MessageAction } from '../types/message';
import { createOverlayCanvas, drawOverlay } from '../utils/createOverlayCanvas';

export const useElementSelection = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null,
  );
  const [hoverElement, setHoverElement] = useState<HTMLElement | null>(null);

  const animationFrameRef = useRef<number>();
  const resizeHandlerRef = useRef<() => void>();
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const startSelection = () => {
    if (isSelecting) return;

    setIsSelecting(true);
    setHoverElement(null);
    const canvas = createOverlayCanvas();
    overlayCanvasRef.current = canvas;
    ctxRef.current = canvas.getContext('2d')!;

    const resizeHandler = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (hoverElement) {
          drawOverlay(ctxRef.current, canvas, hoverElement, animationFrameRef);
        }
      }
    };

    window.addEventListener('resize', resizeHandler);
    resizeHandlerRef.current = resizeHandler;

    document.addEventListener('mousemove', mouseMoveHandler, true);
    document.addEventListener('click', clickHandler, true);
    document.addEventListener('keydown', keyDownHandler, true);
  };

  const stopSelection = () => {
    if (!isSelecting) return;

    setIsSelecting(false);
    setHoverElement(null);
    setSelectedElement(null);

    document.removeEventListener('mousemove', mouseMoveHandler, true);
    document.removeEventListener('click', clickHandler, true);
    document.removeEventListener('keydown', keyDownHandler, true);

    if (resizeHandlerRef.current) {
      window.removeEventListener('resize', resizeHandlerRef.current);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (overlayCanvasRef.current?.parentElement) {
      overlayCanvasRef.current.parentElement.removeChild(
        overlayCanvasRef.current,
      );
    }

    overlayCanvasRef.current = null;
    ctxRef.current = null;
    resizeHandlerRef.current = undefined;
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!isSelecting) return;

    e.preventDefault();
    e.stopPropagation();

    const element = document.elementFromPoint(
      e.clientX,
      e.clientY,
    ) as HTMLElement | null;

    if (hoverElement !== element) {
      setHoverElement(element);
      drawOverlay(
        ctxRef.current,
        overlayCanvasRef.current!,
        element,
        animationFrameRef,
      );
    }
  };

  const keyDownHandler = (e: KeyboardEvent) => {
    if (!isSelecting) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      stopSelection();
    }
  };

  const clickHandler = (e: MouseEvent) => {
    if (!isSelecting) return;

    e.preventDefault();
    e.stopPropagation();

    setSelectedElement(hoverElement);
    stopSelection();
  };

  /** @utils */
  const applyFilter = (filter: string) => {
    if (selectedElement) {
      selectedElement.style.filter =
        filter && filter !== 'none' ? `url(#${filter})` : '';
    }
  };

  /** @execute */
  useEffect(() => {
    const messageListener = (message: {
      action: MessageAction;
      filter: string;
    }) => {
      switch (message.action) {
        case MessageAction.START_SELECTION:
          startSelection();
          break;
        case MessageAction.APPLY_FILTER:
          applyFilter(message.filter);
          break;
        case MessageAction.STOP_SELECTION:
          stopSelection();
          break;
        default:
          break;
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
      stopSelection();
    };
  }, [isSelecting, hoverElement, selectedElement]);
};
