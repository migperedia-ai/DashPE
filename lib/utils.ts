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

export function daysLeft(dueDate: string) {
  const now = new Date();
  const due = new Date(`${dueDate}T23:59:59`);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function healthColor(task: EngineeringTask) {
  if (task.status === "Completed") return "bg-emerald-500";
  const left = daysLeft(task.dueDate);
  if (left <= 2 || task.priority === "Critical") return "bg-red-500";
  if (left <= 5 || task.priority === "High") return "bg-amber-400";
  return "bg-emerald-500";
}

export function sortTasks(tasks: EngineeringTask[]) {
  return [...tasks].sort((a, b) => {
    const p = priorityWeight(b.priority) - priorityWeight(a.priority);
    if (p !== 0) return p;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}
