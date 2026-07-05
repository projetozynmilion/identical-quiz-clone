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
      className="absolute inset-0 z-30 flex flex-col items-center justify-center cursor-pointer bg-black/40 backdrop-blur-[2px] rounded-xl"
      style={{ animation: "fadeIn 0.35s ease" }}
    >
      <span className="text-white/90 text-lg sm:text-xl font-semibold mb-6 sm:mb-8">
        Sua aula já começou
      </span>

      <VolumeX
        size={56}
        className="text-white/90 mb-6 sm:mb-8"
        strokeWidth={1.5}
      />

      <span className="text-white/90 text-lg sm:text-xl font-semibold">
        Clique para ouvir
      </span>
    </button>
  );
}
