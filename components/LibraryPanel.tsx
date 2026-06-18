"use client";
import { Book } from "@/lib/books";
import BookItem from "./BookItem";

interface LibraryPanelProps {
  books: Book[];
  recentBooks: Book[];
  activeBookId: number | null;
  selectBook: (id: number) => void;
  bookStatuses: Record<number, "unread" | "in-progress" | "read">;
  onChangeStatus: (id: number, status: "unread" | "in-progress" | "read") => void;
  isCtrlPressed: boolean;
  isDarkMode: boolean;
  panelClass: string;
  btnActive: string;
  lblColor: string;
}

export default function LibraryPanel({
  books,
  recentBooks,
  activeBookId,
  selectBook,
  bookStatuses,
  onChangeStatus,
  isCtrlPressed,
  isDarkMode,
  panelClass,
  btnActive,
  lblColor,
}: LibraryPanelProps) {
  return (
    <div className={`rounded-2xl p-4 w-80 flex flex-col space-y-4 shadow-xl max-h-[80vh] overflow-y-auto border transition-all duration-350 ${panelClass}`}>
      <div className="text-xs font-mono tracking-widest font-bold uppercase">Bibliothèque</div>
      {recentBooks.length > 0 && (
        <div className="space-y-1.5">
          <div className={`text-[10px] uppercase tracking-wider ${lblColor}`}>Récents</div>
          <div className="flex flex-col space-y-1">
            {recentBooks.map((b) => (
              <BookItem key={`recent-${b.id}`} book={b} isActive={activeBookId === b.id} status={bookStatuses[b.id] || "unread"} onSelect={() => selectBook(b.id)} onChangeStatus={(status) => onChangeStatus(b.id, status)} isCtrlPressed={isCtrlPressed} isDarkMode={isDarkMode} btnActive={btnActive} />
            ))}
          </div>
        </div>
      )}
      <div className="space-y-1.5">
        <div className={`text-[10px] uppercase tracking-wider ${lblColor}`}>Tous les livres</div>
        <div className="flex flex-col space-y-1">
          {books.map((b) => (
            <BookItem key={`all-${b.id}`} book={b} isActive={activeBookId === b.id} status={bookStatuses[b.id] || "unread"} onSelect={() => selectBook(b.id)} onChangeStatus={(status) => onChangeStatus(b.id, status)} isCtrlPressed={isCtrlPressed} isDarkMode={isDarkMode} btnActive={btnActive} />
          ))}
        </div>
      </div>
    </div>
  );
}
