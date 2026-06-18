import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "livres", "test.txt");
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to read test.txt file",
        message: error.message,
        path: filePath,
      },
      { status: 500 }
    );
  }
}
