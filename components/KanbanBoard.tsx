"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { EngineeringTask, Status } from "@/lib/types";
import { statuses, sortTasks } from "@/lib/utils";
import { TaskCard } from "./TaskCard";

export function KanbanBoard({
  initialTasks,
}: {
  initialTasks: EngineeringTask[];
}) {
  const [tasks, setTasks] = useState(initialTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const grouped = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = sortTasks(
        tasks.filter((task) => task.status === status)
      );
      return acc;
    }, {} as Record<Status, EngineeringTask[]>);
  }, [tasks]);

  async function onDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id);
    const newStatus = event.over?.id as Status | undefined;

    if (!newStatus || !statuses.includes(newStatus)) return;

    const oldTask = tasks.find((task) => task.id === taskId);

    if (!oldTask || oldTask.status === newStatus) return;

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: newStatus,
      }),
    });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        {statuses.map((status, index) => (
          <Column
            key={status}
            status={status}
            tasks={grouped[status]}
            index={index}
          />
        ))}
      </div>
    </DndContext>
  );
}

function Column({
  status,
  tasks,
  index,
}: {
  status: Status;
  tasks: EngineeringTask[];
  index: number;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const columnTheme: Record<
    string,
    {
      border: string;
      glow: string;
      accent: string;
      badge: string;
      dot: string;
    }
  > = {
    "In Queue": {
      border: "border-red-400/40",
      glow: "shadow-[0_0_40px_rgba(255,77,109,0.14)]",
      accent:
        "from-red-400/90 via-red-300/35 to-transparent",
      badge:
        "bg-red-400/10 text-red-100 border-red-300/25",
      dot: "bg-red-300",
    },

    "In Progress": {
      border: "border-orange-300/40",
      glow:
        "shadow-[0_0_40px_rgba(255,159,28,0.14)]",
      accent:
        "from-orange-300/90 via-orange-300/35 to-transparent",
      badge:
        "bg-orange-400/10 text-orange-100 border-orange-300/25",
      dot: "bg-orange-300",
    },

    Validation: {
      border: "border-cyan-300/40",
      glow:
        "shadow-[0_0_40px_rgba(0,229,255,0.14)]",
      accent:
        "from-cyan-300/90 via-cyan-300/35 to-transparent",
      badge:
        "bg-cyan-400/10 text-cyan-100 border-cyan-300/25",
      dot: "bg-cyan-300",
    },

    Completed: {
      border: "border-emerald-300/40",
      glow:
        "shadow-[0_0_40px_rgba(0,255,153,0.14)]",
      accent:
        "from-emerald-300/90 via-emerald-300/35 to-transparent",
      badge:
        "bg-emerald-400/10 text-emerald-100 border-emerald-300/25",
      dot: "bg-emerald-300",
    },
  };

  const theme =
  columnTheme[String(status)] ??
  {
    border: "border-cyan-300/40",
    glow: "shadow-[0_0_40px_rgba(0,229,255,0.14)]",
    accent: "from-cyan-300/90 via-cyan-300/35 to-transparent",
    badge: "bg-cyan-400/10 text-cyan-100 border-cyan-300/25",
    dot: "bg-cyan-300",
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        group
        animated-border
        neon-pulse
        fade-up
        relative
        min-h-[620px]
        overflow-hidden
        rounded-3xl
        border
        bg-[#0d1b2e]/90
        p-4
        backdrop-blur-md
        transition-all
        duration-500
        ${theme.border}
        ${theme.glow}
        ${
          isOver
            ? "scale-[1.018] bg-[#102840]/95 shadow-[0_0_65px_rgba(0,229,255,0.26)]"
            : "hover:-translate-y-1 hover:bg-[#102840]/85"
        }
      `}
      style={{
        animationDelay: `${index * 140}ms`,
      }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-emerald-300/5 blur-3xl" />

      <div
        className={`
          absolute
          left-0
          top-0
          h-[2px]
          w-full
          bg-gradient-to-r
          ${theme.accent}
        `}
      />

      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
            ENGINEERING STATUS
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`breathe h-2.5 w-2.5 rounded-full ${theme.dot}`}
            />

            <h2 className="text-xl font-black text-white">
              {status}
            </h2>
          </div>
        </div>

        <span
          className={`
            breathe
            rounded-full
            border
            px-3
            py-1
            text-sm
            font-bold
            ${theme.badge}
          `}
        >
          {tasks.length}
        </span>
      </div>

      <div className="relative z-10 max-h-[620px] space-y-3 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-center text-sm text-white/40">
            No Tasks
          </div>
        ) : (
          tasks.map((task) => (
            <DraggableCard
              key={task.id}
              task={task}
            />
          ))
        )}
      </div>
    </div>
  );
}

function DraggableCard({
  task,
}: {
  task: EngineeringTask;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        cursor-grab
        transition-all
        duration-300
        active:cursor-grabbing
        ${
          isDragging
            ? "z-50 scale-[1.035] opacity-85 shadow-[0_0_55px_rgba(0,229,255,0.30)]"
            : "hover:-translate-y-1"
        }
      `}
    >
      <TaskCard task={task} />
    </div>
  );
}
