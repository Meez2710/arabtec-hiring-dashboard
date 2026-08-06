import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArabtecMark } from "./ArabtecMark";

/** 1920x1080 slide that scales to fit its parent. */
export function ScaledSlide({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current?.parentElement;
    if (!el) return;
    const update = () => {
      const s = Math.min(el.clientWidth / 1920, el.clientHeight / 1080);
      setScale(s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        left: "50%",
        top: "50%",
        marginLeft: -960,
        marginTop: -540,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        background: "white",
        boxShadow: "0 30px 60px -30px rgba(0,0,0,0.15)",
      }}
    >
      <div className="slide-content relative w-full h-full overflow-hidden">{children}</div>
    </div>
  );
}

/** Standard chrome: top maroon bar, page number, footer logo. */
export function SlideChrome({
  page,
  total,
  showLogo = true,
  footNote,
}: {
  page: number;
  total: number;
  showLogo?: boolean;
  footNote?: string;
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "var(--brand)",
        }}
      />
      {showLogo && (
        <div style={{ position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)" }}>
          <ArabtecMark size={56} showWordmark />
        </div>
      )}
      <div
        className="slide-chrome"
        style={{
          position: "absolute",
          bottom: 60,
          right: 80,
          color: "var(--muted-foreground)",
        }}
      >
        {String(page).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
      {footNote && (
        <div
          className="slide-chrome"
          style={{ position: "absolute", bottom: 60, left: 80, color: "var(--muted-foreground)" }}
        >
          {footNote}
        </div>
      )}
    </>
  );
}

export function SectionTitle({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-start">
      {kicker && (
        <div className="slide-kicker mb-6 flex items-center gap-4" style={{ color: "var(--brand)" }}>
          <span style={{ width: 56, height: 3, background: "var(--brand)" }} />
          {kicker}
        </div>
      )}
      <h2 className="slide-title" style={{ color: "var(--foreground)" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="slide-subtitle mt-5" style={{ color: "var(--muted-foreground)", maxWidth: 1400 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
