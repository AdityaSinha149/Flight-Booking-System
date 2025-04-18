import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function DELETE(request) {
  const instanceId = request.nextUrl?.searchParams?.get("instanceId");
  try {
    await db.execute(
      "DELETE FROM flight_instances WHERE instance_id = ?", 
      [instanceId]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}