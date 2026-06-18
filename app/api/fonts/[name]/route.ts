import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const safeName = path.basename(name);
    const filePath = path.join(process.cwd(), "opendyslexic-0.92", safeName);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Font file not found", { status: 404 });
    }

    const data = fs.readFileSync(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "font/opentype",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Error reading local font file", { status: 500 });
  }
}
