import { Canvas } from './components/Canvas/Canvas';
import { Toolbar } from './components/Toolbar/Toolbar';
import { PropertyPanel } from './components/PropertyPanel/PropertyPanel';
import { LayerPanel } from './components/LayerPanel/LayerPanel';
import { useEffect } from 'react';
import { useEditorStore } from './store/editorStore';
import { useDrawingTools } from './hooks/useDrawingTools';

function App() {
  useDrawingTools(); 
  
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (isCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (isCtrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toolbar />
      <div className="flex flex-1 justify-center items-start gap-6 p-6">
        <LayerPanel />
        <Canvas />
        <PropertyPanel />
      </div>
    </div>
  );
}

export default App;