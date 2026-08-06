import { SlideChrome, SectionTitle } from "../SlideShell";

type Member = { name: string; role: string; body: string };

const MEMBERS: Member[] = [
  {
    name: "Ganna",
    role: "Coordination & Scheduling",
    body: "Scheduled all interviews, dispatched candidates to sites, handled every reschedule, and kept day-to-day communication moving.",
  },
  {
    name: "Eman",
    role: "Sourcing & CVs",
    body: "Sourced candidate CVs, issued offers, updated site deployment plans, and kept mobilization records current.",
  },
  {
    name: "Monica",
    role: "Interviews & Onboarding",
    body: "Conducted interviews, led onboarding and orientation activities, and issued new-hire notifications for a smooth start.",
  },
  {
    name: "Menna",
    role: "Guidance & Closing",
    body: "Provided continuous follow-up support, aligned all company teams toward the target, and equipped the talent team with every tool to reach it — closing negotiated deals with shortlisted candidates.",
  },
  {
    name: "Moutaz",
    role: "Interviews & Job Ads",
    body: "Guided the team, set clear SOPs and communication channels, ran interviews, and created job posts across the cycle.",
  },
];

export function Slide5Process({ page, total }: { page: number; total: number }) {
  return (
    <>
      <SlideChrome page={page} total={total} showLogo={false} />
      <div className="w-full h-full pt-32 pb-40 px-32 flex flex-col">
        <SectionTitle
          kicker="The Team"
          title="Hiring Process Distribution"
          subtitle="Each member owned one part of the process and supported all hiring functions with the team."
        />
        <div className="mt-10 grid grid-cols-1 gap-2 flex-1">
          {MEMBERS.map((m, i) => (
            <div
              key={m.name}
              className="grid grid-cols-[80px_320px_1fr] items-center gap-8 py-3"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "hsl(220 20% 97%)", color: "var(--foreground)", fontWeight: 700, fontSize: 26 }}
              >
                {m.name[0]}
              </div>
              <div>
                <div className="slide-body-lg font-bold" style={{ color: "var(--brand)" }}>
                  {m.name}
                </div>
                <div className="slide-chrome mt-1" style={{ color: "var(--muted-foreground)" }}>
                  {m.role}
                </div>
              </div>
              <div className="slide-body" style={{ color: "var(--foreground)" }}>
                {m.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
