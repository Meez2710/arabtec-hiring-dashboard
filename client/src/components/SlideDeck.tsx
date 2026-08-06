import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { ScaledSlide } from "./SlideShell";
import { Slide1Cover } from "./slides/Slide1Cover";
import { Slide2FullPicture } from "./slides/Slide2FullPicture";
import { SlideBars } from "./slides/SlideBars";
import { Slide5Process } from "./slides/Slide5Process";
import { Slide6Funnel } from "./slides/Slide6Funnel";
import { Slide7Outcomes } from "./slides/Slide7Outcomes";
import { Slide8JulyIntro } from "./slides/Slide8JulyIntro";

const JULY_SITE_ROWS = [
  { label: "North Coast", done: 41, target: 53 },
  { label: "Head Office", done: 7,  target: 23 },
  { label: "Aliva",       done: 8,  target: 14 },
  { label: "MV 1.1",      done: 9,  target: 12 },
  { label: "Burouj",      done: 7,  target: 9  },
  { label: "Icity",       done: 4,  target: 6  },
  { label: "HO1",         done: 3,  target: 3  },
];

const JULY_ROLE_ROWS = [
  { label: "HSE Officer",            done: 5, target: 11 },
  { label: "Tech Engineer",          done: 0, target: 5 },
  { label: "Purchaser",              done: 0, target: 5 },
  { label: "Procurement Officer",    done: 0, target: 4 },
  { label: "QA/QC Engineer",         done: 6, target: 9 },
  { label: "Jr. Mech Engineer",      done: 1, target: 3 },
  { label: "Sr. Tech Engineer",      done: 1, target: 3 },
  { label: "Sr. Quantity Surveyor",  done: 1, target: 3 },
  { label: "Procurement Engineer",   done: 1, target: 3 },
  { label: "Sub Contract Engineer",  done: 0, target: 2 },
  { label: "Project Engineer",       done: 5, target: 6 },
  { label: "CM",                     done: 2, target: 3 },
];

const PROJECT_ROWS = [
  { label: "North Coast", done: 31, target: 46 },
  { label: "Aliva",       done: 26, target: 32 },
  { label: "Burouj",      done: 10, target: 15 },
  { label: "Head Office", done: 8,  target: 11 },
  { label: "Icity",       done: 6,  target: 10 },
  { label: "MV 1.1",      done: 8,  target: 11 },
  { label: "HO1",         done: 1,  target: 2  },
];

const DEPT_ROWS = [
  { label: "Construction",         done: 43, target: 50 },
  { label: "Technical Office",     done: 14, target: 23 },
  { label: "Commercial",           done: 8,  target: 15 },
  { label: "Quality",              done: 3,  target: 9  },
  { label: "Procurement & Stores", done: 7,  target: 9  },
  { label: "MEP",                  done: 3,  target: 6  },
  { label: "Finance",              done: 5,  target: 5  },
  { label: "HR & Admin",           done: 2,  target: 4  },
  { label: "HSE",                  done: 3,  target: 4  },
  { label: "Cost Control",         done: 2,  target: 2  },
];

export function SlideDeck() {
  const [index, setIndex] = useState(0);
  const TOTAL = 10;

  const slides = [
    <Slide1Cover page={1} total={TOTAL} />,
    <Slide2FullPicture page={2} total={TOTAL} />,
    <SlideBars
      page={3}
      total={TOTAL}
      kicker="By Project"
      title="Hiring Results by Project"
      subtitle="Hiring target versus offers secured, by project."
      rows={PROJECT_ROWS}
      callout={{ title: "North Coast & Aliva", body: "Carried the largest demand and the highest number of offers secured." }}
      footNote="June figures: 127 target · 90 offered · 37 remaining."
    />,
    <SlideBars
      page={4}
      total={TOTAL}
      kicker="By Department"
      title="Hiring Results by Department"
      subtitle="Hiring target versus offers secured, by department."
      rows={DEPT_ROWS}
      callout={{ title: "June: 127 target · 90 secured", body: "Construction, Technical Office, and Procurement led the volume." }}
      dense
    />,
    <Slide5Process page={5} total={TOTAL} />,
    <Slide6Funnel page={6} total={TOTAL} />,
    <Slide7Outcomes page={7} total={TOTAL} />,
    <Slide8JulyIntro page={8} total={TOTAL} />,
    <SlideBars
      page={9}
      total={TOTAL}
      kicker="July · By Project"
      title="Remaining Vacancies by Project"
      subtitle="July target versus offers secured by project — showing progress and remaining gaps."
      rows={JULY_SITE_ROWS}
      callout={{ title: "North Coast & Head Office", body: "Together they carry 76 of the 120 target positions — the primary focus for July closes." }}
      footNote="July · 120 target · 79 offered · 41 remaining."
    />,
    <SlideBars
      page={10}
      total={TOTAL}
      kicker="July · By Role"
      title="Top Remaining Positions"
      subtitle="Roles with the highest remaining count — where hiring effort is focused."
      rows={JULY_ROLE_ROWS}
      callout={{ title: "HSE & Technical focus", body: "HSE Officers (6 remaining), Tech Engineers (5), and Purchasers (5) lead the unfilled pipeline." }}
      dense
    />,
  ];

  const go = useCallback((n: number) => setIndex((i) => Math.max(0, Math.min(TOTAL - 1, i + n))), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") go(1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
      else if (e.key === "Home") setIndex(0);
      else if (e.key === "End") setIndex(TOTAL - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const goFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden" style={{ background: "var(--surface)" }}>
      {/* Slide stage */}
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 md:p-8 pb-16 sm:pb-20">
        <div className="relative w-full h-full">
          <ScaledSlide>{slides[index]}</ScaledSlide>
        </div>
      </div>

      {/* Nav pill */}
      <div
        className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 rounded-full px-2 sm:px-3 py-1.5 sm:py-2"
        style={{ background: "white", border: "1px solid var(--border)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.12)" }}
      >
        <button
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="hidden sm:flex items-center gap-1.5 px-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all rounded-full"
              style={{
                width: i === index ? 22 : 8,
                height: 8,
                background: i === index ? "var(--brand)" : "var(--border)",
              }}
            />
          ))}
        </div>
        <div className="text-[11px] sm:text-xs font-medium px-1.5 sm:px-2 tabular-nums" style={{ color: "var(--muted-foreground)" }}>
          {String(index + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </div>
        <button
          aria-label="Next slide"
          onClick={() => go(1)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight size={16} />
        </button>
        <div className="w-px h-5 sm:h-6 mx-0.5 sm:mx-1" style={{ background: "var(--border)" }} />
        <button
          aria-label="Fullscreen"
          onClick={goFullscreen}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
}
