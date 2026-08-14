import * as fabric from 'fabric';
import { useEditorStore } from '../../store/editorStore';
import { useRef } from 'react';
import { exportJSON, exportPNG, importJSON } from '../../lib/canvas-utils';
import { Square, Circle, Type, Minus, Pentagon, Undo2, Redo2, Save, FolderOpen, Download } from 'lucide-react';
 
function ToolButton({
  active, onClick, title, children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2.5 rounded-lg transition-colors ${active
          ? 'bg-indigo-500 text-white'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
        }`}
    >
      {children}
    </button>
  );
}

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
    <div className="flex items-center gap-1 px-4 py-2.5 bg-white border-b border-gray-200">
      {/* 도형/텍스트/드로잉 도구 */}
      <ToolButton onClick={addRectangle} title="사각형">
        <Square size={18} />
      </ToolButton>
      <ToolButton onClick={addCircle} title="원">
        <Circle size={18} />
      </ToolButton>
      <ToolButton onClick={addText} title="텍스트">
        <Type size={18} />
      </ToolButton>
      <ToolButton
        active={mode === 'line'}
        onClick={() => setMode(mode === 'line' ? 'select' : 'line')}
        title="라인 도구"
      >
        <Minus size={18} />
      </ToolButton>
      <ToolButton
        active={mode === 'polygon'}
        onClick={() => setMode(mode === 'polygon' ? 'select' : 'polygon')}
        title="다각형 도구 (더블클릭으로 완성)"
      >
        <Pentagon size={18} />
      </ToolButton>

      <div className="w-px h-6 bg-gray-200 mx-2" />

      {/* Undo/Redo */}
      <ToolButton onClick={undo} title="실행 취소">
        <Undo2 size={18} />
      </ToolButton>
      <ToolButton onClick={redo} title="다시 실행">
        <Redo2 size={18} />
      </ToolButton>

      <div className="w-px h-6 bg-gray-200 mx-2" />

      {/* 파일 입출력 */}
      <ToolButton onClick={handleSave} title="JSON으로 저장">
        <Save size={18} />
      </ToolButton>
      <ToolButton onClick={handleLoadClick} title="JSON 불러오기">
        <FolderOpen size={18} />
      </ToolButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex-1" />

      {/* PNG 내보내기만 강조 */}
      <button
        onClick={handleExportPNG}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
      >
        <Download size={16} />
        내보내기
      </button>
    </div>
  );
}