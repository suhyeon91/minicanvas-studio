import { create } from 'zustand';
import type { Canvas, FabricObject } from 'fabric';

interface EditorState {
  canvas: Canvas | null;
  selectedObject: FabricObject | null;
  setCanvas: (canvas: Canvas) => void;
  setSelectedObject: (obj: FabricObject | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  canvas: null,
  selectedObject: null,
  setCanvas: (canvas) => set({ canvas }),
  setSelectedObject: (obj) => set({ selectedObject: obj }),
}));