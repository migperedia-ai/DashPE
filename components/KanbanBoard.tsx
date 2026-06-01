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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

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
      current.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {statuses.map((status) => (
          <Column key={status} status={status} tasks={grouped[status]} />
        ))}
      </div>
    </DndContext>
  );
}

function Column({ status, tasks }: { status: Status; tasks: EngineeringTask[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[620px] rounded-3xl border p-4 transition ${
        isOver ? "border-cyan-300 bg-cyan-950/50" : "border-white/10 bg-slate-900/80"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-white">{status}</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm">{tasks.length}</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <DraggableCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

function DraggableCard({ task }: { task: EngineeringTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab ${isDragging ? "z-50 opacity-70" : ""}`}
    >
      <TaskCard task={task} />
    </div>
  );
}
