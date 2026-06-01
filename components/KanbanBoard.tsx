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

export function KanbanBoard({ initialTasks }: { initialTasks: EngineeringTask[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const grouped = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = sortTasks(tasks.filter((task) => task.status === status));
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
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
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
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const columnStyles: Record<string, string> = {
    "In Queue": "from-red-400/70 via-red-300/20 to-transparent border-red-400/30",
    "In Progress": "from-orange-300/70 via-orange-300/20 to-transparent border-orange-300/30",
    Validation: "from-cyan-300/70 via-cyan-300/20 to-transparent border-cyan-300/30",
    Completed: "from-emerald-300/70 via-emerald-300/20 to-transparent border-emerald-300/30",
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        animated-border
        fade-up
        relative
        min-h-[620px]
        overflow-hidden
        rounded-3xl
        border
        bg-[#0d1b2e]/85
        p-4
        backdrop-blur-md
        transition-all
        duration-500
        ${columnStyles[status]}
        ${
          isOver
            ? "scale-[1.015] border-cyan-300/70 bg-[#102840]/95 shadow-[0_0_45px_rgba(0,229,255,0.20)]"
            : "shadow-[0_0_30px_rgba(0,229,255,0.08)]"
        }
      `}
      style={{
        animationDelay: `${index * 140}ms`,
      }}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />

      <div
        className={`
          absolute
          left-0
          top-0
          h-[2px]
          w-full
          bg-gradient-to-r
          ${columnStyles[status]}
        `}
      />

      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
            Engineering Status
          </p>
          <h2 className="mt-1 text-xl font-black text-white">{status}</h2>
        </div>

        <span className="breathe rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-bold text-white">
          {tasks.length}
        </span>
      </div>

      <div className="relative z-10 max-h-[620px] space-y-3 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-center text-sm text-white/40">
            No tasks
          </div>
        ) : (
          tasks.map((task) => <DraggableCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

function DraggableCard({ task }: { task: EngineeringTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

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
            ? "z-50 scale-[1.03] opacity-80 shadow-[0_0_40px_rgba(0,229,255,0.25)]"
            : "hover:-translate-y-1"
        }
      `}
    >
      <TaskCard task={task} />
    </div>
  );
}
