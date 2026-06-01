import { AddTaskForm } from "@/components/AddTaskForm";
import { KanbanBoard } from "@/components/KanbanBoard";
import { KpiCards } from "@/components/KpiCards";
import { getTasks } from "@/lib/sheets";

export const dynamic = "force-dynamic";

export default async function Home() {
  let tasks: any[] = [];
  let error = "";

  try {
    tasks = await getTasks();
  } catch (err) {
    error = err instanceof Error ? err.message : "No se pudo cargar Google Sheets";
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1e3a8a_0,#020617_45%)] p-6 text-white xl:p-10">
      <header className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.45em] text-cyan-300">Visual Management</p>
          <h1 className="mt-2 text-4xl font-black xl:text-6xl">Engineering Control Tower</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Kanban para pendientes de ingeniería con base de datos en Google Sheets.
          </p>
        </div>
        <a href="/tv" className="rounded-2xl border border-white/20 px-5 py-3 text-center font-bold hover:bg-white/10">
          TV Mode
        </a>
      </header>

      {error ? (
        <section className="rounded-3xl border border-red-500/40 bg-red-500/10 p-6">
          <h2 className="text-2xl font-bold">Falta configurar Google Sheets</h2>
          <p className="mt-2 text-red-100">{error}</p>
          <p className="mt-4 text-slate-200">
            Revisa el README.md y configura SHEETS_WEB_APP_URL y SHEETS_API_KEY en .env.local.
          </p>
        </section>
      ) : (
        <div className="space-y-6">
          <KpiCards tasks={tasks} />
          <AddTaskForm />
          <KanbanBoard initialTasks={tasks} />
        </div>
      )}
    </main>
  );
}
