import { cn } from "@/lib/utils";

interface AiLoaderProps {
  text?: string;
  className?: string;
}

export const AiLoader = ({ text = "Generating", className }: AiLoaderProps) => {
  const letters = text.split("");
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div
        className="ai-loader-ring"
        aria-hidden="true"
      />
      <div className="flex items-center gap-[2px] font-medium tracking-wide text-white/90">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="ai-loader-letter inline-block"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Component = AiLoader;
export default AiLoader;
