import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../store/editorStore';

export function useCanvas() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const setCanvas = useEditorStore((state) => state.setCanvas);

  useEffect(() => {
    if (!canvasElRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasElRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [setCanvas]);

  return { canvasElRef };
}