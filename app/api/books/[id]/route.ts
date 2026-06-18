import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAvailableBooks } from "@/lib/server/library";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id.replace(/\.epub$/, "");
    const numericId = parseInt(cleanId, 10);

    const availableBooks = getAvailableBooks();
    const book = availableBooks.find((b) => b.id === numericId);

    if (!book || !book.fileName) {
      return new NextResponse("Book not found or not available", { status: 404 });
    }

    const livresDir = path.join(process.cwd(), "livres");
    const filePath = path.join(livresDir, book.fileName);
    
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found on disk", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/epub+zip",
        "Cache-Control": "public, max-age=600, no-transform",
      },
    });
  } catch (error) {
    return new NextResponse("Error reading epub file", { status: 500 });
  }
}
