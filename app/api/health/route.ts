import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "Engineering Control Tower",
    database: "Google Sheets",
  });
}
