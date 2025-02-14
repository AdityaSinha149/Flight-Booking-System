export async function GET() {
    const locations = ["New York", "Los Angeles", "Chicago", "San Francisco"];
    return Response.json(locations);
  }
  