import { KanbanBoard } from "@/components/KanbanBoard";
import { KpiCards } from "@/components/KpiCards";
import { getTasks } from "@/lib/sheets";

export const dynamic = "force-dynamic";

export default async function TvMode() {
  let tasks: any[] = [];
  let error = "";

  try {
    tasks = await getTasks();
  } catch (err) {
    error = err instanceof Error ? err.message : "No se pudo cargar Google Sheets";
  }

  return (
    <main className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#1e3a8a_0,#020617_45%)] text-white">
      <div className="h-full p-4">
        <header className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-lg font-semibold uppercase tracking-[0.55em] text-cyan-300">
              PE Visual Management
            </p>

            <h1 className="mt-2 text-8xl font-black leading-none tracking-tight">
              Process Engineering Control Task
            </h1>

            <p className="mt-2 max-w-4xl text-lg text-slate-300">
              Visual monitoring of projects, HECN, improvements and engineering actions.
            </p>
          </div>

          <a
            href="/"
            className="rounded-xl border border-white/20 px-6 py-3 text-sm font-bold hover:bg-white/10"
          >
            DASHBOARD MODE
          </a>
        </header>

        {error ? (
          <section className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
            <h2 className="text-xl font-bold">Google Sheets connection error</h2>
            <p className="mt-2 text-sm text-red-100">{error}</p>
          </section>
        ) : (
          <div className="space-y-4">
            <KpiCards tasks={tasks} />
            <KanbanBoard initialTasks={tasks} />
          </div>
        )}
      </div>
    </main>
  );
}
