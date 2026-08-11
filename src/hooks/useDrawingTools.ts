import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../store/editorStore';

export function useDrawingTools() {
  const isDrawingLine = useRef(false);
  const currentLine = useRef<fabric.Line | null>(null);

  const polygonPoints = useRef<{ x: number; y: number }[]>([]);
  const polygonPreview = useRef<fabric.Polyline | null>(null);

  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe((state, prevState) => {
      if (state.canvas && state.canvas !== prevState.canvas) {
        attachHandlers(state.canvas);
      }
    });

    // 이미 canvas가 있으면 즉시 붙이기
    const canvas = useEditorStore.getState().canvas;
    if (canvas) attachHandlers(canvas);

    function attachHandlers(canvas: fabric.Canvas) {
      canvas.on('mouse:down', (opt) => {
        const mode = useEditorStore.getState().mode;
        const pointer = canvas.getScenePoint(opt.e);

        if (mode === 'line') {
          isDrawingLine.current = true;
          const line = new fabric.Line(
            [pointer.x, pointer.y, pointer.x, pointer.y],
            { stroke: '#111827', strokeWidth: 3, selectable: false }
          );
          currentLine.current = line;
          canvas.add(line);
        }

        if (mode === 'polygon') {
          polygonPoints.current.push({ x: pointer.x, y: pointer.y });

          if (polygonPreview.current) {
            canvas.remove(polygonPreview.current);
          }
          const preview = new fabric.Polyline(polygonPoints.current, {
            fill: 'transparent',
            stroke: '#111827',
            strokeWidth: 2,
            selectable: false,
            evented: false,
          });
          polygonPreview.current = preview;
          canvas.add(preview);
          canvas.requestRenderAll();
        }
      });

      canvas.on('mouse:move', (opt) => {
        const mode = useEditorStore.getState().mode;
        const pointer = canvas.getScenePoint(opt.e);

        if (mode === 'line' && isDrawingLine.current && currentLine.current) {
          currentLine.current.set({ x2: pointer.x, y2: pointer.y });
          canvas.requestRenderAll();
        }

        if (mode === 'polygon' && polygonPoints.current.length > 0 && polygonPreview.current) {
          const previewPoints = [...polygonPoints.current, { x: pointer.x, y: pointer.y }];
          polygonPreview.current.set({ points: previewPoints });
          canvas.requestRenderAll();
        }
      });

      canvas.on('mouse:up', () => {
        const mode = useEditorStore.getState().mode;
        if (mode === 'line' && isDrawingLine.current) {
          isDrawingLine.current = false;
          currentLine.current?.set({ selectable: true });
          currentLine.current = null;
          useEditorStore.getState().refreshObjects();
          useEditorStore.getState().pushHistory();
          useEditorStore.getState().setMode('select');
        }
      });

      canvas.on('mouse:dblclick', () => {
        const mode = useEditorStore.getState().mode;
        if (mode === 'polygon' && polygonPoints.current.length >= 3) {
          if (polygonPreview.current) {
            canvas.remove(polygonPreview.current);
            polygonPreview.current = null;
          }
          const polygon = new fabric.Polygon(polygonPoints.current, {
            fill: '#a5b4fc',
            stroke: '#111827',
            strokeWidth: 2,
          });
          canvas.add(polygon);
          canvas.requestRenderAll();

          polygonPoints.current = [];
          useEditorStore.getState().refreshObjects();
          useEditorStore.getState().pushHistory();
          useEditorStore.getState().setMode('select');
        }
      });
    }

    return () => {
      unsubscribe();
    };
  }, []);
}