import { SlideChrome, SectionTitle } from "../SlideShell";

function Donut({ percent, display }: { percent: number; display: string }) {
  const R = 120;
  const C = 2 * Math.PI * R;
  const dash = (percent / 100) * C;
  return (
    <div className="relative" style={{ width: 300, height: 300 }}>
      <svg width="300" height="300" viewBox="0 0 300 300">
        <circle cx="150" cy="150" r={R} fill="none" stroke="hsl(225 16% 91%)" strokeWidth="28" />
        <circle
          cx="150"
          cy="150"
          r={R}
          fill="none"
          stroke="var(--brand-ink)"
          strokeWidth="28"
          strokeDasharray={`${dash} ${C - dash}`}
          strokeDashoffset={C / 4}
          strokeLinecap="round"
          transform="rotate(-90 150 150)"
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ fontSize: 72, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.04em" }}
      >
        {display}
      </div>
    </div>
  );
}

type Stat = { display: string; percent: number; headline: string; body: string };

const STATS: Stat[] = [
  {
    display: "26%",
    percent: (94 / 355) * 100,
    headline: "94 of 355 July Interviews",
    body: "Candidates who accepted or proceeded to offer stage in July.",
  },
  {
    display: "71%",
    percent: 71,
    headline: "90 of 127 June Target",
    body: "June milestone completion rate based on offers secured.",
  },
  {
    display: "66%",
    percent: 66,
    headline: "79 of 120 July Target",
    body: "July milestone completion rate based on offers secured.",
  },
];

export function Slide7Outcomes({ page, total }: { page: number; total: number }) {
  return (
    <>
      <SlideChrome page={page} total={total} />
      <div className="w-full h-full pt-32 pb-40 px-32 flex flex-col">
        <div className="text-center">
          <SectionTitle
            kicker="Results"
            title="Outcomes at a Glance"
            subtitle="Key results from the June & July hiring cycles."
          />
        </div>
        <div className="mt-16 grid grid-cols-3 gap-10 flex-1">
          {STATS.map((s) => (
            <div
              key={s.headline}
              className="rounded-2xl p-10 flex flex-col items-center text-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <Donut percent={s.percent} display={s.display} />
              <div className="slide-body-lg font-bold mt-8" style={{ color: "var(--foreground)" }}>
                {s.headline}
              </div>
              <div className="slide-body mt-3" style={{ color: "var(--muted-foreground)" }}>
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
