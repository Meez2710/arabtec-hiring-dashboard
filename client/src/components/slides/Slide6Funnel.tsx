import { ChevronRight } from "lucide-react";
import { SlideChrome, SectionTitle } from "../SlideShell";

const STAGES = [
  { value: "355", label: "Interviews Conducted", tone: "default" as const },
  { value: "94", label: "Accepted / Proceeded", tone: "brand" as const },
  { value: "47", label: "On Hold", tone: "hold" as const },
  { value: "88", label: "Rejected", tone: "default" as const },
  { value: "126", label: "Declined / No Show", tone: "default" as const },
];

export function Slide6Funnel({ page, total }: { page: number; total: number }) {
  return (
    <>
      <SlideChrome page={page} total={total} />
      <div className="w-full h-full pt-32 pb-40 px-32 flex flex-col">
        <div className="text-center">
          <div className="slide-kicker mb-4" style={{ color: "var(--brand)" }}>
            The Funnel
          </div>
          <h2 className="slide-title" style={{ color: "var(--foreground)" }}>
            July Interview Funnel
          </h2>
          <p className="slide-subtitle mt-4" style={{ color: "var(--muted-foreground)" }}>
            355 total candidates — from interview to final outcome in five stages.
          </p>
          <div className="mt-4 mx-auto" style={{ width: 80, height: 3, background: "var(--brand)" }} />
        </div>

        <div className="mt-16 flex items-stretch justify-center gap-3 flex-1">
          {STAGES.map((s, i) => {
            const isBrand = s.tone === "brand";
            const isHold = s.tone === "hold";
            const bg = isBrand ? "var(--brand-ink)" : isHold ? "var(--brand-soft)" : "var(--surface)";
            const valueColor = isBrand ? "white" : "var(--foreground)";
            const labelColor = isBrand ? "rgba(255,255,255,0.9)" : "var(--muted-foreground)";
            return (
              <div key={s.label} className="flex items-center">
                <div
                  className="rounded-2xl p-10 flex flex-col justify-between"
                  style={{
                    width: 240,
                    height: 300,
                    background: bg,
                    border: isBrand ? "none" : "1px solid var(--border)",
                    boxShadow: isBrand ? "0 20px 40px -20px oklch(0.42 0.14 20 / 0.5)" : "none",
                  }}
                >
                  <span style={{ width: 40, height: 3, background: isBrand ? "white" : "var(--brand)" }} />
                  <div>
                    <div style={{ fontSize: 72, lineHeight: 0.95, fontWeight: 800, color: valueColor, letterSpacing: "-0.05em" }}>
                      {s.value}
                    </div>
                    <div className="slide-chrome mt-3" style={{ color: labelColor }}>
                      {s.label}
                    </div>
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <ChevronRight size={32} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-10 mx-auto text-center slide-body" style={{ color: "var(--muted-foreground)", maxWidth: 1200 }}>
          A strong volume of interviews early in the cycle allowed the team to stay selective, so the candidates
          who reached the offer stage were well matched to the roles.
        </p>
      </div>
    </>
  );
}
