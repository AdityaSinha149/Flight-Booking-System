import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

export async function DELETE(request) {
  const instanceId = request.nextUrl?.searchParams?.get("instanceId");
  try {
    await pool.query(
      "DELETE FROM flight_instances WHERE instance_id = $1",
      [instanceId]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}