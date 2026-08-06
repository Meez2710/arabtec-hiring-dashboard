import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import {
  ChevronDown,
  Download,
  Presentation,
  Filter,
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
  Clock,
  PauseCircle,
} from "lucide-react";
import { ArabtecMark } from "./ArabtecMark";
import { StaleBuildBanner, buildStamp } from "./BuildFreshness";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export type MonthView = "all" | "june" | "july";

/* ── Scroll-into-view hook ── */
function useInView<T extends HTMLElement>(rootMargin?: string) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    const margin = rootMargin ?? (isMobile ? "0px 0px 15% 0px" : "0px 0px -10% 0px");
    const threshold = isMobile ? 0.01 : 0.1;
    let rafId = 0;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => setInView(true));
          io.disconnect();
          break;
        }
      }
    }, { rootMargin: margin, threshold });
    io.observe(el);
    return () => { if (rafId) cancelAnimationFrame(rafId); io.disconnect(); };
  }, [inView, rootMargin]);
  return { ref, inView };
}

/* ══════════════════════════════════════════════════════════════════════════════
   DATA — Authoritative values per manager audit (Parts A + B)
   ══════════════════════════════════════════════════════════════════════════════ */

type Row = { label: string; done: number; target: number; tooltip?: string };

/* ── JUNE ── */
// A1: Target = 127 (MV 1.1 = 11, Construction = 44)
const JUNE_PROJECTS: Row[] = [
  { label: "North Coast", done: 31, target: 46 },
  { label: "Aliva",       done: 26, target: 32 },
  { label: "Burouj",      done: 10, target: 15 },
  { label: "Head Office", done: 8,  target: 11 },
  { label: "Icity",       done: 6,  target: 10 },
  { label: "MV 1.1",      done: 8,  target: 11 },
  { label: "HO1",         done: 1,  target: 2  },
];
// A1: Construction target 43→44. Total must = 127.
const JUNE_DEPARTMENTS: Row[] = [
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
// A4: Funnel 5 stages: 484→148→100→79→72
const JUNE_FUNNEL = [
  { value: 484, label: "Interviews Conducted",  color: "bg-ink",         note: "June figure pending source verification." },
  { value: 148, label: "Initially Accepted",    color: "bg-blue-500",    note: "31% of interviewed candidates passed initial screening." },
  { value: 100, label: "Offers Extended",       color: "bg-amber-400",   note: "100 formal offers issued against approved June vacancies." },
  { value: 79,  label: "Offers Accepted",       color: "bg-emerald-500", note: "79 of 98 resolved offers accepted (81% acceptance)." },
  { value: 72,  label: "Joined",                color: "bg-green-700",   note: "72 candidates completed onboarding and joined." },
];
const JUNE_FUNNEL_FOOTNOTE = "19 declined, 7 accepted but did not join, 2 pending. 90 of the 100 offers were against approved June vacancies; 10 were outside the June plan.";

/* ── JULY ── */
const JULY_SITES: Row[] = [
  { label: "North Coast", done: 39, target: 53 },
  { label: "Head Office", done: 6,  target: 23 },
  { label: "Aliva",       done: 17, target: 14 },
  { label: "MV 1.1",      done: 6,  target: 12 },
  { label: "Burouj",      done: 3,  target: 9  },
  { label: "Icity",       done: 5,  target: 6  },
  { label: "HO1",         done: 3,  target: 3  },
];
const JULY_DEPARTMENTS: Row[] = [
  { label: "Construction",  done: 27, target: 29 },
  { label: "HSE",           done: 11, target: 17 },
  { label: "Procurement",   done: 1,  target: 17 },
  { label: "Quality",       done: 10, target: 14 },
  { label: "Technical",     done: 1,  target: 8  },
  { label: "HR & Admin",    done: 7,  target: 7  },
  { label: "MEP",           done: 5,  target: 7  },
  { label: "Commercial",    done: 4,  target: 6  },
  { label: "Stores",        done: 4,  target: 4  },
  { label: "Planning",      done: 1,  target: 3  },
  { label: "DC",            done: 3,  target: 3  },
  { label: "Estimation",    done: 2,  target: 2  },
  { label: "Cost Control",  done: 1,  target: 1  },
  { label: "Operation",     done: 1,  target: 1  },
  { label: "IT",            done: 1,  target: 1  },
];
const JULY_ROLES: Row[] = [
  { label: "HSE Officer",            done: 5, target: 11 },
  { label: "Tech Engineer",          done: 0, target: 5  },
  { label: "Purchaser",              done: 0, target: 5  },
  { label: "Procurement Officer",    done: 0, target: 4  },
  { label: "QA/QC Engineer",         done: 6, target: 9  },
  { label: "Jr. Mech Engineer",      done: 1, target: 3  },
  { label: "Sr. Tech Engineer",      done: 1, target: 3  },
  { label: "Sr. Quantity Surveyor",  done: 1, target: 3  },
  { label: "Procurement Engineer",   done: 1, target: 3  },
  { label: "Sub Contract Engineer",  done: 0, target: 2  },
  { label: "Project Engineer",       done: 5, target: 6  },
  { label: "CM",                     done: 2, target: 3  },
];
// B5: July funnel — percentages against 355 (July only), NOT 839
const JULY_FUNNEL = [
  { value: 355, label: "Total Interviews Conducted",    color: "bg-ink",          note: "All candidates interviewed by the team across July 2026." },
  { value: 94,  label: "Proceeded to Offer",            color: "bg-emerald-500",  note: "26% of 355 — candidates moved forward to the offer stage." },
  { value: 47,  label: "On Hold",                       color: "bg-amber-400",    note: "13% of 355 — pending technical, HR, or vacancy-related decisions." },
  { value: 126, label: "Declined / No Show / Other",    color: "bg-slate-400",    note: "35% of 355 — candidate withdrew, did not attend, or was unavailable." },
  { value: 88,  label: "Rejected",                      color: "bg-red-500",      note: "25% of 355 — did not meet technical or HR requirements. (Sourcing quality metric)" },
];

/* ── COMBINED (All) ── */
// Carry-over model: target = June + July − June remaining (June's unfilled roles
// re-open inside the July plan, so counting both double-counts them).
// Must sum to 210/169.
const ALL_PROJECTS: Row[] = [
  { label: "North Coast", done: 70, target: 84 },
  { label: "Aliva",       done: 43, target: 40, tooltip: "43 offers extended against 40 unique vacancies — 3 July offers were made above the Aliva plan." },
  { label: "Head Office", done: 14, target: 31 },
  { label: "Burouj",      done: 13, target: 19 },
  { label: "MV 1.1",      done: 14, target: 20 },
  { label: "Icity",       done: 11, target: 12 },
  { label: "HO1",         done: 4,  target: 4  },
];
// Same carry-over model as ALL_PROJECTS. Must total 210/169.
const ALL_DEPARTMENTS: Row[] = [
  { label: "Construction",         done: 70, target: 72 },
  { label: "Technical Office",     done: 16, target: 25 },
  { label: "Commercial",           done: 12, target: 14 },
  { label: "Quality",              done: 13, target: 17 },
  { label: "Procurement & Stores", done: 12, target: 28 },
  { label: "MEP",                  done: 8,  target: 10 },
  { label: "Finance",              done: 5,  target: 5  },
  { label: "HR & Admin",           done: 9,  target: 9  },
  { label: "HSE",                  done: 14, target: 20 },
  { label: "Cost Control / DC",    done: 6,  target: 6  },
  { label: "Estimation",           done: 2,  target: 2  },
  { label: "Operation",            done: 1,  target: 1  },
  { label: "IT",                   done: 1,  target: 1  },
];
// B5/B6: Combined funnel — show June and July separately, never combined denominator
const ALL_FUNNEL_JUNE = [
  { value: 484, label: "Interviews Conducted (June)", color: "bg-ink",         note: "June figure pending source verification." },
  { value: 148, label: "Initially Accepted",          color: "bg-blue-500",    note: "31% of 484 passed initial screening." },
  { value: 100, label: "Offers Extended",             color: "bg-amber-400",   note: "68% of accepted candidates received formal offers." },
  { value: 79,  label: "Offers Accepted",             color: "bg-emerald-500", note: "79 of 98 resolved offers accepted (81%)." },
  { value: 72,  label: "Joined",                      color: "bg-green-700",   note: "72 completed onboarding." },
];
const ALL_FUNNEL_JULY = [
  { value: 355, label: "Interviews Conducted (July)", color: "bg-ink",          note: "All candidates interviewed across July 2026." },
  { value: 94,  label: "Proceeded to Offer",          color: "bg-emerald-500",  note: "26% of 355 moved to offer stage." },
  { value: 47,  label: "On Hold",                     color: "bg-amber-400",    note: "13% of 355 — pending decisions." },
  { value: 126, label: "Declined / No Show / Other",  color: "bg-slate-400",    note: "35% of 355 — withdrew or unavailable." },
  { value: 88,  label: "Rejected",                    color: "bg-red-500",      note: "25% of 355 — sourcing quality metric." },
];

const TEAM = [
  { name: "Ganna",  role: "Coordination & Scheduling", body: "Scheduled all interviews, dispatched candidates to sites, handled every reschedule, and kept day-to-day communication moving." },
  { name: "Eman",   role: "Sourcing & CVs",             body: "Sourced candidate CVs, issued offers, updated site deployment plans, and kept mobilization records current." },
  { name: "Monica", role: "Interviews & Onboarding",    body: "Conducted interviews, led onboarding and orientation activities, and issued new-hire notifications for a smooth start." },
  { name: "Menna",  role: "Guidance & Closing",         body: "Provided continuous follow-up support, aligned all company teams toward the target, and equipped the talent team with every tool to reach it — closing negotiated deals with shortlisted candidates." },
  { name: "Moutaz", role: "Interviews & Job Ads",       body: "Guided the team, set clear SOPs and communication channels, ran interviews, and created job posts across the cycle." },
];

/* ══════════════════════════════════════════════════════════════════════════════
   ASSERTIONS — Global rule: every breakdown must sum to its headline
   ══════════════════════════════════════════════════════════════════════════════ */
function assertSum(rows: Row[], expectedTarget: number, expectedDone: number, label: string) {
  const sumTarget = rows.reduce((s, r) => s + r.target, 0);
  const sumDone = rows.reduce((s, r) => s + r.done, 0);
  if (sumTarget !== expectedTarget || sumDone !== expectedDone) {
    console.warn(`[Assertion] ${label}: expected ${expectedDone}/${expectedTarget}, got ${sumDone}/${sumTarget}`);
  }
}
// Run assertions
assertSum(JUNE_PROJECTS, 127, 90, "June Projects");
assertSum(JUNE_DEPARTMENTS, 127, 90, "June Departments");
assertSum(ALL_PROJECTS, 210, 169, "All Projects");
assertSum(ALL_DEPARTMENTS, 210, 169, "All Departments");

/* ══════════════════════════════════════════════════════════════════════════════
   BUILDING BLOCKS
   ══════════════════════════════════════════════════════════════════════════════ */

function KpiCard({ icon: Icon, label, value, sub, source, accent = false }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; value: string; sub?: string; source?: string; accent?: boolean;
}) {
  return (
    <Card className={cn("relative overflow-hidden group border-border rounded-lg", accent ? "bg-ink text-ink-foreground border-ink" : "bg-card")}>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between gap-3">
          <span className={cn("text-[10px] font-semibold tracking-[0.22em] uppercase", accent ? "text-white/70" : "text-muted-foreground")}>{label}</span>
          <Icon size={16} className={accent ? "text-white/60" : "text-subtle-foreground"} />
        </div>
        <div className={cn("mt-8 font-display font-extrabold tabular-nums text-[44px] leading-none", accent ? "text-white" : "text-foreground")} style={{ letterSpacing: "-0.04em" }}>
          {value}
        </div>
        {sub && sub.trim() && (
          <div className={cn("mt-3 text-[13px] leading-snug", accent ? "text-white/70" : "text-muted-foreground")}>{sub}</div>
        )}
        {source && (
          <div className={cn("mt-1 text-[10px] leading-snug italic", accent ? "text-white/50" : "text-muted-foreground/70")}>{source}</div>
        )}
      </CardContent>
    </Card>
  );
}

function BarRow({ row, max, animate }: { row: Row; max: number; animate: boolean }) {
  const donePct   = max ? (row.done   / max) * 100 : 0;
  const targetPct = max ? (row.target / max) * 100 : 0;
  const complete  = row.target > 0 && row.done >= row.target;
  const pct       = row.target ? Math.round((row.done / row.target) * 100) : 0;
  return (
    <div className="grid grid-cols-[100px_1fr_80px] sm:grid-cols-[200px_1fr_124px] items-center gap-3 sm:gap-5 py-1.5">
      <div className="text-[12px] sm:text-[13px] font-medium text-foreground truncate">
        {row.tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="underline decoration-dotted cursor-help">{row.label}</span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              {row.tooltip}
            </TooltipContent>
          </Tooltip>
        ) : row.label}
      </div>
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div className="absolute inset-y-0 left-0 rounded-full bg-border-strong bar-fill" style={{ width: animate ? `${targetPct}%` : "0%" }} />
        <div className={cn("absolute inset-y-0 left-0 rounded-full bar-fill", complete ? "bg-success" : "bg-ink")} style={{ width: animate ? `${donePct}%` : "0%" }} />
      </div>
      <div className="text-[11px] sm:text-[13px] text-right tabular-nums">
        <span className="font-semibold text-foreground">{row.done}</span>
        <span className="text-subtle-foreground">/{row.target}</span>
        <span className={cn("ml-1 sm:ml-2 text-[10px] sm:text-[11px] font-semibold", complete ? "text-success" : "text-muted-foreground")}>{pct}%</span>
      </div>
    </div>
  );
}

function SectionHeader({ kicker, title, description, right }: {
  kicker?: string; title: string; description?: string; right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-10 pb-6 border-b border-border">
      <div className="min-w-0">
        {kicker && <div className="eyebrow mb-4">{kicker}</div>}
        <h2 className="font-display text-[32px] sm:text-[38px] font-extrabold tracking-tight text-foreground leading-[1.05]">
          {title}<span className="dot-accent">.</span>
        </h2>
        {description && <p className="mt-3 text-[15px] text-muted-foreground max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

function BarsCard({ title, description, rows, storageKey, filterKey, headlineTarget, headlineDone }: {
  title: string; description: string; rows: Row[]; storageKey: string; filterKey: "department" | "site" | "role";
  headlineTarget?: number; headlineDone?: number;
}) {
  const [status,   setStatus]   = useState<string>("all");
  const [selected, setSelected] = useState<string>("all");
  const filtered = useMemo(() => rows.filter((r) => {
    if (selected !== "all" && r.label !== selected) return false;
    const pct = r.target ? r.done / r.target : 0;
    if (status === "complete"     && pct < 1)            return false;
    if (status === "in-progress"  && (pct === 0 || pct >= 1)) return false;
    if (status === "not-started"  && r.done > 0)         return false;
    return true;
  }), [rows, selected, status]);
  const max         = Math.max(...rows.map((r) => r.target), 1);
  const totalDone   = headlineDone ?? rows.reduce((s, r) => s + r.done,   0);
  const totalTarget = headlineTarget ?? rows.reduce((s, r) => s + r.target, 0);
  const filterLabel = filterKey === "department" ? "Department" : filterKey === "site" ? "Project" : "Role";
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Card ref={ref} className="border-border" data-key={storageKey}>
      <CardHeader className="gap-5 border-b border-border-subtle pb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle className="text-[17px] font-display font-extrabold tracking-tight">{title}</CardTitle>
            <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed max-w-md">{description}</p>
          </div>
          <Badge variant="secondary" className="w-fit tabular-nums font-semibold">{totalDone} / {totalTarget}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1"><Filter size={13} /> Filters</div>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="h-8 w-[180px] text-sm"><SelectValue placeholder={filterLabel} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filterLabel}s</SelectItem>
              {rows.map((r) => <SelectItem key={r.label} value={r.label}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-[160px] text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-6">
        {filtered.length === 0
          ? <div className="text-sm text-muted-foreground py-6 text-center">No matching rows.</div>
          : filtered.map((r) => <BarRow key={r.label} row={r} max={max} animate={inView} />)
        }
      </CardContent>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   FUNNEL COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */
function UnifiedFunnel({ stages, sequential = true, footnote }: {
  stages: { value: number; label: string; color?: string; note?: string }[];
  sequential?: boolean;
  footnote?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const total = stages[0].value;
  return (
    <Card className="border-border overflow-hidden">
      <CardContent ref={ref} className="p-0">
        {stages.map((s, i) => {
          const sharePct = Math.round((s.value / total) * 100);
          const prev = i > 0 ? stages[i - 1] : null;
          const convPct = prev ? Math.round((s.value / prev.value) * 100) : null;
          const barColor = s.color ?? "bg-slate-400";
          const isFirst = i === 0;
          const isLast = i === stages.length - 1;
          const accentColor = s.color ?? "bg-slate-400";
          return (
            <div key={i}>
              {sequential && i > 0 && (
                <div className="flex items-center gap-3 px-6 sm:px-8 py-2 bg-muted/40">
                  <div className="w-px h-4 bg-border mx-[10px]" />
                  <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
                    ↓ {convPct}% proceeded to next stage
                  </span>
                </div>
              )}
              <div className={cn(
                "relative flex items-center gap-0 pl-0",
                !isLast && !sequential && "border-b border-border-subtle"
              )}>
                <div className={cn("w-1 self-stretch shrink-0", accentColor)} />
                <div className="flex-1 px-5 sm:px-7 py-5 sm:py-6">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn(
                        "text-[10px] font-bold tabular-nums shrink-0 px-1.5 py-0.5 rounded",
                        isFirst ? "bg-ink text-ink-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn(
                        "text-[14px] sm:text-[15px] font-semibold leading-tight",
                        isFirst ? "text-foreground" : "text-foreground/90"
                      )}>{s.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2 sm:gap-3 shrink-0">
                      <span className={cn(
                        "font-display font-extrabold tabular-nums leading-none",
                        isFirst ? "text-[32px] sm:text-[38px]" : "text-[26px] sm:text-[30px]",
                        "text-foreground"
                      )} style={{ letterSpacing: "-0.04em" }}>{s.value.toLocaleString()}</span>
                      {!isFirst && (
                        <span className="text-[11px] sm:text-[12px] tabular-nums text-muted-foreground w-[64px] sm:w-[76px] text-right leading-tight">
                          {sharePct}% of total
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative h-[6px] rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-700", barColor)}
                      style={{ width: inView ? `${sharePct}%` : "0%", transitionDelay: `${i * 100}ms` }}
                    />
                  </div>
                  {s.note && (
                    <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">{s.note}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {footnote && (
          <div className="px-6 sm:px-8 py-4 bg-muted/30 border-t border-border-subtle">
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">{footnote}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SECTIONS
   ══════════════════════════════════════════════════════════════════════════════ */

/** B2: Combined June + July overview */
function OverviewSection() {
  return (
    <section id="overview" className="scroll-mt-24">
      <SectionHeader
        kicker="Overview"
        title="The Full Milestone Picture"
        description="Our combined June–July hiring milestone — 210 unique vacancies, 169 offers secured, and an 80% fill rate. June's 37 unfilled roles rolled into the July plan and are counted once. Reporting period: 1 June – 31 July 2026."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard icon={Target}       label="Total Target"      value="210" sub="June (127) + July (120) − 37 carried over" source="Carry-over netted: June's unfilled roles re-open in July" accent />
        <KpiCard icon={CheckCircle2} label="Offers Secured"    value="169" sub="June (90) + July (79)" source="Vacancy plan · Offered column" />
        <KpiCard icon={TrendingUp}   label="Fill Rate"         value="80%" sub="169 of 210 vacancies covered" source="= Offers Secured / Total Target" />
        <KpiCard icon={TrendingUp}   label="Offer Acceptance"  value="80%" sub="111 of 139 resolved offers accepted · 42 pending, excluded" source="= Accepted / (Accepted + Declined)" />
        <KpiCard icon={Clock}        label="Remaining"         value="41"  sub="Open at 31 July (June's 37 re-opened in July)" source="= Target − Secured" />
      </div>
    </section>
  );
}

/** A2/A3: June-only overview KPIs */
function JuneOverviewSection() {
  return (
    <section id="overview" className="scroll-mt-24">
      <SectionHeader
        kicker="June 2026 · Summary"
        title="June Milestone Results"
        description="June 2026 hiring cycle — 127 target vacancies, 90 offers secured. Reporting period: 1–30 June 2026."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Target}       label="Total Target"      value="127" sub="June 2026 vacancies" source="ManpowerRequirements · Jun 2026 Grand Total" accent />
        <KpiCard icon={CheckCircle2} label="Offers Secured"    value="90"  sub="71% of 127 vacancies covered" source="Offers tracker · Jun resolved" />
        <KpiCard icon={TrendingUp}   label="Offer Acceptance"  value="81%" sub="79 of 98 resolved offers accepted · 2 pending" source="= Accepted / Resolved offers" />
        <KpiCard icon={PauseCircle}  label="On Hold"           value="11"  sub="Procurement roles frozen by AR" source="Hold list · excluded from 127 target" />
      </div>
    </section>
  );
}

/** July-only overview KPIs */
function JulyOverviewSection() {
  return (
    <section id="overview" className="scroll-mt-24">
      <SectionHeader
        kicker="July 2026 · In Progress"
        title="July Milestone Status"
        description="July 2026 hiring cycle — 120 target vacancies, 79 offers secured, 66% fill rate. Reporting period: 1–31 July 2026."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Target}       label="Total Target"      value="120" sub="July 2026 vacancies" source="ManpowerRequirements · Jul 2026 Grand Total" accent />
        <KpiCard icon={CheckCircle2} label="Offered / Secured" value="79"  sub="66% of 120 vacancies covered" source="Offers tracker · Jul resolved" />
        <KpiCard icon={TrendingUp}   label="Fill Rate"         value="66%" sub="79 of 120 offered" source="= Secured ÷ Target" />
        <KpiCard icon={Clock}        label="Remaining"         value="41"  sub="Active vacancies" source="= 120 − 79" />
      </div>
    </section>
  );
}

function JuneBreakdown() {
  return (
    <section id="june" className="scroll-mt-24">
      <SectionHeader
        kicker="June Results"
        title="Hiring Breakdown"
        description="Offers secured against target, filterable by project or department. Both cards total 127 / 90."
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BarsCard title="By Project"    description="North Coast and Aliva carried the largest demand and highest closes." rows={JUNE_PROJECTS}    storageKey="june-projects"    filterKey="site" headlineTarget={127} headlineDone={90} />
        <BarsCard title="By Department" description="Target vs. achieved across every department — filled bars show offers secured." rows={JUNE_DEPARTMENTS} storageKey="june-departments" filterKey="department" headlineTarget={127} headlineDone={90} />
      </div>
    </section>
  );
}

/** A4: June funnel — 5 stages with footnote */
function JuneFunnelSection() {
  return (
    <section id="june-funnel" className="scroll-mt-24">
      <SectionHeader kicker="June · Interview Pipeline" title="June Interview Funnel" description="484 interviews conducted — tracking every stage from screening to onboarding." />
      <UnifiedFunnel stages={JUNE_FUNNEL} sequential={true} footnote={JUNE_FUNNEL_FOOTNOTE} />
    </section>
  );
}

/** B5: July funnel — percentages against 355 only */
function FunnelSection() {
  return (
    <section id="funnel" className="scroll-mt-24">
      <SectionHeader kicker="July · Interview Outcomes" title="July Interview Funnel" description="355 total candidates interviewed — outcomes as percentage of July total (355), not combined." />
      <UnifiedFunnel stages={JULY_FUNNEL} sequential={false} />
    </section>
  );
}

/** B5/B6: Combined funnel — shows June and July separately */
function AllFunnelSection() {
  return (
    <section id="funnel" className="scroll-mt-24">
      <SectionHeader
        kicker="June + July · Interview Outcomes"
        title="Interview Funnel"
        description="Shown separately because the two months hold different data shapes: June has sequential stage counts, July has mutually exclusive outcome categories. Percentages are always against their own month's total. The two funnels are not directly comparable stage by stage."
      />
      <div className="space-y-6">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-3">June Pipeline — sequential stages (each % of the previous stage)</h3>
          <UnifiedFunnel stages={ALL_FUNNEL_JUNE} sequential={true} footnote={JUNE_FUNNEL_FOOTNOTE} />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-3">July Outcomes — exclusive categories (each % of 355; the four sum to 355)</h3>
          <UnifiedFunnel stages={ALL_FUNNEL_JULY} sequential={false} />
        </div>
      </div>
    </section>
  );
}

/** Combined breakdown — carry-over netted; must sum to 210/169 */
function AllBreakdown() {
  return (
    <section id="breakdown" className="scroll-mt-24">
      <SectionHeader
        kicker="June + July · Combined"
        title="Hiring Breakdown"
        description="Offers secured against unique vacancies across both months. Cards must total 169 / 210."
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BarsCard
          title="By Project"
          description="North Coast and Aliva led hiring across both cycles."
          rows={ALL_PROJECTS}
          storageKey="all-projects"
          filterKey="site"
          headlineTarget={210}
          headlineDone={169}
        />
        <BarsCard
          title="By Department"
          description="Combined department totals. June Surveyors merged into Construction."
          rows={ALL_DEPARTMENTS}
          storageKey="all-departments"
          filterKey="department"
          headlineTarget={210}
          headlineDone={169}
        />
      </div>
    </section>
  );
}

function TeamSection() {
  const [openName, setOpenName] = useState<string | null>(null);
  return (
    <section id="team" className="scroll-mt-24">
      <SectionHeader kicker="The Team" title="Hiring Process Distribution" description="Each member owned one part of the process and supported all hiring functions together." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEAM.map((m) => {
          const open = openName === m.name;
          return (
            <Collapsible key={m.name} open={open} onOpenChange={(v) => setOpenName(v ? m.name : null)}>
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center font-display font-extrabold text-[17px] shrink-0 bg-muted text-foreground border border-border">{m.name[0]}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground truncate">{m.name}</div>
                      <div className="text-[12px] text-muted-foreground truncate">{m.role}</div>
                    </div>
                  </div>
                  <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none">
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{m.body}</p>
                  </CollapsibleContent>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="mt-3 -ml-2 h-8 text-xs text-muted-foreground hover:text-foreground">
                      {open ? "Hide details" : "View details"}
                      <ChevronDown size={14} className={cn("ml-1 transition-transform", open && "rotate-180")} />
                    </Button>
                  </CollapsibleTrigger>
                </CardContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </section>
  );
}

/** A5: July section in June page removed — only shows on July page */
function JulySection() {
  return (
    <section id="july" className="scroll-mt-24">
      <SectionHeader kicker="July Results" title="Hiring Breakdown" description="Offers secured against target, filterable by project, department, or role." />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BarsCard title="By Project"    description="North Coast and Head Office carry the largest demand." rows={JULY_SITES}       storageKey="july-sites"       filterKey="site" headlineTarget={120} headlineDone={79} />
        <BarsCard title="By Department" description="Procurement and Technical have the highest remaining."  rows={JULY_DEPARTMENTS} storageKey="july-departments" filterKey="department" headlineTarget={120} headlineDone={79} />
      </div>
      <div className="mt-6">
        <BarsCard title="By Role (Top 12 of 120)" description="The 12 roles with the largest unfilled demand — a subset of July's 120 vacancies, not the full list. Totals here will not equal 79 / 120." rows={JULY_ROLES} storageKey="july-roles" filterKey="role" />
      </div>
    </section>
  );
}

/* ── Month Toggle ── */
function MonthToggle({ current }: { current: MonthView }) {
  const [, navigate] = useLocation();
  const opts: { key: MonthView; label: string; path: string }[] = [
    { key: "all",  label: "All",  path: "/" },
    { key: "june", label: "June", path: "/june" },
    { key: "july", label: "July", path: "/july" },
  ];
  return (
    <div className="flex items-center bg-muted rounded-lg p-0.5">
      {opts.map((o) => (
        <button
          key={o.key}
          onClick={() => navigate(o.path)}
          className={cn(
            "px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all duration-150",
            current === o.key
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE SHELL
   ══════════════════════════════════════════════════════════════════════════════ */
const NAV_ALL  = [{ id:"overview",label:"Overview"},{id:"funnel",label:"Funnel"},{id:"breakdown",label:"Breakdown"},{id:"team",label:"Team"}];
const NAV_JUNE = [{ id:"overview",label:"Overview"},{id:"june-funnel",label:"Funnel"},{id:"june",label:"Breakdown"}];
const NAV_JULY = [{ id:"overview",label:"Overview"},{id:"funnel",label:"Funnel"},{id:"july",label:"Breakdown"}];

export function SlidePage({ month = "all" }: { month?: MonthView }) {
  const handleDownload = () => window.print();
  const NAV = month === "june" ? NAV_JUNE : month === "july" ? NAV_JULY : NAV_ALL;
  const monthLabel = month === "june" ? "June 2026" : month === "july" ? "July 2026" : "June–July 2026";

  return (
    <div className="min-h-screen bg-background">
      <StaleBuildBanner />
      <header className="sticky top-0 z-40 print:hidden border-b border-border bg-background">
        <div className="max-w-[1280px] mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <ArabtecMark size={30} showWordmark />
            <div className="hidden sm:block h-7 w-px bg-border" />
            <div className="hidden sm:flex flex-col leading-tight min-w-0">
              <span className="eyebrow-plain text-subtle-foreground truncate">Hiring Dashboard</span>
              <span className="text-[13px] font-medium text-foreground truncate">{monthLabel} Report</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-4">
            <MonthToggle current={month} />
            <div className="h-5 w-px bg-border" />
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/deck"><Presentation size={15} /> Present</Link>
            </Button>
            <Button size="sm" onClick={handleDownload} className="bg-ink text-ink-foreground hover:bg-ink/90 text-xs sm:text-sm">
              <Download size={15} /> <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>

        <div className="lg:hidden border-t border-border overflow-x-auto scroll-slim">
          <div className="flex items-center gap-1 px-4 py-2 min-w-max">
            <MonthToggle current={month} />
            <div className="h-4 w-px bg-border mx-2" />
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted whitespace-nowrap">
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="print:hidden border-b border-border">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-24 pb-10 sm:pb-14 lg:pb-20">
          <div className="eyebrow mb-4 sm:mb-6">Arabtec Construction · HR</div>
          <h1 className="font-display text-[28px] sm:text-[44px] lg:text-[64px] font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.02]">
            {month === "june"
              ? "June 2026 Hiring Milestone"
              : month === "july"
              ? "July 2026 Hiring Milestone"
              : "The Hiring Milestone Dashboard"}
            <span className="dot-accent">.</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-[14px] sm:text-[16px] lg:text-[18px] text-muted-foreground max-w-2xl leading-relaxed">
            {month === "june"
              ? "June 2026 hiring cycle — 127 target vacancies, 90 offers secured, 81% offer acceptance rate. Explore by project or department."
              : month === "july"
              ? "July 2026 hiring cycle — 120 target vacancies, 79 offers secured, 66% fill rate. Explore by project, role, or interview funnel."
              : "A live overview of our June–July 2026 hiring milestone. Reporting period: 1 June – 31 July 2026."}
          </p>
          <div className="mt-5 sm:mt-8 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 text-[12px] sm:text-[13px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Live · Updated {month === "june" ? "June" : "July"} 2026
            </span>
            <span className="hidden sm:block h-4 w-px bg-border" />
            <span className="flex items-center gap-2">
              <Users size={14} />
              5 team members · {month === "june" ? "11 departments" : "7 active sites"} · {month === "june" ? "7 active sites" : "12 roles in pipeline"}
            </span>
          </div>
        </div>
      </section>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-12 sm:gap-20 lg:gap-24">
          {/* Overview KPIs */}
          {month === "all"  && <OverviewSection />}
          {month === "june" && <JuneOverviewSection />}
          {month === "july" && <JulyOverviewSection />}
          {/* Funnel */}
          {month === "all"  && <AllFunnelSection />}
          {month === "june" && <JuneFunnelSection />}
          {month === "july" && <FunnelSection />}
          {/* Breakdown */}
          {month === "all"  && <AllBreakdown />}
          {month === "june" && <JuneBreakdown />}
          {month === "july" && <JulySection />}
          {/* Team — All page only (A5: removed from June/July) */}
          {month === "all" && <TeamSection />}
        </div>

        {/* Global footer note */}
        <footer className="mt-24 pt-8 pb-4 border-t border-border print:hidden">
          <div className="flex flex-col gap-4">
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              42 of 181 offers awaiting final outcome. Acceptance rate calculated on resolved offers only. Reporting period: 1 June – 31 July 2026.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ArabtecMark size={24} showWordmark />
                <span className="text-xs text-muted-foreground">Hiring Milestone · {monthLabel}</span>
              </div>
              <span className="text-xs text-muted-foreground">© Arabtec Construction · HR</span>
            </div>
            <p className="text-[11px] text-subtle-foreground tabular-nums">{buildStamp()}</p>
          </div>
        </footer>
      </main>

      <style>{`
        @media print {
          @page { size: A4; margin: 16mm; }
          html, body { background: white !important; }
          header, footer, nav, button { display: none !important; }
          main { max-width: none !important; padding: 0 !important; }
          section { page-break-inside: avoid; break-inside: avoid; margin-bottom: 24px !important; }
        }
      `}</style>
    </div>
  );
}
assertSum(JULY_SITES, 120, 79, "July Sites");
assertSum(JULY_DEPARTMENTS, 120, 79, "July Departments");
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
