import { AddTaskForm } from "@/components/AddTaskForm";
import { KanbanBoard } from "@/components/KanbanBoard";
import { KpiCards } from "@/components/KpiCards";
import { getTasks } from "@/lib/sheets";
import { AutoRefresh } from "@/components/AutoRefresh";

export const dynamic = "force-dynamic";

function AutoRefresh() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          setInterval(function() {
            window.location.reload();
          }, 60000);
        `,
      }}
    />
  );
}

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
      <AutoRefresh />

      <header className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-lg font-semibold uppercase tracking-[0.55em] text-cyan-300">PE Visual Management</p>
          <h1 className="mt-2 text-3xl font-black leading-none tracking-tight xl:text-6xl">Process Engineering Control Task</h1>
          <p className="mt-2 text-lg text-white/75">
            Visual monitoring of projects, HECN, improvements and engineering actions.
          </p>
        </div>
        <a href="/tv" className="rounded-2xl border border-white/20 px-5 py-3 text-center font-bold hover:bg-white/10">
          TV MODE
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