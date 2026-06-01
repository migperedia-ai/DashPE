import type { EngineeringTask } from "./types";

const SHEETS_WEB_APP_URL = process.env.SHEETS_WEB_APP_URL;
const SHEETS_API_KEY = process.env.SHEETS_API_KEY;

function assertConfig() {
  if (!SHEETS_WEB_APP_URL) {
    throw new Error("Missing SHEETS_WEB_APP_URL in environment variables.");
  }
}

async function callSheets(action: string, payload: Record<string, unknown> = {}) {
  assertConfig();

  const res = await fetch(SHEETS_WEB_APP_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      apiKey: SHEETS_API_KEY,
      action,
      ...payload,
    }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || data.ok === false) {
    throw new Error(data.error || "Google Sheets request failed");
  }

  return data;
}

export async function getTasks(): Promise<EngineeringTask[]> {
  const data = await callSheets("listTasks");
  return data.tasks;
}

export async function createTask(task: Omit<EngineeringTask, "id">) {
  const data = await callSheets("createTask", { task });
  return data.task as EngineeringTask;
}

export async function updateTask(id: string, patch: Partial<EngineeringTask>) {
  const data = await callSheets("updateTask", { id, patch });
  return data.task as EngineeringTask;
}

export async function deleteTask(id: string) {
  const data = await callSheets("deleteTask", { id });
  return data;
}
