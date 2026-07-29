import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../store/editorStore';

export function useCanvas() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const setCanvas = useEditorStore((state) => state.setCanvas);
  const setSelectedObject = useEditorStore((state) => state.setSelectedObject);
  const refreshObjects = useEditorStore((state) => state.refreshObjects);
  const pushHistory = useEditorStore((state) => state.pushHistory);

  useEffect(() => {
    if (!canvasElRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasElRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    setCanvas(fabricCanvas);

    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected[0] ?? null);
    });
    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected[0] ?? null);
    });
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // 오브젝트 추가/삭제 → 레이어 목록 갱신 + 히스토리 저장
    fabricCanvas.on('object:added', () => {
      refreshObjects();
      pushHistory();
    });
    fabricCanvas.on('object:removed', () => {
      refreshObjects();
      pushHistory();
    });
    // 드래그/리사이즈/회전/속성변경이 "끝났을 때"만 히스토리 저장
    fabricCanvas.on('object:modified', (e) => {
      setSelectedObject(e.target ?? null);
      pushHistory();
    });

    // 초기 빈 캔버스 상태를 첫 히스토리로 저장
    pushHistory();

    return () => {
      fabricCanvas.dispose();
    };
  }, [setCanvas, setSelectedObject, refreshObjects, pushHistory]);

  return { canvasElRef };
}