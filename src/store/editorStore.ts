import { create } from 'zustand';
import type { Canvas } from 'fabric';

interface EditorState {
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
}));