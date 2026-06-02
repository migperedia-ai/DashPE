import { CalendarDays, UserRound } from "lucide-react";
import type { EngineeringTask } from "@/lib/types";
import { daysLeft, healthColor } from "@/lib/utils";

const priorityClasses = {
  Critical: {
    border: "border-red-400/40",
    bg: "bg-red-500/[0.06]",
    badge: "bg-red-500/15 text-red-200 border-red-400/30",
    glow: "shadow-[0_0_35px_rgba(255,77,109,0.12)]",
    progress: "from-red-400 to-red-300",
  },
  High: {
    border: "border-orange-300/40",
    bg: "bg-orange-500/[0.06]",
    badge: "bg-orange-500/15 text-orange-100 border-orange-300/30",
    glow: "shadow-[0_0_35px_rgba(255,159,28,0.12)]",
    progress: "from-orange-300 to-orange-200",
  },
  Medium: {
    border: "border-yellow-300/40",
    bg: "bg-yellow-500/[0.06]",
    badge: "bg-yellow-500/15 text-yellow-100 border-yellow-300/30",
    glow: "shadow-[0_0_35px_rgba(255,214,10,0.10)]",
    progress: "from-yellow-300 to-yellow-200",
  },
  Low: {
    border: "border-emerald-300/40",
    bg: "bg-emerald-500/[0.06]",
    badge: "bg-emerald-500/15 text-emerald-100 border-emerald-300/30",
    glow: "shadow-[0_0_35px_rgba(0,255,153,0.10)]",
    progress: "from-emerald-300 to-emerald-200",
  },
};

export function TaskCard({ task }: { task: EngineeringTask }) {
  const left = daysLeft(task.dueDate);
  const theme = priorityClasses[task.priority];

return (
  <div
    className={`
      group
      animated-border
      neon-pulse
      relative
      overflow-hidden
      rounded-3xl
      border
      p-4
      backdrop-blur-md
      transition-all
      duration-500
      hover:-translate-y-1
      hover:scale-[1.01]

      ${theme?.border ?? "border-cyan-300/40"}
      ${theme?.bg ?? "bg-[#0d1b2e]/90"}
      ${theme?.glow ?? "shadow-[0_0_40px_rgba(0,229,255,0.14)]"}
    `}
  >
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/[0.04] blur-3xl transition-all duration-700 group-hover:bg-white/[0.08]" />

      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
            {task.area}
          </p>

          <h3 className="mt-1 text-lg font-bold leading-tight text-white">
            {task.title}
          </h3>
        </div>

        <span
          className={`
            breathe
            h-4
            w-4
            shrink-0
            rounded-full
            ${healthColor(task)}
          `}
        />
      </div>

      <p className="mb-4 line-clamp-2 text-sm text-white/70">
        {task.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
          {task.project}
        </span>

        <span
          className={`
            rounded-full
            border
            px-3
            py-1
            font-semibold
            ${theme.badge}
          `}
        >
          {task.priority}
        </span>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-[11px] text-white/40">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className={`
              h-full
              rounded-full
              bg-gradient-to-r
              ${theme.progress}
              transition-all
              duration-700
            `}
            style={{
              width: `${Math.max(0, Math.min(task.progress, 100))}%`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-white/60">
        <span className="flex items-center gap-2">
          <UserRound size={14} />
          {task.owner}
        </span>

        <span className="flex items-center gap-2">
          <CalendarDays size={14} />

          {left === null
            ? "No due date"
            : left < 0
            ? `${Math.abs(left)} days late`
            : `${left} days`}
        </span>
      </div>
    </div>
  );
}
