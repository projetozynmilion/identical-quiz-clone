import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ScrollReveal({ children, delay = 0, className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => el.classList.add("visible");

    // Fallback: garante que o conteúdo apareça mesmo se o observer não disparar
    // (iOS Safari às vezes atrasa; melhor mostrar do que deixar em branco).
    const fallback = window.setTimeout(reveal, 900);

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
            window.clearTimeout(fallback);
            break;
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 10% 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const delayClass = delay > 0 ? ` scroll-reveal-delay-${Math.min(Math.round(delay / 0.08), 8)}` : "";

  return (
    <div ref={ref} className={`scroll-reveal${delayClass} ${className}`}>
      {children}
    </div>
  );
}
