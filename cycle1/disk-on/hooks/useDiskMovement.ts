import useInteractionStore from "@/hooks/useInteractionStore";
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
  id: string;
  index: number;
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
   * 마우스가 디스크 위에서 움직일 때 회전시킵니다
   */
  const handleMouseMoveOnDisk: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (store.grabbedDiskId === id) return;
      if (store.playingDiskId === id) return;
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
    [id, movementApi, radius, store.grabbedDiskId, store.playingDiskId],
  );

  /**
   * 디스크를 클릭해서 선택할 때
   */
  const handleMouseClickOnDisk: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (
        store.pickedDiskId !== id &&
        store.previewedDiskId !== id &&
        store.playingDiskId !== id
      ) {
        store.pickDisk(id);
        return;
      }
    },
    [id, store],
  );
  /**
   * 디스크를 잡을 때
   */
  const handleMouseDownOnDisk: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (store.grabbedDiskId) return;
      if (store.pickedDiskId !== id && store.previewedDiskId !== id) return;
      const pivot = getXAndYFromMouseEvent(e, "parent");
      store.grabDisk(id, pivot);
    },
    [id, store],
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
    movementApi,
    store.grabbedDiskId,
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
    handleMouseClickOnDisk,
    movement,
  };
};
