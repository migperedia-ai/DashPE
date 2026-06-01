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

  const completed = tasks.filter(
    (t) => t.status === "Completed"
  ).length;

  const total = tasks.length;
  const completion = total ? Math.round((completed / total) * 100) : 0;

  const cards = [
    {
      label: "OPEN CRITICALS",
      value: critical,
      icon: AlertTriangle,
      color: "border-red-500/30",
      glow: "shadow-[0_0_30px_rgba(255,77,109,0.15)]",
      iconColor: "text-red-400",
    },
    {
      label: "OVERDUE TASKS",
      value: late,
      icon: Clock3,
      color: "border-orange-400/30",
      glow: "shadow-[0_0_30px_rgba(255,159,28,0.15)]",
      iconColor: "text-orange-300",
    },
    {
      label: "COMPLETED",
      value: completed,
      icon: CheckCircle2,
      color: "border-emerald-400/30",
      glow: "shadow-[0_0_30px_rgba(0,255,153,0.15)]",
      iconColor: "text-emerald-300",
    },
    {
      label: "COMPLETION RATE",
      value: `${completion}%`,
      icon: KanbanSquare,
      color: "border-cyan-400/30",
      glow: "shadow-[0_0_30px_rgba(0,229,255,0.15)]",
      iconColor: "text-cyan-300",
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
              kpi-card
              neon-pulse
              fade-up
              rounded-3xl
              border
              bg-[#0d1b2e]/90
              backdrop-blur-md
              p-5
              ${card.color}
              ${card.glow}
              transition-all
              duration-300
              hover:-translate-y-1
            `}
            style={{
              animationDelay: `${index * 120}ms`,
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.30em] text-white/60">
                {card.label}
              </p>

              <Icon
                size={24}
                className={`${card.iconColor} animate-pulse`}
              />
            </div>

            <p className="mt-4 text-6xl font-black text-white">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
