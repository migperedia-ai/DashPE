export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Status = "Backlog" | "In Progress" | "Validation" | "Completed";

export type EngineeringTask = {
  id: string;
  title: string;
  description: string;
  owner: string;
  area: string;
  project: string;
  priority: Priority;
  status: Status;
  progress: number;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
};
