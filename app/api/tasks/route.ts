import { NextResponse } from "next/server";
import { createTask, getTasks } from "@/lib/sheets";

export async function GET() {
  try {
    const tasks = await getTasks();
    return NextResponse.json({ ok: true, tasks });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const task = await request.json();
    const created = await createTask(task);
    return NextResponse.json({ ok: true, task: created });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
