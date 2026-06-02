import type { EngineeringTask, Priority } from "./types";

export const priorities: Priority[] = ["Critical", "High", "Medium", "Low"];
export const statuses = ["Backlog", "In Progress", "Validation", "Completed"] as const;

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function priorityWeight(priority: Priority) {
  return {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  }[priority];
}

export function daysLeft(dueDate: string | null | undefined) {
  if (!dueDate) return null;

  const cleanDate = String(dueDate).split("T")[0].trim();
  const due = new Date(`${cleanDate}T23:59:59`);

  if (isNaN(due.getTime())) return null;

  const now = new Date();

  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function healthColor(task: EngineeringTask) {
  if (task.status === "Completed") return "bg-emerald-500";

  const left = daysLeft(task.dueDate);

  if (left === null) return "bg-slate-500";
  if (left <= 2 || task.priority === "Critical") return "bg-red-500";
  if (left <= 5 || task.priority === "High") return "bg-amber-400";

  return "bg-emerald-500";
}

export function sortTasks(tasks: EngineeringTask[]) {
  return [...tasks].sort((a, b) => {
    const p = priorityWeight(b.priority) - priorityWeight(a.priority);
    if (p !== 0) return p;

    const dateA = daysLeft(a.dueDate);
    const dateB = daysLeft(b.dueDate);

    if (dateA === null) return 1;
    if (dateB === null) return -1;

    return dateA - dateB;
  });
}
