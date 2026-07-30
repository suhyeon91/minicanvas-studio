import type { FabricObject } from 'fabric';
import { useEditorStore } from '../../store/editorStore';
import { Eye, EyeOff, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

function getLabel(obj: FabricObject, index: number) {
  const type = obj.type ?? 'object';
  return `${type} ${index + 1}`;
}

export function LayerPanel() {
  const canvas = useEditorStore((state) => state.canvas);
  const objects = useEditorStore((state) => state.objects);
  const selectedObject = useEditorStore((state) => state.selectedObject);
  const refreshObjects = useEditorStore((state) => state.refreshObjects);
  const setSelectedObject = useEditorStore((state) => state.setSelectedObject);

  const selectLayer = (obj: FabricObject) => {
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
    setSelectedObject(obj);
  };

  const bringForward = (obj: FabricObject) => {
    if (!canvas) return;
    canvas.bringObjectForward(obj);
    canvas.requestRenderAll();
    refreshObjects();
  };

  const sendBackward = (obj: FabricObject) => {
    if (!canvas) return;
    canvas.sendObjectBackwards(obj);
    canvas.requestRenderAll();
    refreshObjects();
  };

  const deleteLayer = (obj: FabricObject) => {
    if (!canvas) return;
    canvas.remove(obj);
    canvas.requestRenderAll();
  };

  const toggleVisible = (obj: FabricObject) => {
    if (!canvas) return;
    obj.visible = !obj.visible;
    canvas.requestRenderAll();
    refreshObjects();
  };

  return (
    <div className="w-64 p-4 bg-white border-r border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">레이어</h3>

      {objects.length === 0 && (
        <p className="text-sm text-gray-400">추가된 오브젝트가 없습니다</p>
      )}

      <ul className="space-y-1">
        {objects.map((obj, i) => {
          const isSelected = obj === selectedObject;
          return (
            <li
              key={i}
              onClick={() => selectLayer(obj)}
              className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer text-sm ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              <span className="truncate">{getLabel(obj, objects.length - 1 - i)}</span>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleVisible(obj); }}
                  className="text-xs px-1 hover:opacity-60"
                  title="보이기/숨기기"
                >
                  {obj.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); bringForward(obj); }}
                  className="text-xs px-1 hover:opacity-60"
                  title="앞으로"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); sendBackward(obj); }}
                  className="text-xs px-1 hover:opacity-60"
                  title="뒤로"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteLayer(obj); }}
                  className="text-xs px-1 hover:opacity-60 text-red-500"
                  title="삭제"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}