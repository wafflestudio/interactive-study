import useInteractionStore from "@/hooks/useInteractionStore";
import { Disk } from "@/types/spring/disk";
import { useSpring } from "@react-spring/web";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getXAndYFromMouseEvent, pivotCoordinate } from "@/physics/functions";
import { calculateCoordsAndSizeByArea } from "@/physics/areas";

type DiskHookParams = {
  id: Disk["id"]; //
  index: number; // decide
  size: number;
};

export const useDiskMovement = ({
  id,
  index,
  size: initialSize,
}: DiskHookParams) => {
  const [size, setSize] = useState(initialSize);
  const radius = useMemo(() => size / 2, [size]);

  const store = useInteractionStore((state) => state);

  const [movement, movementApi] = useSpring(() => {
    return {
      from: {
        // translations
        "--translate-x": `${0}px`,
        "--translate-y": `${0}px`,
        "--translate-z": `0px`,

        // rotations
        "--rotate-x": "0deg",
        "--rotate-y": "180deg",
        "--rotate-z": "0deg",
        "--pointer-x": `${radius}px`,
        "--pointer-y": `${radius}px`,
        "--relative-x": 0,
        "--relative-y": 0,
        "--pointer-from-center": 0,

        // size
        "--size": `${initialSize}px`,
      },
    };
  });

  /**
   * 마우스가 디스크에서 벗어났을 때 회전값을 초기화합니다.
   */
  const handleMouseLeaveFromDisk: MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      movementApi.start({
        "--rotate-x": `0deg`,
        "--rotate-y": `0deg`,
        "--rotate-z": "0deg",
        "--pointer-x": `${radius}px`,
        "--pointer-y": `${radius}px`,
        "--relative-x": 0,
        "--relative-y": 0,
        "--pointer-from-center": 0,
      });
    }, [movementApi, radius]);

  /**
   * Event Handlers
   */
  const handleMouseMoveOnDisk: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const { x: pointerX, y: pointerY } = getXAndYFromMouseEvent(e, "parent");

      const relativeX = (pointerX - radius) / radius;
      const relativeY = (pointerY - radius) / radius;

      movementApi.start({
        "--rotate-x": `${-relativeY * 30}deg`,
        "--rotate-y": `${-relativeX * -30 + 180}deg`,
        "--pointer-x": `${pointerX}px`,
        "--pointer-y": `${pointerY}px`,
        "--relative-x": relativeX,
        "--relative-y": relativeY,
        "--pointer-from-center":
          Math.sqrt(
            Math.pow(pointerX - radius, 2) + Math.pow(pointerY - radius, 2),
          ) / radius,
      });
    },
    [movementApi, radius],
  );

  const handleMouseDownOnDisk: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (store.grabbedDiskId) return;
      const pivot = getXAndYFromMouseEvent(e, "parent");
      store.grabDisk(id, pivot);
    },
    [id, store.grabbedDiskId, store.grabDisk],
  );

  // grab이 아닐 때 기본 위치 계산
  useEffect(() => {
    if (store.grabbedDiskId === id) return;
    const {
      coords: { x, y },
      size: newSize,
    } = calculateCoordsAndSizeByArea({
      index,
      isPicked: id === store.pickedDiskId,
      isPreviewed: id === store.previewedDiskId,
      isPlaying: id === store.playingDiskId,
    });
    movementApi.start({
      "--translate-x": `${x}px`,
      "--translate-y": `${y}px`,
      "--size": `${newSize}px`,
    });
    setSize(newSize);
  }, [
    id,
    store.grabbedDiskId,
    movementApi,
    store.pickedDiskId,
    store.previewedDiskId,
    store.playingDiskId,
    index,
  ]);

  // grab일 때 커서에 따라 디스크 위치 조정
  useEffect(() => {
    if (!store.grabbedDiskId) return;
    if (!store.cursorCoords) return;
    if (!store.grabbedPivotCoords) return;
    if (store.grabbedDiskId !== id) return;

    const { x, y } = pivotCoordinate(
      store.cursorCoords,
      size,
      store.grabbedPivotCoords,
    );

    movementApi.start({
      "--translate-x": `${x}px`,
      "--translate-y": `${y}px`,
    });
  }, [
    id,
    movementApi,
    size,
    store.grabbedDiskId,
    store.grabbedPivotCoords,
    store.cursorCoords,
  ]);

  return {
    handleMouseDownOnDisk,
    handleMouseMoveOnDisk,
    handleMouseLeaveFromDisk,
    movement,
  };
};
