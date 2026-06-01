/*
Engineering Control Tower - Google Sheets Backend

1. Crea un Google Sheet.
2. Crea una pestaña llamada: Tasks
3. Pega los encabezados de sample-data.csv
4. Extensions > Apps Script
5. Pega este archivo en Code.gs
6. Cambia API_KEY por una clave tuya.
7. Deploy > New deployment > Web app
8. Execute as: Me
9. Who has access: Anyone
10. Copia la URL en SHEETS_WEB_APP_URL
*/

const API_KEY = "CAMBIA_ESTA_CLAVE";
const SHEET_NAME = "Tasks";

const HEADERS = [
  "id",
  "title",
  "description",
  "owner",
  "area",
  "project",
  "priority",
  "status",
  "progress",
  "dueDate",
  "createdAt",
  "updatedAt"
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");

    if (API_KEY && body.apiKey !== API_KEY) {
      return json({ ok: false, error: "Invalid API key" });
    }

    switch (body.action) {
      case "listTasks":
        return json({ ok: true, tasks: listTasks() });
      case "createTask":
        return json({ ok: true, task: createTask(body.task) });
      case "updateTask":
        return json({ ok: true, task: updateTask(body.id, body.patch) });
      case "deleteTask":
        deleteTask(body.id);
        return json({ ok: true });
      default:
        return json({ ok: false, error: "Unknown action" });
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function listTasks() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) return [];

  const headers = values[0];

  return values.slice(1)
    .filter(row => row[0])
    .map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      obj.progress = Number(obj.progress || 0);
      return obj;
    });
}

function createTask(task) {
  const sheet = getSheet();
  const now = new Date().toISOString();
  const created = {
    id: Utilities.getUuid(),
    title: task.title || "",
    description: task.description || "",
    owner: task.owner || "",
    area: task.area || "",
    project: task.project || "",
    priority: task.priority || "Medium",
    status: task.status || "Backlog",
    progress: Number(task.progress || 0),
    dueDate: task.dueDate || "",
    createdAt: now,
    updatedAt: now,
  };

  sheet.appendRow(HEADERS.map(h => created[h]));
  return created;
}

function updateTask(id, patch) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("id");

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      const current = {};
      headers.forEach((h, index) => current[h] = values[i][index]);

      const updated = {
        ...current,
        ...patch,
        id,
        progress: Number(patch.progress ?? current.progress ?? 0),
        updatedAt: new Date().toISOString(),
      };

      sheet.getRange(i + 1, 1, 1, HEADERS.length).setValues([HEADERS.map(h => updated[h])]);
      return updated;
    }
  }

  throw new Error("Task not found");
}

function deleteTask(id) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("id");

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }

  throw new Error("Task not found");
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
