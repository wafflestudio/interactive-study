import { useEffect, useState } from 'react';

import { clearOverlayCanvas } from '../utils/clearOverlayCanvas';
import { createOverlayCanvas } from '../utils/createOverlayCanvas';
import { drawOverlay } from '../utils/drawOverlay';

export const useActionHandler = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [hoverElement, setHoverElement] = useState<HTMLElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null,
  );

  const startSelection = () => {
    if (isSelecting) return;

    setIsSelecting(true);
    setHoverElement(null);
    createOverlayCanvas({});
  };

  const stopSelection = () => {
    if (!isSelecting) return;

    setIsSelecting(false);
    setHoverElement(null);
    setSelectedElement(null);
    clearOverlayCanvas({});
  };

  const applyFilter = (filter: string) => {
    if (selectedElement) {
      selectedElement.style.filter = `url(#${filter})`;
    }
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!isSelecting) return;

    e.preventDefault();
    e.stopPropagation();

    const element = document.elementFromPoint(
      e.clientX,
      e.clientY,
    ) as HTMLElement | null;

    setHoverElement(element);
    drawOverlay({ targetElement: element });
  };

  const clickHandler = (e: MouseEvent) => {
    if (!isSelecting) return;

    e.preventDefault();
    e.stopPropagation();

    setSelectedElement(hoverElement);
    stopSelection();
  };

  const initializeEvent = () => {
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('click', clickHandler);
  };

  const removeEvent = () => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('click', clickHandler);
  };

  useEffect(() => {
    initializeEvent();
    return () => removeEvent();
  }, []);

  return {
    startSelection,
    stopSelection,
    applyFilter,
  };
};
