"use client";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { Book } from "@/lib/books";

const EpubReader = dynamic(() => import("@/components/EpubReader"), { ssr: false });

interface ReaderPanelProps {
  activeBookId: number;
  activeBook: Book | undefined;
  isEpubAvailable: boolean;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  isDarkMode: boolean;
  textPadding: number;
  paragraphs: string[];
  loading: boolean;
  closeBook: () => void;
}

export default function ReaderPanel({
  activeBookId,
  activeBook,
  isEpubAvailable,
  fontSize,
  lineHeight,
  fontFamily,
  isDarkMode,
  textPadding,
  paragraphs,
  loading,
  closeBook,
}: ReaderPanelProps) {
  return (
    <>
      <button onClick={closeBook} className={`hidden md:block absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${
        isDarkMode ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900" : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
      }`}>
        <X className="w-5 h-5" />
      </button>
      {loading ? (
        <div className="h-full flex items-center justify-center text-zinc-400 font-sans">Chargement...</div>
      ) : isEpubAvailable ? (
        <EpubReader bookUrl={`/api/books/${activeBookId}.epub`} bookId={activeBookId} fontSize={fontSize} lineHeight={lineHeight} fontFamily={fontFamily} isDarkMode={isDarkMode} textPadding={textPadding} />
      ) : (
        <article className={`w-full mx-auto ${fontFamily}`} style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}>
          <header className={`mb-8 border-b pb-4 ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}>
            <span className={`text-[10px] uppercase font-mono tracking-widest ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>{activeBook?.category}</span>
            <h1 className={`text-2xl font-bold tracking-tight mt-1 ${isDarkMode ? "text-zinc-100" : "text-zinc-900"}`}>{activeBook?.title}</h1>
            <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Par {activeBook?.author}</p>
          </header>
          {paragraphs.map((p, i) => <p key={i} className="mb-6 text-justify">{p}</p>)}
        </article>
      )}
    </>
  );
}
