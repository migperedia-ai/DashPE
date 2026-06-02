import { CalendarDays, UserRound } from "lucide-react";
import type { EngineeringTask } from "@/lib/types";
import { daysLeft, healthColor } from "@/lib/utils";

const defaultTheme = {
  border: "border-cyan-300/40",
  bg: "bg-[#0d1b2e]/90",
  badge: "bg-cyan-400/10 text-cyan-100 border-cyan-300/25",
  glow: "shadow-[0_0_28px_rgba(0,229,255,0.12)]",
  progress: "from-cyan-300 to-cyan-200",
};

const priorityClasses = {
  Critical: {
    border: "border-red-400/40",
    bg: "bg-red-500/[0.06]",
    badge: "bg-red-500/15 text-red-200 border-red-400/30",
    glow: "shadow-[0_0_28px_rgba(255,77,109,0.10)]",
    progress: "from-red-400 to-red-300",
  },
  High: {
    border: "border-orange-300/40",
    bg: "bg-orange-500/[0.06]",
    badge: "bg-orange-500/15 text-orange-100 border-orange-300/30",
    glow: "shadow-[0_0_28px_rgba(255,159,28,0.10)]",
    progress: "from-orange-300 to-orange-200",
  },
  Medium: {
    border: "border-yellow-300/40",
    bg: "bg-yellow-500/[0.06]",
    badge: "bg-yellow-500/15 text-yellow-100 border-yellow-300/30",
    glow: "shadow-[0_0_28px_rgba(255,214,10,0.10)]",
    progress: "from-yellow-300 to-yellow-200",
  },
  Low: {
    border: "border-emerald-300/40",
    bg: "bg-emerald-500/[0.06]",
    badge: "bg-emerald-500/15 text-emerald-100 border-emerald-300/30",
    glow: "shadow-[0_0_28px_rgba(0,255,153,0.10)]",
    progress: "from-emerald-300 to-emerald-200",
  },
};

export function TaskCard({ task }: { task: EngineeringTask }) {
  const left = daysLeft(task.dueDate);

  const theme =
    priorityClasses[task.priority as keyof typeof priorityClasses] ??
    defaultTheme;

  const progress = Number(task.progress || 0);

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        p-3
        backdrop-blur-md
        transition-all
        duration-500
        hover:-translate-y-0.5
        hover:scale-[1.005]
        ${theme.border}
        ${theme.bg}
        ${theme.glow}
      `}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-20 w-20 rounded-full bg-white/[0.04] blur-2xl transition-all duration-700 group-hover:bg-white/[0.08]" />

      <div className="relative z-10 mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-[9px] uppercase tracking-[0.24em] text-white/40">
            {task.area || "AREA"}
          </p>

          <h3 className="mt-0.5 text-base font-bold leading-tight text-white">
            {task.title || "Untitled Task"}
          </h3>
        </div>

        <span
          className={`
            breathe
            h-3
            w-3
            shrink-0
            rounded-full
            ${healthColor(task)}
          `}
        />
      </div>

      <p className="relative z-10 mb-3 line-clamp-2 text-xs leading-snug text-white/70">
        {task.description || "No description"}
      </p>

      <div className="relative z-10 mb-3 flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-white/70">
          {task.project || "No Project"}
        </span>

        <span
          className={`
            rounded-full
            border
            px-2.5
            py-0.5
            font-semibold
            ${theme.badge}
          `}
        >
          {task.priority || "No Priority"}
        </span>
      </div>

      <div className="relative z-10 mb-3">
        <div className="mb-1 flex items-center justify-between text-[10px] text-white/40">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
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
              width: `${Math.max(0, Math.min(progress, 100))}%`,
            }}
          />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[11px] text-white/60">
        <span className="flex items-center gap-1.5">
          <UserRound size={12} />
          {task.owner || "No Owner"}
        </span>

        <span className="flex items-center gap-1.5">
          <CalendarDays size={12} />

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