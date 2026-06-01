# Engineering Control Tower - Google Sheets Edition

Aplicación full stack para visualizar pendientes de ingeniería en Kanban.

## Incluye

- Frontend: Next.js + React + Tailwind
- Backend: Next.js API Routes
- Base de datos: Google Sheets
- Google Apps Script como API
- Drag & drop entre columnas
- KPIs ejecutivos
- Modo TV para oficina
- Semáforo automático por prioridad/fecha

## 1. Instalar

```bash
npm install
npm run dev
```

Abre:

```bash
http://localhost:3000
```

## 2. Crear Google Sheet

Crea un Google Sheet con una pestaña llamada:

```text
Tasks
```

Copia los encabezados de:

```text
google-sheets/sample-data.csv
```

Puedes pegar también los datos de ejemplo.

## 3. Crear backend en Google Apps Script

En tu Google Sheet:

1. Extensions > Apps Script
2. Borra el código existente.
3. Copia todo el contenido de:

```text
google-sheets/Code.gs
```

4. Cambia:

```js
const API_KEY = "CAMBIA_ESTA_CLAVE";
```

por una clave propia. Ejemplo:

```js
const API_KEY = "MiClaveSuperSegura123";
```

5. Deploy > New deployment
6. Type: Web app
7. Execute as: Me
8. Who has access: Anyone
9. Deploy
10. Copia la URL que termina en `/exec`

## 4. Configurar variables de entorno

Crea un archivo:

```bash
.env.local
```

con:

```bash
SHEETS_WEB_APP_URL=https://script.google.com/macros/s/TU_DEPLOYMENT/exec
SHEETS_API_KEY=MiClaveSuperSegura123
```

## 5. Subir a GitHub

```bash
git init
git add .
git commit -m "Initial engineering control tower"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/engineering-control-tower.git
git push -u origin main
```

## 6. Desplegar en Vercel

1. Importa el repo desde Vercel.
2. Agrega las variables de entorno:
   - SHEETS_WEB_APP_URL
   - SHEETS_API_KEY
3. Deploy.

## Columnas Kanban

- Backlog
- In Progress
- Validation
- Completed

## Prioridades

- Critical
- High
- Medium
- Low

## Campos de Google Sheets

```csv
id,title,description,owner,area,project,priority,status,progress,dueDate,createdAt,updatedAt
```
