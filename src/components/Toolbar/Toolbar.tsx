import * as fabric from 'fabric';
import { useEditorStore } from '../../store/editorStore';

export function Toolbar() {
  const canvas = useEditorStore((state) => state.canvas);

  const addRectangle = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 120,
      height: 80,
      fill: '#6366f1',
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      radius: 50,
      fill: '#ec4899',
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('텍스트 입력', {
      left: 200,
      top: 200,
      fontSize: 24,
      fill: '#111827',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  return (
    <div className="flex gap-2 p-3 bg-white border-b border-gray-200">
      <button
        onClick={addRectangle}
        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 text-sm font-medium"
      >
        사각형
      </button>
      <button
        onClick={addCircle}
        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm font-medium"
      >
        원
      </button>
      <button
        onClick={addText}
        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 text-sm font-medium"
      >
        텍스트
      </button>
    </div>
  );
}