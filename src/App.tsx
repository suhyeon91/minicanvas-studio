import { Canvas } from './components/Canvas/Canvas';
import { Toolbar } from './components/Toolbar/Toolbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Toolbar />
      <div className="mt-6">
        <Canvas />
      </div>
    </div>
  );
}

export default App;