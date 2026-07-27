import { useCanvas } from '../../hooks/useCanvas';

export function Canvas() {
  const { canvasElRef } = useCanvas();

  return (
    <div className="border border-gray-300 shadow-sm bg-white">
      <canvas ref={canvasElRef} />
    </div>
  );
}