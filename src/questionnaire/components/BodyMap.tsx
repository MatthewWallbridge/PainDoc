import { useEffect, useRef, useState } from 'react';

const WIDTH = 640;
const HEIGHT = 380;
const PANEL_W = WIDTH / 2;

const PENS = [
  { label: 'Aching / dull',   symbol: '✕✕✕', color: '#0891B2' },
  { label: 'Pins & needles',  symbol: '• • •', color: '#7C3AED' },
  { label: 'Burning',         symbol: '/ / /', color: '#EA580C' },
  { label: 'Shooting',        symbol: '→→',    color: '#DC2626' },
  { label: 'Other',           symbol: '∿',     color: '#6B7280' },
];

function drawFigure(ctx: CanvasRenderingContext2D, cx: number, isBack: boolean) {
  ctx.save();
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'transparent';

  // patient's left/right labels (mirrored between front and back views)
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(isBack ? 'L' : 'R', cx - 56, 100);
  ctx.fillText(isBack ? 'R' : 'L', cx + 50, 100);
  ctx.fillStyle = 'transparent';

  // spine reference line (back view only)
  if (isBack) {
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#A5F3FC';
    ctx.beginPath();
    ctx.moveTo(cx, 78);
    ctx.lineTo(cx, 215);
    ctx.stroke();
    ctx.restore();
  }

  // head
  ctx.beginPath();
  ctx.arc(cx, 46, 22, 0, Math.PI * 2);
  ctx.stroke();

  // neck + torso
  ctx.beginPath();
  ctx.moveTo(cx - 10, 66);
  ctx.lineTo(cx - 10, 78);
  ctx.lineTo(cx - 44, 100);
  ctx.lineTo(cx - 40, 210);
  ctx.lineTo(cx - 26, 218);
  ctx.lineTo(cx - 30, 260);
  ctx.lineTo(cx - 14, 260);
  ctx.lineTo(cx - 8, 220);
  ctx.lineTo(cx + 8, 220);
  ctx.lineTo(cx + 14, 260);
  ctx.lineTo(cx + 30, 260);
  ctx.lineTo(cx + 26, 218);
  ctx.lineTo(cx + 40, 210);
  ctx.lineTo(cx + 44, 100);
  ctx.lineTo(cx + 10, 78);
  ctx.lineTo(cx + 10, 66);
  ctx.closePath();
  ctx.stroke();

  // legs
  ctx.beginPath();
  ctx.moveTo(cx - 26, 260);
  ctx.lineTo(cx - 22, 355);
  ctx.lineTo(cx - 8, 355);
  ctx.lineTo(cx - 10, 262);
  ctx.moveTo(cx + 26, 260);
  ctx.lineTo(cx + 22, 355);
  ctx.lineTo(cx + 8, 355);
  ctx.lineTo(cx + 10, 262);
  ctx.stroke();

  // arms
  ctx.beginPath();
  ctx.moveTo(cx - 44, 100);
  ctx.lineTo(cx - 62, 195);
  ctx.lineTo(cx - 52, 200);
  ctx.lineTo(cx - 36, 115);
  ctx.moveTo(cx + 44, 100);
  ctx.lineTo(cx + 62, 195);
  ctx.lineTo(cx + 52, 200);
  ctx.lineTo(cx + 36, 115);
  ctx.stroke();

  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawFigure(ctx, PANEL_W / 2, false);
  drawFigure(ctx, PANEL_W + PANEL_W / 2, true);

  ctx.save();
  ctx.strokeStyle = '#CCFBF1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PANEL_W, 0);
  ctx.lineTo(PANEL_W, HEIGHT);
  ctx.stroke();
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('FRONT', PANEL_W / 2 - 16, 20);
  ctx.fillText('BACK', PANEL_W + PANEL_W / 2 - 14, 20);
  ctx.restore();
}

export default function BodyMap({ value, onChange }: { value: string | null; onChange: (dataUrl: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [pen, setPen] = useState(PENS[0].color);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
      img.src = value;
    } else {
      drawBackground(ctx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pointFromEvent(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * HEIGHT,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = pointFromEvent(e);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !lastPointRef.current) return;
    const point = pointFromEvent(e);
    ctx.strokeStyle = pen;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function handlePointerUp() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL('image/png'));
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    drawBackground(ctx);
    onChange(null);
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full touch-none rounded-xl border-2 border-[#CCFBF1] bg-white"
        style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
      />
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {PENS.map(p => (
          <button
            key={p.color}
            type="button"
            onClick={() => setPen(p.color)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 text-xs font-semibold transition ${pen === p.color ? 'border-[#0891B2] bg-[#ECFEFF]' : 'border-[#CCFBF1] bg-white hover:border-[#A5F3FC]'}`}
          >
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            <span className="font-mono text-[10px] text-[#94A3B8]" aria-hidden>{p.symbol}</span>
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleClear}
          className="ml-auto text-xs font-semibold text-[#94A3B8] hover:text-red-500 transition px-2.5 py-1.5"
        >
          Clear drawing
        </button>
      </div>
    </div>
  );
}
