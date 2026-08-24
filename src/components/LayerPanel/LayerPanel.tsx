import { useState } from 'react';
import type { FabricObject, Group } from 'fabric';
import { useEditorStore } from '../../store/editorStore';
import { Eye, EyeOff, ArrowUp, ArrowDown, Trash2, ChevronRight, ChevronDown } from 'lucide-react';

const TYPE_LABEL: Record<string, string> = {
  rect: '사각형',
  circle: '원',
  'i-text': '텍스트',
  line: '라인',
  polygon: '다각형',
  group: '그룹',
};

function getLabel(obj: FabricObject, order: number) {
  const type = obj.type ?? 'object';
  const label = TYPE_LABEL[type] ?? type;
  return `${label} ${order + 1}`;
}

function getSwatchColor(obj: FabricObject) {
  return String(obj.fill ?? obj.stroke ?? '#e5e7eb');
}

export function LayerPanel() {
  const canvas = useEditorStore((state) => state.canvas);
  const objects = useEditorStore((state) => state.objects);
  const selectedObject = useEditorStore((state) => state.selectedObject);
  const refreshObjects = useEditorStore((state) => state.refreshObjects);
  const setSelectedObject = useEditorStore((state) => state.setSelectedObject);
  const [expandedGroups, setExpandedGroups] = useState<Set<FabricObject>>(new Set());

  const toggleExpand = (obj: FabricObject) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(obj)) {
        next.delete(obj);
      } else {
        next.add(obj);
      }
      return next;
    });
  };

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
    <div className="w-64 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">레이어</h3>

      {objects.length === 0 && (
        <p className="text-sm text-gray-400">추가된 오브젝트가 없습니다</p>
      )}

      <ul className="space-y-1">
        {objects.map((obj, i) => {
          const isSelected = obj === selectedObject;
          const isGroup = obj.type === 'group';
          const isExpanded = expandedGroups.has(obj);
          const children = isGroup ? (obj as Group).getObjects() : [];

          return (
            <li key={i}>
              <div
                onClick={() => selectLayer(obj)}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-sm ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <div className="flex items-center gap-1 min-w-0">
                  {isGroup ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleExpand(obj); }}
                      className="p-0.5 hover:opacity-60 shrink-0"
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  ) : (
                    <span className="w-[18px] shrink-0" />
                  )}
                  <span
                    className="w-3 h-3 rounded-full border border-gray-200 shrink-0"
                    style={{ backgroundColor: getSwatchColor(obj) }}
                  />
                  <span className="truncate">{getLabel(obj, objects.length - 1 - i)}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleVisible(obj); }}
                    className="p-1 hover:opacity-60"
                    title="보이기/숨기기"
                  >
                    {obj.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); bringForward(obj); }}
                    className="p-1 hover:opacity-60"
                    title="앞으로"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); sendBackward(obj); }}
                    className="p-1 hover:opacity-60"
                    title="뒤로"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteLayer(obj); }}
                    className="p-1 hover:opacity-60 text-red-500"
                    title="삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* 그룹 자식 - 읽기 전용 */}
              {isGroup && isExpanded && (
                <ul className="ml-6 mt-1 space-y-1 border-l border-gray-100 pl-2">
                  {children.map((child, ci) => (
                    <li
                      key={ci}
                      className="flex items-center gap-2 px-2 py-1 text-xs text-gray-400"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-gray-200 shrink-0"
                        style={{ backgroundColor: getSwatchColor(child) }}
                      />
                      <span className="truncate">
                        {TYPE_LABEL[child.type ?? ''] ?? child.type} {ci + 1}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}