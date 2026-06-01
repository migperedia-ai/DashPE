"use client";

import { useState } from "react";
import type { Priority, Status } from "@/lib/types";

export function AddTaskForm() {
  const [open, setOpen] = useState(false);

  async function onSubmit(formData: FormData) {
    const task = {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      owner: String(formData.get("owner")),
      area: String(formData.get("area")),
      project: String(formData.get("project")),
      priority: String(formData.get("priority")) as Priority,
      status: String(formData.get("status")) as Status,
      progress: Number(formData.get("progress")),
      dueDate: String(formData.get("dueDate")),
    };

    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });

    window.location.reload();
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
      >
        + Nuevo pendiente
      </button>

      {open && (
        <form action={onSubmit} className="mt-4 grid gap-3 rounded-3xl border border-white/10 bg-slate-900 p-5 md:grid-cols-2">
          <input required name="title" placeholder="Título" className="rounded-xl bg-slate-800 p-3" />
          <input required name="owner" placeholder="Responsable" className="rounded-xl bg-slate-800 p-3" />
          <input required name="area" placeholder="Área, ej. PMP" className="rounded-xl bg-slate-800 p-3" />
          <input required name="project" placeholder="Proyecto" className="rounded-xl bg-slate-800 p-3" />
          <input required name="dueDate" type="date" className="rounded-xl bg-slate-800 p-3" />
          <input name="progress" type="number" min="0" max="100" defaultValue="0" className="rounded-xl bg-slate-800 p-3" />
          <select name="priority" className="rounded-xl bg-slate-800 p-3">
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select name="status" className="rounded-xl bg-slate-800 p-3">
            <option>Backlog</option>
            <option>In Progress</option>
            <option>Validation</option>
            <option>Completed</option>
          </select>
          <textarea name="description" placeholder="Descripción" className="rounded-xl bg-slate-800 p-3 md:col-span-2" />
          <button className="rounded-xl bg-emerald-400 p-3 font-bold text-slate-950 md:col-span-2">Guardar</button>
        </form>
      )}
    </div>
  );
}
