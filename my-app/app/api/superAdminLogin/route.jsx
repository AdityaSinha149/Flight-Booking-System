import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { password } = await request.json();
    if (password === "Sinhaa") {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch (error) {
    console.error("Super Admin Login Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
