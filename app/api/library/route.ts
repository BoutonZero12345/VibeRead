import { NextResponse } from "next/server";
import { getAvailableBooks } from "@/lib/server/library";

export async function GET() {
  try {
    const books = getAvailableBooks();
    return NextResponse.json(books);
  } catch (error) {
    return new NextResponse("Error reading library", { status: 500 });
  }
}
