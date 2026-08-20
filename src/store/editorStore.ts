import { create } from 'zustand';
import type { Canvas, FabricObject } from 'fabric';

const MAX_HISTORY = 50;
type Mode = 'select' | 'line' | 'polygon';

interface EditorState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  canvas: Canvas | null;
  selectedObject: FabricObject | null;
  objects: FabricObject[];
  history: string[];
  historyIndex: number;
  isRestoring: boolean;
  setCanvas: (canvas: Canvas) => void;
  setSelectedObject: (obj: FabricObject | null) => void;
  refreshObjects: () => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  selectionType: string | null; // 'activeselection' | 'group' | 'rect' 등
  setSelectionType: (type: string | null) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  selectedObject: null,
  objects: [],
  history: [],
  historyIndex: -1,
  isRestoring: false,
  mode: 'select',
  selectionType: null,
  setSelectionType: (type) => set({ selectionType: type }),
  setMode: (mode) => set({ mode }),
  setCanvas: (canvas) => set({ canvas }),
  setSelectedObject: (obj) => set({ selectedObject: obj }),

  refreshObjects: () => {
    const canvas = get().canvas;
    if (!canvas) return;
    set({ objects: [...canvas.getObjects()].reverse() });
  },

  pushHistory: () => {
    const { canvas, isRestoring, history, historyIndex } = get();
    if (!canvas || isRestoring) return; // 복원 중이면 저장 안 함 (무한루프 방지)

    const snapshot = JSON.stringify(canvas.toJSON());

    // 현재 위치 이후의 redo 기록은 버리고 새 기록 추가
    const newHistory = [...history.slice(0, historyIndex + 1), snapshot];
    // 스택 크기 제한
    const trimmed = newHistory.length > MAX_HISTORY
      ? newHistory.slice(newHistory.length - MAX_HISTORY)
      : newHistory;

    set({ history: trimmed, historyIndex: trimmed.length - 1 });
  },

  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const prevIndex = historyIndex - 1;
    set({ isRestoring: true });
    canvas.loadFromJSON(JSON.parse(history[prevIndex])).then(() => {
      canvas.requestRenderAll();
      set({ historyIndex: prevIndex, isRestoring: false, selectedObject: null });
      get().refreshObjects();
    });
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const nextIndex = historyIndex + 1;
    set({ isRestoring: true });
    canvas.loadFromJSON(JSON.parse(history[nextIndex])).then(() => {
      canvas.requestRenderAll();
      set({ historyIndex: nextIndex, isRestoring: false, selectedObject: null });
      get().refreshObjects();
    });
  },
}));