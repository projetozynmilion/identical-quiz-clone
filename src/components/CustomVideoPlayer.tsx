import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import SoundActivationOverlay from "./SoundActivationOverlay";

interface Props {
  src: string;
  className?: string;
}

const CustomVideoPlayer = ({ src, className }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);

  // Only mount the <video> element when near viewport — prevents 20+ videos
  // from loading concurrently and killing mobile bandwidth/CPU.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { rootMargin: "400px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !inView) return;
    v.muted = true;
    v.play().catch(() => {});
    const onTime = () => {
      if (v.duration > 0) {
        const real = (v.currentTime / v.duration) * 100;
        const fake =
          real < 30 ? real * 2.3 : real < 60 ? 69 + (real - 30) * 0.7 : 90 + (real - 60) * 0.25;
        setProgress(Math.min(fake, 100));
      }
    };
    const onPause = () => setPaused(true);
    const onPlay = () => setPaused(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("pause", onPause);
    v.addEventListener("play", onPlay);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("play", onPlay);
    };
  }, [src, inView]);

  const handleUnmute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    setMuted(false);
  };

  const handleResume = () => {
    videoRef.current?.play().catch(() => {});
    setPaused(false);
  };

  const handleClickArea = (e: React.MouseEvent) => {
    e.preventDefault();
    const v = videoRef.current;
    if (!v) return;
    if (muted) {
      handleUnmute();
      return;
    }
    if (v.paused) v.play().catch(() => {});
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl overflow-hidden bg-secondary border border-border/30 shadow-lg shadow-primary/5 ${className ?? ""}`}
    >
      {inView ? (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-auto block"
          playsInline
          loop
          muted
          preload="metadata"
        />
      ) : (
        <div className="w-full aspect-[9/16] bg-black" />
      )}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={handleClickArea}
        onContextMenu={(e) => e.preventDefault()}
      />

      {muted && inView && (
        <SoundActivationOverlay onActivate={handleUnmute} />
      )}

      {paused && !muted && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleResume();
          }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/30"
        >
          <div
            className="w-[90px] h-[90px] rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105"
            style={{ background: "#4564FFE0" }}
          >
            <Play size={36} className="text-white ml-1" fill="white" />
          </div>
        </button>
      )}

      <div
        className="absolute bottom-0 left-0 h-1.5 bg-white z-20 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default CustomVideoPlayer;
