import { ArabtecMark } from "../ArabtecMark";
import { SlideChrome } from "../SlideShell";

export function Slide1Cover({ page, total }: { page: number; total: number }) {
  return (
    <>
      <SlideChrome page={page} total={total} showLogo={false} footNote="Arabtec Construction LLC · June–July 2026" />
      <div className="w-full h-full flex flex-col items-center justify-center px-32">
        <div className="slide-kicker mb-10" style={{ color: "var(--brand)" }}>
          Monthly HR Report
        </div>
        <ArabtecMark size={120} showWordmark />
        <h1
          className="slide-title-lg mt-16 text-center"
          style={{ color: "var(--foreground)" }}
        >
          Hiring Milestone
        </h1>
        <p
          className="slide-subtitle mt-6 text-center max-w-[1200px]"
          style={{ color: "var(--muted-foreground)" }}
        >
          Our standard operating procedure to achieve the hiring target — and what we achieved across June & July.
        </p>
        <div className="mt-12 flex items-center gap-6" style={{ color: "var(--muted-foreground)" }}>
          <span className="slide-chrome">210 Target</span>
          <span style={{ width: 1, height: 24, background: "var(--border)" }} />
          <span className="slide-chrome">169 Secured</span>
          <span style={{ width: 1, height: 24, background: "var(--border)" }} />
          <span className="slide-chrome">80% Fill Rate</span>
        </div>
      </div>
    </>
  );
}
