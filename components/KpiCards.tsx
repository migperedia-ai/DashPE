import { AlertTriangle, CheckCircle2, Clock3, KanbanSquare } from "lucide-react";
import type { EngineeringTask } from "@/lib/types";
import { daysLeft } from "@/lib/utils";

export function KpiCards({ tasks }: { tasks: EngineeringTask[] }) {
  const critical = tasks.filter(
    (t) => t.priority === "Critical" && t.status !== "Completed"
  ).length;

  const late = tasks.filter((t) => {
    const left = daysLeft(t.dueDate);
    return t.status !== "Completed" && left !== null && left < 0;
  }).length;

  const completed = tasks.filter((t) => t.status === "Completed").length;

  const total = tasks.length;
  const completion = total ? Math.round((completed / total) * 100) : 0;

  const cards = [
    {
      label: "OPEN CRITICALS",
      value: critical,
      icon: AlertTriangle,
      border: "border-red-400/40",
      glow: "shadow-[0_0_18px_rgba(255,77,109,0.12)]",
      iconColor: "text-red-300",
      accent: "from-red-400/80 via-red-300/30 to-transparent",
      valueGlow: "drop-shadow-[0_0_8px_rgba(255,77,109,0.25)]",
    },
    {
      label: "OVERDUE TASKS",
      value: late,
      icon: Clock3,
      border: "border-orange-300/40",
      glow: "shadow-[0_0_18px_rgba(255,159,28,0.12)]",
      iconColor: "text-orange-300",
      accent: "from-orange-300/80 via-orange-300/30 to-transparent",
      valueGlow: "drop-shadow-[0_0_8px_rgba(255,159,28,0.25)]",
    },
    {
      label: "COMPLETED",
      value: completed,
      icon: CheckCircle2,
      border: "border-emerald-300/40",
      glow: "shadow-[0_0_18px_rgba(0,255,153,0.12)]",
      iconColor: "text-emerald-300",
      accent: "from-emerald-300/80 via-emerald-300/30 to-transparent",
      valueGlow: "drop-shadow-[0_0_8px_rgba(0,255,153,0.25)]",
    },
    {
      label: "COMPLETION RATE",
      value: `${completion}%`,
      icon: KanbanSquare,
      border: "border-cyan-300/40",
      glow: "shadow-[0_0_18px_rgba(0,229,255,0.12)]",
      iconColor: "text-cyan-300",
      accent: "from-cyan-300/80 via-cyan-300/30 to-transparent",
      valueGlow: "drop-shadow-[0_0_8px_rgba(0,229,255,0.25)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className={`
              group kpi-card animated-border neon-pulse fade-up relative
              min-h-[82px]
              overflow-hidden rounded-xl border bg-[#0d1b2e]/90 p-2.5
              backdrop-blur-md transition-all duration-500
              hover:-translate-y-0.5 hover:bg-[#102840]/95
              ${card.border}
              ${card.glow}
            `}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div
              className={`
                pointer-events-none absolute left-0 top-0 h-[2px] w-full
                bg-gradient-to-r opacity-80
                ${card.accent}
              `}
            />

            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/5 blur-2xl transition-all duration-700 group-hover:bg-white/10" />

            <div className="relative z-10 flex items-center justify-between gap-2">
              <p className="text-sm uppercase tracking-[0.22em] text-white/60">
                {card.label}
              </p>

              <div
                className={`
                  breathe shrink-0 rounded-lg border border-white/10 bg-white/5 p-1
                  ${card.iconColor}
                `}
              >
                <Icon size={14} />
              </div>
            </div>

            <p
              className={`
                relative z-10 mt-1.5 text-5xl font-black leading-none text-white
                transition-all duration-500
                ${card.valueGlow}
              `}
            >
              {card.value}
            </p>

            <div className="relative z-10 mt-2 h-0.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={`
                  h-full rounded-full bg-gradient-to-r transition-all duration-700 group-hover:w-full
                  ${card.accent}
                `}
                style={{
                  width: "65%",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
