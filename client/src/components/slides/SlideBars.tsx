import { SlideChrome, SectionTitle } from "../SlideShell";

type Row = { label: string; done: number; target: number };

function BarRow({ label, done, target, max }: Row & { max: number }) {
  const donePct = (done / max) * 100;
  const targetPct = (target / max) * 100;
  const complete = done === target;
  return (
    <div className="grid grid-cols-[220px_1fr_120px] items-center gap-8">
      <div className="slide-body text-right pr-2" style={{ color: "var(--foreground)", fontWeight: 500 }}>
        {label}
      </div>
      <div className="relative h-11 rounded-md" style={{ background: "var(--muted)" }}>
        <div
          className="absolute inset-y-0 left-0 rounded-md"
          style={{ width: `${targetPct}%`, background: "oklch(0.93 0.01 260)" }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-md"
          style={{
            width: `${donePct}%`,
            background: complete ? "hsl(142 72% 29%)" : "var(--brand-ink)",
          }}
        />
      </div>
      <div className="slide-body-lg" style={{ color: "var(--foreground)", fontWeight: 700 }}>
        <span>{done}</span>
        <span style={{ color: "var(--muted-foreground)", fontWeight: 500 }}>/{target}</span>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded" style={{ background: "var(--brand-ink)" }} />
        <span className="slide-caption" style={{ color: "var(--foreground)" }}>Achieved</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded" style={{ background: "oklch(0.93 0.01 260)" }} />
        <span className="slide-caption" style={{ color: "var(--foreground)" }}>Target</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded" style={{ background: "oklch(0.55 0.15 155)" }} />
        <span className="slide-caption" style={{ color: "var(--foreground)" }}>Completed</span>
      </div>
    </div>
  );
}

export function SlideBars({
  page,
  total,
  title,
  subtitle,
  kicker,
  rows,
  callout,
  footNote,
  dense = false,
}: {
  page: number;
  total: number;
  title: string;
  subtitle: string;
  kicker: string;
  rows: { label: string; done: number; target: number }[];
  callout?: { title: string; body: string };
  footNote?: string;
  dense?: boolean;
}) {
  const max = Math.max(...rows.map((r) => r.target));
  return (
    <>
      <SlideChrome page={page} total={total} showLogo={!dense} />
      <div className="w-full h-full pt-32 pb-40 px-32 flex flex-col">
        <SectionTitle kicker={kicker} title={title} subtitle={subtitle} />
        <div className="mt-10 grid grid-cols-[1fr_320px] gap-16 flex-1">
          <div className="flex flex-col justify-center gap-3">
            {rows.map((r) => (
              <BarRow key={r.label} {...r} max={max} />
            ))}
          </div>
          <div className="flex flex-col justify-between pt-4">
            <Legend />
            {callout && (
              <div
                className="rounded-xl p-6"
                style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.85 0.05 20)" }}
              >
                <div className="slide-caption font-bold" style={{ color: "var(--brand)" }}>
                  {callout.title}
                </div>
                <div className="mt-2 slide-caption" style={{ color: "var(--foreground)" }}>
                  {callout.body}
                </div>
              </div>
            )}
            {footNote && (
              <div className="slide-caption italic" style={{ color: "var(--muted-foreground)" }}>
                {footNote}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
