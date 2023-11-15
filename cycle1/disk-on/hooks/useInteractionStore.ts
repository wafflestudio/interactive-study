import { create } from "zustand";
import disks from "@/data/disks.json";
import { Coordinates } from "@/physics/types";
import { isInsideAreaCalled } from "@/physics/areas";

type InteractionStore = {
  diskIds: string[];

  // disk status
  previewedDiskId: string | null; // disk dropped center for preview
  playingDiskId: string | null; // disk inside player

  // grab disk
  grabbedDiskId: string | null;
  grabbedPivotCoords: Coordinates | null;
  cursorCoords: Coordinates | null;
  previewDisk: (id: string | null) => void;
  playDisk: (id: string | null) => void;
  grabDisk: (id: string | null, grabbedPivot: Coordinates | null) => void;
  onGrabMove: (coords: Coordinates) => void;
  onMouseUp: () => void;
  onEmit: () => void;
};

const useInteractionStore = create<InteractionStore>()((set, get) => ({
  diskIds: disks.map(({ id }) => id),
  previewedDiskId: null,
  playingDiskId: null,
  grabbedDiskId: null,

  grabbedPivotCoords: null,
  cursorCoords: null,

  // preview disk를 선택합니다.
  previewDisk: (id) => set({ previewedDiskId: id, playingDiskId: null }),
  playDisk: (id) => set({ playingDiskId: id, previewedDiskId: null }),

  grabDisk: (id, pivot) =>
    set({
      grabbedDiskId: id,
      grabbedPivotCoords: pivot ? pivot : null,
    }),

  // grab 시에 cursorCoords를 변경합니다.
  onGrabMove: (coords) => set({ cursorCoords: coords }),

  onMouseUp: () => {
    set((state) => {
      if (!state.grabbedDiskId) return state;
      if (!state.cursorCoords) return { ...state, grabbedDiskId: null };
      const clearGrabState = {
        grabbedDiskId: null,
        grabbedPivotCoords: null,
        cursorCoords: null,
        pickedDiskId: null,
        previewedDiskId: null,
        playingDiskId: null,
      };
      const coords = state.cursorCoords;
      if (state.previewedDiskId !== state.grabbedDiskId) {
        if (isInsideAreaCalled("preview", coords)) {
          return {
            ...clearGrabState,
            previewedDiskId: state.grabbedDiskId,
          };
        }
      } else {
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
    });
  },

  onEmit: () =>
    set(() => {
      return {
        previewedDiskId: null,
        playingDiskId: null,
      };
    }),
}));

export default useInteractionStore;
