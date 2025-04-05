import { NextResponse } from "next/server";

export async function POST(request) {
  const { password } = await request.json();

  if (password === "Sinhaa") {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  }
}
