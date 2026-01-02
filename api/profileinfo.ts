import { neon } from "@neondatabase/serverless";

// Handle POST request — to create or save user
export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert user into database (ignore if already exists)
    await sql`
      INSERT INTO users (name, email, clerk_id)
      VALUES (${name}, ${email}, ${clerkId})
      ON CONFLICT (clerk_id) DO NOTHING;
    `;

    return Response.json(
      { message: "User saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Handle GET request — to fetch user info
export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return Response.json({ error: "Missing clerkId" }, { status: 400 });
    }

    const result = await sql`
      SELECT name, email FROM users WHERE clerk_id = ${clerkId};
    `;

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ data: result[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
