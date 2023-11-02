import { diskGap, diskSize } from "./constants";
import { parseCoordinatesIfPercent, pivotCoordinate } from "./functions";
import { Area, Coordinates } from "./types";

const previewArea: Area = {
  min: parseCoordinatesIfPercent({ x: 0.4, y: 0 }),
  max: parseCoordinatesIfPercent({ x: 0.8, y: 1 }),
};

const cancelPreviewArea: Area = {
  min: parseCoordinatesIfPercent({ x: 0, y: 0 }),
  max: parseCoordinatesIfPercent({ x: 0.4, y: 1 }),
};

const playArea: Area = {
  min: parseCoordinatesIfPercent({ x: 0.8, y: 0 }),
  max: parseCoordinatesIfPercent({ x: 1, y: 1 }),
};

const checkIfCoordinatesInsideArea = (
  area: Area,
  { x, y }: Coordinates,
): boolean =>
  area.min.x < x && x < area.max.x && area.min.y < y && y < area.max.y;

export const isInsideAreaCalled = (
  area: "preview" | "cancelPreview" | "play",
  coords: Coordinates,
): boolean => {
  switch (area) {
    case "preview":
      return checkIfCoordinatesInsideArea(previewArea, coords);
    case "cancelPreview":
      return checkIfCoordinatesInsideArea(cancelPreviewArea, coords);
    case "play":
      return checkIfCoordinatesInsideArea(playArea, coords);
  }
};

export const calculateCoordsAndSizeByArea = ({
  index,
  isPicked,
  isPreviewed,
  isPlaying,
}: {
  index: number;
  isPicked: boolean;
  isPreviewed: boolean;
  isPlaying: boolean;
}): { coords: Coordinates; size: number } => {
  const initialY = diskGap * index;

  if (isPicked) {
    const size = diskSize * 1.2;
    const coords = pivotCoordinate(
      {
        x: size,
        y: initialY,
      },
      size,
    );
    return {
      coords,
      size,
    };
  }
  if (isPreviewed) {
    const size = window.innerHeight * 0.8;
    const coords = pivotCoordinate(
      parseCoordinatesIfPercent({ x: 0.5, y: 0.5 }),
      size,
      "center",
    );
    return {
      coords,
      size,
    };
  }
  if (isPlaying) {
    const size = window.innerHeight * 0.8;
    const coords = pivotCoordinate(
      parseCoordinatesIfPercent({ x: 1, y: 50 }),
      size,
      "rightTop",
    );
    return {
      coords,
      size,
    };
  }
  return {
    coords: pivotCoordinate(
      {
        x: 0,
        y: initialY,
      },
      diskSize,
    ),
    size: diskSize,
  };
};
