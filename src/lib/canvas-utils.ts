import type { Canvas } from 'fabric';

// JSON으로 저장 (파일 다운로드)
export function exportJSON(canvas: Canvas, filename = 'minicanvas-project.json') {
  const json = canvas.toJSON();
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
}

// PNG로 export (파일 다운로드)
export function exportPNG(canvas: Canvas, filename = 'minicanvas-export.png') {
  const dataUrl = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 2, // 고해상도로 export (레티나 디스플레이 대응)
  });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

// JSON 파일을 읽어서 캔버스에 로드
export function importJSON(canvas: Canvas, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        await canvas.loadFromJSON(json);
        canvas.requestRenderAll();
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}