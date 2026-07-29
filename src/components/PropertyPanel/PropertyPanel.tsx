import { useEditorStore } from '../../store/editorStore';

export function PropertyPanel() {
  const canvas = useEditorStore((state) => state.canvas);
  const selectedObject = useEditorStore((state) => state.selectedObject);
  const pushHistory = useEditorStore((state) => state.pushHistory);

  if (!selectedObject) {
    return (
      <div className="w-64 p-4 bg-white border-l border-gray-200 text-sm text-gray-400">
        오브젝트를 선택하세요
      </div>
    );
  }

  const updateProp = (key: string, value: string | number) => {
    selectedObject.set(key, value);
    canvas?.requestRenderAll();
    pushHistory();
  };

  return (
    <div className="w-64 p-4 bg-white border-l border-gray-200 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">속성</h3>

      <div>
        <label className="block text-xs text-gray-500 mb-1">채우기 색상</label>
        <input
          type="color"
          defaultValue={String(selectedObject.fill ?? '#000000')}
          onChange={(e) => updateProp('fill', e.target.value)}
          className="w-full h-9 rounded border border-gray-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">X</label>
          <input
            type="number"
            defaultValue={Math.round(selectedObject.left ?? 0)}
            onChange={(e) => updateProp('left', Number(e.target.value))}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Y</label>
          <input
            type="number"
            defaultValue={Math.round(selectedObject.top ?? 0)}
            onChange={(e) => updateProp('top', Number(e.target.value))}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">회전 (도)</label>
        <input
          type="number"
          defaultValue={Math.round(selectedObject.angle ?? 0)}
          onChange={(e) => updateProp('angle', Number(e.target.value))}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">투명도</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          defaultValue={selectedObject.opacity ?? 1}
          onChange={(e) => updateProp('opacity', Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}