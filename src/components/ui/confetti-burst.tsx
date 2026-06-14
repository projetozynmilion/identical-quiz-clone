import { useEffect, useState } from "react";

const COLORS = [
  "#ff7a00", "#ffd84d", "#34d399", "#22d3ee",
  "#a78bfa", "#f472b6", "#f87171", "#d6ff3a",
];

interface Piece {
  id: number;
  left: number;
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
    const next: Piece[] = Array.from({ length: count }, (_, i) => ({
      id: trigger * 1000 + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 2.4 + Math.random() * 1.6,
      spin: 0.6 + Math.random() * 1.4,
      color: COLORS[i % COLORS.length],
      size: 0.7 + Math.random() * 0.8,
    }));
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
            left: `${p.left}%`,
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
