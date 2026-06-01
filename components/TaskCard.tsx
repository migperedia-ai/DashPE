import { CalendarDays, UserRound } from "lucide-react";
import type { EngineeringTask } from "@/lib/types";
import { daysLeft, healthColor } from "@/lib/utils";

const priorityClasses = {
  Critical: "border-red-500/80 bg-red-500/10 text-red-100",
  High: "border-orange-400/80 bg-orange-500/10 text-orange-100",
  Medium: "border-yellow-300/80 bg-yellow-500/10 text-yellow-100",
  Low: "border-sky-400/80 bg-sky-500/10 text-sky-100",
};

export function TaskCard({ task }: { task: EngineeringTask }) {
  const left = daysLeft(task.dueDate);

  return (
    <div className={`rounded-2xl border p-4 ${priorityClasses[task.priority]} tv-card`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{task.area}</p>
          <h3 className="mt-1 text-lg font-bold leading-tight text-white">{task.title}</h3>
        </div>
        <span className={`h-4 w-4 shrink-0 rounded-full ${healthColor(task)}`} />
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-slate-300">{task.description}</p>

      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-white/10 px-2 py-1">{task.project}</span>
        <span className="rounded-full bg-white/10 px-2 py-1">{task.priority}</span>
      </div>

      <div className="mb-3 h-2 rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-white"
          style={{ width: `${Math.max(0, Math.min(task.progress, 100))}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1">
          <UserRound size={14} /> {task.owner}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays size={14} />
          {left < 0 ? `${Math.abs(left)} días tarde` : `${left} días`}
        </span>
      </div>
    </div>
  );
}
