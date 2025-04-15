import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT * FROM airports");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
