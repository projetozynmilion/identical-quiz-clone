import { Volume2 } from "lucide-react";

interface Props {
  onActivate: () => void;
  label?: string;
  sublabel?: string;
}

export default function SoundActivationOverlay({
  onActivate,
  label = "Clique aqui",
  sublabel = "para ativar o som",
}: Props) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
      }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-[3px] cursor-pointer"
      style={{ animation: "fadeIn 0.35s ease" }}
    >
      <div className="relative flex flex-col items-center">
        {/* Outer pulsing ring */}
        <div
          className="absolute inset-0 -m-5 rounded-3xl border-2 border-[#ff8a3d]/40 sound-ring-pulse"
          aria-hidden="true"
        />

        {/* Main card */}
        <div
          className="relative flex flex-col items-center gap-4 px-8 py-6 rounded-2xl border border-[#ff8a3d]/60 sound-card-pulse"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,90,31,0.92) 0%, rgba(217,67,15,0.95) 100%)",
            boxShadow:
              "0 20px 50px rgba(255,90,31,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          {/* Glossy top highlight */}
          <div
            className="pointer-events-none absolute inset-x-2 top-1 h-1/2 rounded-t-xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 60%)",
            }}
          />

          <span className="relative z-10 text-white font-bold text-base tracking-wide drop-shadow-md">
            {label}
          </span>

          <div
            className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center bg-white/15 border border-white/30 backdrop-blur-sm sound-icon-bounce"
            style={{
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.25), inset 0 2px 6px rgba(255,255,255,0.2)",
            }}
          >
            <Volume2 size={36} className="text-white" strokeWidth={2.5} />
          </div>

          <span className="relative z-10 text-white font-bold text-base tracking-wide drop-shadow-md">
            {sublabel}
          </span>
        </div>
      </div>
    </button>
  );
}
