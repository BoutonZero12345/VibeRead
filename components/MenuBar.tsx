"use client";
import { BookOpen, Settings } from "lucide-react";

interface MenuBarProps {
  showLibrary: boolean;
  setShowLibrary: (val: boolean) => void;
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
  activeBookId: number | null;
  isCtrlPressed: boolean;
  onOpenLibrary: () => void;
  isDarkMode?: boolean;
}

export default function MenuBar({
  showLibrary,
  setShowLibrary,
  showSettings,
  setShowSettings,
  activeBookId,
  isCtrlPressed,
  onOpenLibrary,
  isDarkMode = false,
}: MenuBarProps) {
  const btnClass = isCtrlPressed
    ? "bg-white text-black border-transparent font-bold shadow-md"
    : activeBookId !== null
      ? isDarkMode
        ? "bg-zinc-900/80 text-zinc-100 border-zinc-800 hover:bg-zinc-800"
        : "bg-zinc-100/90 text-zinc-800 border-zinc-200 hover:bg-zinc-200"
      : "glass-panel text-white/80 hover:text-white";

  return (
    <div className="flex space-x-2">
      <button
        onClick={onOpenLibrary}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer border ${btnClass}`}
      >
        <BookOpen className="w-5 h-5" />
      </button>
      {activeBookId !== null && (
        <button
          onClick={() => {
            setShowSettings(!showSettings);
            setShowLibrary(false);
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer border ${btnClass}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
