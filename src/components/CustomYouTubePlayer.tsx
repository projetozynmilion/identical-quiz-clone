import { useEffect, useRef, useState } from "react";
import { Play, SkipForward } from "lucide-react";
import SoundActivationOverlay from "./SoundActivationOverlay";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

let apiLoadingPromise: Promise<void> | null = null;

const loadYouTubeAPI = (): Promise<void> => {
  if (apiLoadingPromise) return apiLoadingPromise;
  apiLoadingPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
  });
  return apiLoadingPromise;
};

interface Props {
  videoId: string;
  title?: string;
  className?: string;
  onNext?: () => void;
}

const CustomYouTubePlayer = ({ videoId, title, className, onNext }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current) return;
      const playerDiv = document.createElement("div");
      containerRef.current.appendChild(playerDiv);
      playerRef.current = new window.YT.Player(playerDiv, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          mute: 1,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          enablejsapi: 1,
          fs: 0,
          playsinline: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e: any) => {
            // Autoplay muted briefly so YouTube buffers the first seconds,
            // then pause + seek back to 0. When the user clicks, unmute+play
            // starts instantly from the beginning (already buffered).
            e.target.playVideo();
            const pauseAtStart = window.setTimeout(() => {
              try {
                e.target.pauseVideo();
                e.target.seekTo(0, true);
              } catch {}
            }, 1500);
            intervalRef.current = window.setInterval(() => {
              const p = playerRef.current;
              if (p && p.getDuration) {
                const d = p.getDuration();
                const c = p.getCurrentTime();
                if (d > 0) {
                  const real = (c / d) * 100;
                  const fake =
                    real < 30
                      ? real * 2.3
                      : real < 60
                      ? 69 + (real - 30) * 0.7
                      : 90 + (real - 60) * 0.25;
                  setProgress(Math.min(fake, 100));
                }
              }
            }, 500);
            // Clean up the prebuffer timer if the player is destroyed early
            (playerRef.current as any).__pauseAtStart = pauseAtStart;
          },
          onStateChange: (e: any) => {
            setPaused(e.data === window.YT.PlayerState.PAUSED);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, [videoId]);

  const handleUnmute = () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      const t = (p as any).__pauseAtStart;
      if (t) window.clearTimeout(t);
    } catch {}
    p.unMute();
    p.setVolume?.(100);
    p.seekTo(0, true);
    p.playVideo();
    setMuted(false);
  };

  const handleResume = () => {
    playerRef.current?.playVideo();
    setPaused(false);
  };

  const handleClickArea = (e: React.MouseEvent) => {
    e.preventDefault();
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      handleUnmute();
      return;
    }
    // Após ativar o som, cliques não pausam — vídeo roda até o final
    if (p.getPlayerState && p.getPlayerState() !== window.YT.PlayerState.PLAYING) {
      p.playVideo();
    }
  };

  const shellClassName = className
    ? `relative overflow-hidden ${className}`
    : "relative w-full aspect-video rounded-xl overflow-hidden bg-secondary border border-border/30 shadow-lg shadow-primary/5";

  return (
    <div className={shellClassName}>
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:inset-0"
      />
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={handleClickArea}
        onContextMenu={(e) => e.preventDefault()}
        aria-label={title || "Player"}
      />
      <div className="absolute top-0 right-0 w-16 h-16 z-20 pointer-events-none bg-transparent" />

      {muted && (
        <SoundActivationOverlay onActivate={handleUnmute} />
      )}

      {paused && !muted && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleResume();
          }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/30"
          style={{ animation: "fadeIn 0.3s ease" }}
        >
          <div
            className="w-[90px] h-[90px] rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105"
            style={{ background: "#4564FFE0" }}
          >
            <Play size={36} className="text-white ml-1" fill="white" />
          </div>
        </button>
      )}

      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white text-[12px] font-bold backdrop-blur-md transition-all hover:scale-105"
          title="Próxima aula"
        >
          <span>Próxima aula</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      )}

      <div
        className="absolute bottom-0 left-0 h-1.5 bg-white z-20 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default CustomYouTubePlayer;
