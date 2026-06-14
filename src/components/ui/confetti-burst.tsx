import { useEffect, useState } from "react";

const COLORS = [
  "#ff7a00", "#ffd84d", "#34d399", "#22d3ee",
  "#a78bfa", "#f472b6", "#f87171", "#d6ff3a",
];

interface Piece {
  id: number;
  dx: number;
  dy: number;
  dz: number;
  delay: number;
  duration: number;
  spin: number;
  color: string;
  size: number;
}

interface ConfettiBurstProps {
  trigger: number; // change value to re-fire
  count?: number;
  duration?: number; // ms before auto-clearing pieces
}

export const ConfettiBurst = ({ trigger, count = 80, duration = 3500 }: ConfettiBurstProps) => {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const next: Piece[] = Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 180 + Math.random() * 520;
      return {
        id: trigger * 1000 + i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        dz: (Math.random() - 0.5) * 700,
        delay: Math.random() * 0.15,
        duration: 1.2 + Math.random() * 1.2,
        spin: 0.4 + Math.random() * 0.8,
        color: COLORS[i % COLORS.length],
        size: 0.6 + Math.random() * 0.9,
      };
    });
    setPieces(next);
    const t = setTimeout(() => setPieces([]), duration);
    return () => clearTimeout(t);
  }, [trigger, count, duration]);

  if (!pieces.length) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
      style={{ perspective: "1000px" }}
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece-wrap"
          style={{
            ["--dx" as string]: p.dx,
            ["--dy" as string]: p.dy,
            ["--dz" as string]: p.dz,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <div
            className="confetti-piece-spin"
            style={{
              animationDuration: `${p.spin}s`,
              transform: `scale(${p.size})`,
            }}
          >
            <div className="confetti-side confetti-front" style={{ background: p.color }} />
            <div className="confetti-side confetti-back" style={{ background: p.color }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConfettiBurst;
