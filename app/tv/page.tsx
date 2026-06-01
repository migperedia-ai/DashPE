import { KanbanBoard } from "@/components/KanbanBoard";
import { KpiCards } from "@/components/KpiCards";
import { getTasks } from "@/lib/sheets";

export const dynamic = "force-dynamic";

export default async function TvMode() {
  const tasks = await getTasks();

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-lg uppercase tracking-[0.45em] text-cyan-300">Office TV Mode</p>
          <h1 className="text-6xl font-black">Engineering Control Tower</h1>
        </div>
        <p className="rounded-full bg-white/10 px-5 py-3 text-xl">
          Auto refresh: Vercel/Browser
        </p>
      </div>
      <div className="space-y-6">
        <KpiCards tasks={tasks} />
        <KanbanBoard initialTasks={tasks} />
      </div>
    </main>
  );
}
