import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../store/editorStore';

export function useCanvas() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const setCanvas = useEditorStore((state) => state.setCanvas);
  const setSelectedObject = useEditorStore((state) => state.setSelectedObject);

  useEffect(() => {
    if (!canvasElRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasElRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    setCanvas(fabricCanvas);

    // 선택 이벤트 구독
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected[0] ?? null);
    });
    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected[0] ?? null);
    });
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    // 속성이 바뀔 때(드래그, 색상 변경 등)도 패널을 리렌더링하기 위해
    fabricCanvas.on('object:modified', (e) => {
      setSelectedObject(e.target ?? null);
    });

    return () => {
      fabricCanvas.dispose();
    };
  }, [setCanvas, setSelectedObject]);

  return { canvasElRef };
}