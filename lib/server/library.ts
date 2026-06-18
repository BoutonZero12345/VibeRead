import fs from "fs";
import path from "path";

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  fileName?: string;
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function getAvailableBooks(): Book[] {
  const livresDir = path.join(process.cwd(), "livres");
  const jsonPath = path.join(livresDir, "all_books.json");
  if (!fs.existsSync(jsonPath) || !fs.existsSync(livresDir)) return [];

  const allBooks: Book[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8")).books;
  const files = fs.readdirSync(livresDir).filter((f) => f.endsWith(".epub"));
  const matched: Book[] = [];

  for (const file of files) {
    const lastParen = file.lastIndexOf("(");
    if (lastParen === -1) continue;
    const rawTitle = file.substring(0, lastParen).trim();
    const rawAuthor = file.substring(lastParen + 1, file.lastIndexOf(")")).trim();

    const normFileTitle = normalize(rawTitle);
    const normFileAuthor = normalize(rawAuthor);

    let bestBook: Book | null = null;
    let maxScore = 0;

    for (const b of allBooks) {
      const normBookTitle = normalize(b.title);
      const normBookAuthor = normalize(b.author);

      let score = 0;
      if (normBookTitle === normFileTitle) score += 10;
      else if (normBookTitle.includes(normFileTitle) || normFileTitle.includes(normBookTitle)) score += 5;

      if (normBookAuthor === normFileAuthor) score += 5;
      else if (normBookAuthor.includes(normFileAuthor) || normFileAuthor.includes(normBookAuthor)) score += 2;

      if (score > maxScore && score >= 5) {
        maxScore = score;
        bestBook = b;
      }
    }

    if (bestBook) {
      matched.push({ ...bestBook, fileName: file });
    }
  }
  return matched.sort((a, b) => a.title.localeCompare(b.title));
}
