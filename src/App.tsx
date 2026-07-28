import { Canvas } from './components/Canvas/Canvas';
import { Toolbar } from './components/Toolbar/Toolbar';
import { PropertyPanel } from './components/PropertyPanel/PropertyPanel';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toolbar />
      <div className="flex flex-1 justify-center items-start gap-6 p-6">
        <Canvas />
        <PropertyPanel />
      </div>
    </div>
  );
}

export default App;