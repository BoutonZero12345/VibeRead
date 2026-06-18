"use client";
import { Book } from "@/lib/books";

interface BookItemProps {
  book: Book;
  isActive: boolean;
  status: "unread" | "in-progress" | "read";
  onSelect: () => void;
  onChangeStatus: (status: "unread" | "in-progress" | "read") => void;
  isCtrlPressed: boolean;
  isDarkMode: boolean;
  btnActive: string;
}

export default function BookItem({
  book,
  isActive,
  status,
  onSelect,
  onChangeStatus,
  isCtrlPressed,
  isDarkMode,
  btnActive,
}: BookItemProps) {
  const statuses = [
    { key: "unread" as const, label: "Non lu", color: "bg-zinc-400" },
    { key: "in-progress" as const, label: "En cours", color: "bg-amber-500" },
    { key: "read" as const, label: "Lu", color: "bg-emerald-500" },
  ];

  const current = statuses.find((s) => s.key === status) || statuses[0];

  const cycleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = statuses.findIndex((s) => s.key === status);
    const nextIdx = (idx + 1) % statuses.length;
    onChangeStatus(statuses[nextIdx].key);
  };

  const btnCls = isActive
    ? btnActive
    : isDarkMode && !isCtrlPressed
    ? "bg-transparent border-transparent hover:bg-zinc-900"
    : "bg-transparent border-transparent hover:bg-black/5";

  return (
    <div className={`w-full flex items-center justify-between p-1.5 rounded-lg border transition-colors ${btnCls}`}>
      <button onClick={onSelect} className="flex-1 text-left min-w-0 pr-2 cursor-pointer">
        <div className={`font-semibold text-xs truncate ${isDarkMode && !isCtrlPressed ? "text-zinc-200" : "text-zinc-900"}`}>{book.title}</div>
        <div className="text-[10px] text-zinc-500 truncate">{book.author}</div>
      </button>
      <button onClick={cycleStatus} className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-medium border border-zinc-200 dark:border-zinc-800 hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${current.color}`} />
        <span className={isDarkMode && !isCtrlPressed ? "text-zinc-400" : "text-zinc-600"}>{current.label}</span>
      </button>
    </div>
  );
}
