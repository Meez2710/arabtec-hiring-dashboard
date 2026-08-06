import { SlideChrome, SectionTitle } from "../SlideShell";

function MetricCard({
  value,
  label,
  sub,
  tone = "default",
  size = "md",
}: {
  value: string;
  label: string;
  sub?: string;
  tone?: "default" | "brand" | "hold";
  size?: "sm" | "md" | "lg";
}) {
  const bg = tone === "brand" ? "var(--brand-ink)" : tone === "hold" ? "var(--brand-soft)" : "white";
  const valueColor = tone === "brand" ? "white" : "var(--foreground)";
  const labelColor = tone === "brand" ? "rgba(255,255,255,0.85)" : "var(--muted-foreground)";
  const border = tone === "brand" ? "transparent" : "var(--border)";
  return (
    <div
      className="rounded-2xl flex flex-col justify-between p-10"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: tone === "brand" ? "0 20px 40px -20px oklch(0.42 0.14 20 / 0.5)" : "none",
      }}
    >
      <span style={{ width: 40, height: 3, background: tone === "brand" ? "white" : "var(--brand)" }} />
      <div>
        <div
          style={{
            fontSize: size === "lg" ? 180 : size === "md" ? 128 : 96,
            lineHeight: 0.95,
            fontWeight: 800,
            color: valueColor,
            letterSpacing: "-0.05em",
          }}
        >
          {value}
        </div>
        <div className="slide-chrome mt-4" style={{ color: labelColor }}>
          {label}
        </div>
        {sub && (
          <div className="mt-2 slide-caption" style={{ color: labelColor, textTransform: "none", letterSpacing: 0 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

export function Slide2FullPicture({ page, total }: { page: number; total: number }) {
  return (
    <>
      <SlideChrome page={page} total={total} />
      <div className="w-full h-full pt-32 pb-40 px-32 grid grid-cols-12 gap-12">
        <div className="col-span-5 flex flex-col justify-center">
          <SectionTitle
            kicker="Overview"
            title="The Full Picture"
            subtitle="Combined June–July milestone — 210 unique vacancies, 169 offers secured, 80% fill rate. June's 37 unfilled roles rolled into July and are counted once."
          />
        </div>
        <div className="col-span-7 grid grid-cols-2 grid-rows-2 gap-6">
          <div className="row-span-2">
            <MetricCard value="210" label="Total Target" size="lg" tone="brand" />
          </div>
          <MetricCard value="169" label="Offered / Secured" sub="June (90) + July (79)" />
          <MetricCard value="41" label="Remaining" sub="Open at 31 July" tone="hold" />
        </div>
      </div>
    </>
  );
}
