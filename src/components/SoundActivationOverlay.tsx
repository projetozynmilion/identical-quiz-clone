import { VolumeX } from "lucide-react";

interface Props {
  onActivate: () => void;
}

export default function SoundActivationOverlay({
  onActivate,
}: Props) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
      }}
      className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-pointer bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-sm transition-all hover:scale-105"
      style={{ animation: "fadeIn 0.35s ease" }}
      title="Toque para ativar o som"
    >
      <VolumeX size={14} className="text-white/90" strokeWidth={2} />
      <span className="text-[11px] font-medium text-white/90 leading-none">
        Toque para o som
      </span>
    </button>
  );
}
