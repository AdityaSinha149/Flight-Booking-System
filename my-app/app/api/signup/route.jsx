import pool from "@/models/prisma";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Missing fields." }), {
        status: 400,
      });
    }
    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    await pool.query(query, [email, password]);
    return new Response(JSON.stringify({ message: "Signup successful." }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "An error occurred." }), {
      status: 500,
    });
  }
}
