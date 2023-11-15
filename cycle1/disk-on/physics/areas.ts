import {
  DISK_GAP,
  IDLE_DISK_STYLE,
  PICKED_DISK_STYLE,
  PLAYING_DISK_STYLE,
  PREVIEWED_DISK_STYLE,
} from "./constants";
import { parseCoordinatesIfPercent, pivotCoordinate } from "./functions";
import { Area, Coordinates } from "./types";

const cancelPickArea: Area = {
  min: parseCoordinatesIfPercent({ x: 0, y: 0 }),
  max: parseCoordinatesIfPercent({ x: 0.3, y: 1 }),
};

const previewArea: Area = {
  min: parseCoordinatesIfPercent({ x: 0.3, y: 0 }),
  max: parseCoordinatesIfPercent({ x: 1, y: 1 }),
};

const cancelPreviewArea: Area = {
  min: parseCoordinatesIfPercent({ x: 0, y: 0 }),
  max: parseCoordinatesIfPercent({ x: 0.4, y: 1 }),
};

const playArea: Area = {
  min: parseCoordinatesIfPercent({ x: 0.5, y: 0 }),
  max: parseCoordinatesIfPercent({ x: 1, y: 1 }),
};

const checkIfCoordinatesInsideArea = (
  area: Area,
  { x, y }: Coordinates,
): boolean => {
  return area.min.x < x && x < area.max.x && area.min.y < y && y < area.max.y;
};

export const isInsideAreaCalled = (
  area: "cancelPick" | "preview" | "cancelPreview" | "play",
  coords: Coordinates,
): boolean => {
  switch (area) {
    case "cancelPick":
      return checkIfCoordinatesInsideArea(cancelPickArea, coords);
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
  isPreviewed,
  isPlaying,
}: {
  index: number;
  isPreviewed: boolean;
  isPlaying: boolean;
}): { coords: Coordinates; size: number } => {
  if (isPreviewed) {
    const { vertex, pivot, heightRatio } = PREVIEWED_DISK_STYLE;
    const size = window.innerHeight * heightRatio;
    const coords = pivotCoordinate(
      parseCoordinatesIfPercent(vertex),
      size,
      pivot,
    );
    return {
      coords,
      size,
    };
  }
  if (isPlaying) {
    const { vertex, pivot, heightRatio } = PLAYING_DISK_STYLE;
    const size = window.innerHeight * heightRatio;
    const coords = pivotCoordinate(
      parseCoordinatesIfPercent(vertex),
      size,
      pivot,
    );
    return {
      coords,
      size,
    };
  }
  const { vertex, pivot, size } = IDLE_DISK_STYLE(index);
  return {
    coords: pivotCoordinate(vertex, size, pivot),
    size,
  };
};
