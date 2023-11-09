import { create } from "zustand";
import disks from "@/data/disks.json";
import { Coordinates } from "@/physics/types";
import { isInsideAreaCalled } from "@/physics/areas";

type InteractionStore = {
  diskIds: string[];

  // disk status
  pickedDiskId: string | null; // disk aside list
  previewedDiskId: string | null; // disk dropped center for preview
  playingDiskId: string | null; // disk inside player

  // grab disk
  grabbedDiskId: string | null;
  grabbedPivotCoords: Coordinates | null;
  cursorCoords: Coordinates | null;
  pickDisk: (id: string | null) => void;
  grabDisk: (id: string | null, grabbedPivot: Coordinates | null) => void;
  onGrabMove: (coords: Coordinates) => void;
  onMouseUp: () => void;
  onEmit: () => void;
};

const useInteractionStore = create<InteractionStore>()((set, get) => ({
  diskIds: disks.map(({ id }) => id),
  pickedDiskId: null,
  previewedDiskId: null,
  playingDiskId: null,
  grabbedDiskId: null,

  grabbedPivotCoords: null,
  cursorCoords: null,
  pickDisk: (id) => set({ pickedDiskId: id }),
  grabDisk: (id, pivot) =>
    set({
      grabbedDiskId: id,
      grabbedPivotCoords: pivot ? pivot : null,
    }),
  onGrabMove: (coords) => set({ cursorCoords: coords }),
  onMouseUp: () =>
    set((state) => {
      if (!state.grabbedDiskId) return state;
      if (!state.cursorCoords) return state;
      const clearGrabState = {
        grabbedDiskId: null,
        grabbedPivotCoords: null,
        cursorCoords: null,
        pickedDiskId: null,
        previewedDiskId: null,
        playingDiskId: null,
      };
      const coords = state.cursorCoords;
      if (state.pickedDiskId === state.grabbedDiskId) {
        if (isInsideAreaCalled("cancelPick", coords)) {
          return { ...clearGrabState };
        }
        if (isInsideAreaCalled("preview", coords)) {
          return {
            ...clearGrabState,
            previewedDiskId: state.grabbedDiskId,
          };
        }
      }
      if (state.previewedDiskId === state.grabbedDiskId) {
        if (isInsideAreaCalled("cancelPreview", coords)) {
          return {
            ...clearGrabState,
          };
        }
        if (isInsideAreaCalled("play", coords)) {
          return {
            ...clearGrabState,
            playingDiskId: state.grabbedDiskId,
          };
        }
      }

      return clearGrabState;
    }),
  onEmit: () =>
    set(() => {
      return {
        previewedDiskId: null,
        playingDiskId: null,
      };
    }),
}));

export default useInteractionStore;
