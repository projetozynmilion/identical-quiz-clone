import { Sun, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CinematicThemeSwitcherProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Cinematic pill-shaped theme switcher with bouncy thumb + particle burst.
 * Self-contained: no framer-motion / next-themes dependency.
 */
export default function CinematicThemeSwitcher({
  isDark,
  onToggle,
  className,
}: CinematicThemeSwitcherProps) {
  const [burst, setBurst] = useState(0);

  const handle = () => {
    setBurst((n) => n + 1);
    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-pressed={isDark}
      className={cn(
        "cts-switch group relative inline-flex h-9 w-[68px] shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isDark ? "cts-switch--dark" : "cts-switch--light",
        className,
      )}
    >
      {/* Inner groove */}
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.08), transparent 60%)"
            : "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.9), transparent 60%)",
        }}
      />

      {/* Background icons */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2.5">
        <Sun
          className={cn(
            "h-3.5 w-3.5 transition-opacity duration-500",
            isDark ? "opacity-30" : "opacity-0",
          )}
          style={{ color: "#66d1ff" }}
        />
        <Moon
          className={cn(
            "h-3.5 w-3.5 transition-opacity duration-500",
            isDark ? "opacity-0" : "opacity-40",
          )}
          style={{ color: "#1f2937" }}
        />
      </span>

      {/* Thumb */}
      <span
        className={cn(
          "relative z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isDark ? "translate-x-[32px]" : "translate-x-0",
        )}
        style={{
          background: isDark
            ? "linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 100%)"
            : "linear-gradient(160deg, #ffffff 0%, #e6e6e8 100%)",
          boxShadow: isDark
            ? "0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)"
            : "0 4px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* Glossy reflex */}
        <span
          className="pointer-events-none absolute inset-0.5 rounded-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 50%)",
          }}
        />
        {/* Icon */}
        {isDark ? (
          <Moon className="relative h-3.5 w-3.5" style={{ color: "#66d1ff" }} strokeWidth={2.2} />
        ) : (
          <Sun className="relative h-3.5 w-3.5" style={{ color: "#1a7aff" }} strokeWidth={2.2} />
        )}

        {/* Particle burst */}
        {burst > 0 && (
          <span key={burst} aria-hidden="true" className="pointer-events-none absolute inset-0">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute inset-0 rounded-full cts-burst"
                style={{
                  animationDelay: `${i * 90}ms`,
                  borderColor: isDark ? "rgba(255,209,102,0.55)" : "rgba(26, 122, 255,0.55)",
                }}
              />
            ))}
          </span>
        )}
      </span>
    </button>
  );
}
