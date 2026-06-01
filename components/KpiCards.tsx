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
      glow: "shadow-[0_0_35px_rgba(255,77,109,0.20)]",
      iconColor: "text-red-300",
      accent: "from-red-400/80 via-red-300/30 to-transparent",
      valueGlow: "drop-shadow-[0_0_14px_rgba(255,77,109,0.35)]",
    },
    {
      label: "OVERDUE TASKS",
      value: late,
      icon: Clock3,
      border: "border-orange-300/40",
      glow: "shadow-[0_0_35px_rgba(255,159,28,0.20)]",
      iconColor: "text-orange-300",
      accent: "from-orange-300/80 via-orange-300/30 to-transparent",
      valueGlow: "drop-shadow-[0_0_14px_rgba(255,159,28,0.35)]",
    },
    {
      label: "COMPLETED",
      value: completed,
      icon: CheckCircle2,
      border: "border-emerald-300/40",
      glow: "shadow-[0_0_35px_rgba(0,255,153,0.20)]",
      iconColor: "text-emerald-300",
      accent: "from-emerald-300/80 via-emerald-300/30 to-transparent",
      valueGlow: "drop-shadow-[0_0_14px_rgba(0,255,153,0.35)]",
    },
    {
      label: "COMPLETION RATE",
      value: `${completion}%`,
      icon: KanbanSquare,
      border: "border-cyan-300/40",
      glow: "shadow-[0_0_35px_rgba(0,229,255,0.20)]",
      iconColor: "text-cyan-300",
      accent: "from-cyan-300/80 via-cyan-300/30 to-transparent",
      valueGlow: "drop-shadow-[0_0_14px_rgba(0,229,255,0.35)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className={`
              group
              kpi-card
              animated-border
              neon-pulse
              fade-up
              relative
              overflow-hidden
              rounded-3xl
              border
              bg-[#0d1b2e]/90
              p-5
              backdrop-blur-md
              ${card.border}
              ${card.glow}
              transition-all
              duration-500
              hover:-translate-y-1
              hover:scale-[1.015]
              hover:bg-[#102840]/95
            `}
            style={{
              animationDelay: `${index * 120}ms`,
            }}
          >
            <div
              className={`
                pointer-events-none
                absolute
                left-0
                top-0
                h-[2px]
                w-full
                bg-gradient-to-r
                ${card.accent}
                opacity-80
              `}
            />

            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl transition-all duration-700 group-hover:bg-white/10" />

            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.30em] text-white/60">
                {card.label}
              </p>

              <div
                className={`
                  breathe
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-2
                  ${card.iconColor}
                `}
              >
                <Icon size={24} />
              </div>
            </div>

            <p
              className={`
                mt-4
                text-6xl
                font-black
                text-white
                transition-all
                duration-500
                group-hover:tracking-wide
                ${card.valueGlow}
              `}
            >
              {card.value}
            </p>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={`
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  ${card.accent}
                  transition-all
                  duration-700
                  group-hover:w-full
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
