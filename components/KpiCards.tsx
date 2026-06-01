import { AlertTriangle, CheckCircle2, Clock3, KanbanSquare } from "lucide-react";
import type { EngineeringTask } from "@/lib/types";
import { daysLeft } from "@/lib/utils";

export function KpiCards({ tasks }: { tasks: EngineeringTask[] }) {
  const critical = tasks.filter((t) => t.priority === "Critical" && t.status !== "Completed").length;
  const late = tasks.filter((t) => {
  const left = daysLeft(t.dueDate);
  return t.status !== "Completed" && left !== null && left < 0;
}).length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const total = tasks.length;
  const completion = total ? Math.round((completed / total) * 100) : 0;

  const cards = [
    { label: "OPEN CRITICALS", value: critical, icon: AlertTriangle },
    { label: "OVERDUE TASKS", value: late, icon: Clock3 },
    { label: "COMPLETED", value: completed, icon: CheckCircle2 },
    { label: "COMPLETION RATE", value: `${completion}%`, icon: KanbanSquare },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{card.label}</p>
              <Icon className="text-slate-300" />
            </div>
            <p className="mt-4 text-5xl font-black">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
