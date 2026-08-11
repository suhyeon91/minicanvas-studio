import * as fabric from 'fabric';
import { useEditorStore } from '../../store/editorStore';
import { useRef } from 'react';
import { Save, FolderOpen, Download, Undo2, Redo2 } from 'lucide-react';
import { exportJSON, exportPNG, importJSON } from '../../lib/canvas-utils';
import { Minus, Pentagon } from 'lucide-react';
 
export function Toolbar() {
  const canvas = useEditorStore((state) => state.canvas);

  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pushHistory = useEditorStore((state) => state.pushHistory);
  const refreshObjects = useEditorStore((state) => state.refreshObjects);
  const mode = useEditorStore((state) => state.mode);
  const setMode = useEditorStore((state) => state.setMode);
  
  const handleSave = () => {
    if (!canvas) return;
    exportJSON(canvas);
  };

  const handleExportPNG = () => {
    if (!canvas) return;
    exportPNG(canvas);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    try {
      await importJSON(canvas, file);
      refreshObjects();
      pushHistory();
    } catch (err) {
      alert('파일을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    }

    e.target.value = ''; // 같은 파일 다시 선택 가능하도록 초기화
  };

  const addRectangle = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 120,
      height: 80,
      fill: '#6366f1',
    });
    rect.set('id', crypto.randomUUID()); // 고유 id 부여
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
    circle.set('id', crypto.randomUUID()); // 고유 id 부여
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
    text.set('id', crypto.randomUUID()); // 고유 id 부여
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
      <button
        onClick={() => setMode(mode === 'line' ? 'select' : 'line')}
        className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        title="라인 도구"
      >
        <Minus size={18} />
      </button>
      <button
        onClick={() => setMode(mode === 'polygon' ? 'select' : 'polygon')}
        className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'polygon' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        title="다각형 도구 (더블클릭으로 완성)"
      >
        <Pentagon size={18} />
      </button>
      <button
        onClick={undo}
        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        title="실행 취소"
      >
        <Undo2 size={18} />
      </button>
      <button
        onClick={redo}
        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        title="다시 실행"
      >
        <Redo2 size={18} />
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1" /> {/* 구분선 */}

      <button
        onClick={handleSave}
        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        title="JSON으로 저장"
      >
        <Save size={18} />
      </button>

      <button
        onClick={handleLoadClick}
        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        title="JSON 불러오기"
      >
        <FolderOpen size={18} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleExportPNG}
        className="px-3 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
        title="PNG로 내보내기"
      >
        <Download size={18} />
      </button>
    </div>
  );
}