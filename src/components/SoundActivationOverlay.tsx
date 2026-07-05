import { Play } from "lucide-react";
import thumbnail from "@/assets/vsl-thumbnail.png.asset.json";

interface Props {
  onActivate: () => void;
}

export default function SoundActivationOverlay({ onActivate }: Props) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
      }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-xl"
      style={{ animation: "fadeIn 0.35s ease" }}
    >
      <img
        src={thumbnail.url}
        alt="VSL Prompts Virais"
        className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex flex-col items-center">
        <div
          className="w-[88px] h-[88px] rounded-full flex items-center justify-center shadow-2xl mb-5 transition-transform hover:scale-110"
          style={{
            background: "#4564FF",
            boxShadow: "0 0 40px rgba(69, 100, 255, 0.6)",
          }}
        >
          <Play size={38} className="text-white ml-1" fill="white" />
        </div>
        <span className="text-white text-lg sm:text-xl font-semibold drop-shadow-lg">
          Clique para assistir
        </span>
      </div>
    </button>
  );
}
