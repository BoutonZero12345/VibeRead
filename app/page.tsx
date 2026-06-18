"use client";
import { useState, useEffect, useRef } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import { Book } from "@/lib/books";
import MenuBar from "@/components/MenuBar";
import LibraryPanel from "@/components/LibraryPanel";
import SettingsPanel from "@/components/SettingsPanel";
import ReaderPanel from "@/components/ReaderPanel";
import ReadingProgressBar from "@/components/ReadingProgressBar";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookText, setBookText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeBookId, setActiveBookId] = useState<number | null>(null);
  const [recentIds, setRecentIds] = useState<number[]>([]);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEpubAvailable, setIsEpubAvailable] = useState(false);
  const [bookStatuses, setBookStatuses] = useState<Record<number, "unread" | "in-progress" | "read">>({});

  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [fontFamily, setFontFamily] = useState("font-dyslexic");
  const [columnWidth, setColumnWidth] = useState(720);
  const [textPadding, setTextPadding] = useState(48);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/library").then((r) => r.json()).then(setBooks).catch(() => {});
    fetch("/api/book").then((r) => r.text()).then((t) => { setBookText(t); setLoading(false); }).catch(() => setLoading(false));

    const kd = (e: KeyboardEvent) => { if (e.key === "Control") setIsCtrlPressed(true); };
    const ku = (e: KeyboardEvent) => { if (e.key === "Control") setIsCtrlPressed(false); };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    const rec = localStorage.getItem("viberead_recent_books");
    if (rec) setRecentIds(JSON.parse(rec));

    const sSize = localStorage.getItem("viberead_font_size");
    const sHeight = localStorage.getItem("viberead_line_height");
    const sFamily = localStorage.getItem("viberead_font_family");
    const sWidth = localStorage.getItem("viberead_column_width");
    const sPadding = localStorage.getItem("viberead_text_padding");
    const sDark = localStorage.getItem("viberead_dark_mode");
    const sStatuses = localStorage.getItem("viberead_book_statuses");

    if (sSize) setFontSize(parseInt(sSize, 10));
    if (sHeight) setLineHeight(parseFloat(sHeight));
    if (sFamily) setFontFamily(sFamily);
    if (sWidth) setColumnWidth(parseInt(sWidth, 10));
    if (sPadding) setTextPadding(parseInt(sPadding, 10));
    if (sDark) setIsDarkMode(sDark === "true");
    if (sStatuses) setBookStatuses(JSON.parse(sStatuses));

    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, []);

  useEffect(() => {
    if (activeBookId === null) return;
    setIsEpubAvailable(false);
    fetch(`/api/books/${activeBookId}.epub`, { method: "HEAD" })
      .then((res) => setIsEpubAvailable(res.ok))
      .catch(() => setIsEpubAvailable(false));
  }, [activeBookId]);

  const handleScroll = () => {
    if (scrollContainerRef.current && activeBookId !== null && !isEpubAvailable) {
      localStorage.setItem("viberead_scroll_pos", scrollContainerRef.current.scrollTop.toString());
    }
  };

  const updateVal = (key: string, val: any, setter: Function) => { setter(val); localStorage.setItem(key, val.toString()); };

  const selectBook = (id: number) => {
    setActiveBookId(id);
    localStorage.setItem("viberead_active_book_id", id.toString());
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
    localStorage.setItem("viberead_scroll_pos", "0");

    const nextRecents = [id, ...recentIds.filter((x) => x !== id)].slice(0, 5);
    setRecentIds(nextRecents);
    localStorage.setItem("viberead_recent_books", JSON.stringify(nextRecents));
    setShowLibrary(false);

    // Auto-set status to "in-progress" if it was "unread"
    const currentStatus = bookStatuses[id] || "unread";
    if (currentStatus === "unread") {
      const nextStatuses = { ...bookStatuses, [id]: "in-progress" as const };
      setBookStatuses(nextStatuses);
      localStorage.setItem("viberead_book_statuses", JSON.stringify(nextStatuses));
    }
  };

  const handleOpenLibrary = () => {
    // If no book open, directly open last read book instead of showing library
    const lastId = recentIds[0];
    if (activeBookId === null && lastId) {
      selectBook(lastId);
    } else {
      setShowLibrary(!showLibrary);
      setShowSettings(false);
    }
  };

  const closeBook = () => { setActiveBookId(null); localStorage.removeItem("viberead_active_book_id"); };

  const handleChangeStatus = (id: number, status: "unread" | "in-progress" | "read") => {
    const next = { ...bookStatuses, [id]: status };
    setBookStatuses(next);
    localStorage.setItem("viberead_book_statuses", JSON.stringify(next));
  };

  const activeBook = books.find((b) => b.id === activeBookId);
  const paragraphs = bookText.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 0);
  const recentBooks = recentIds.map((id) => books.find((b) => b.id === id)).filter(Boolean) as Book[];

  const panelClass = isCtrlPressed ? "bg-white border-zinc-300 text-black"
    : isDarkMode ? "bg-zinc-950/90 border-zinc-800 text-zinc-100" : "bg-white/85 border-white/30 text-black";
  const btnActive = isCtrlPressed ? "bg-black/10 border-black/25 text-black font-semibold"
    : isDarkMode ? "bg-white/10 border-white/20 text-white font-semibold" : "bg-black/10 border-black/20 text-black font-semibold";
  const btnInactive = isCtrlPressed || !isDarkMode
    ? "bg-transparent border-zinc-200 text-zinc-600 hover:bg-zinc-100" : "bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900";
  const lblColor = isCtrlPressed || !isDarkMode ? "text-zinc-500 font-semibold" : "text-zinc-400 font-semibold";
  const accentCls = isCtrlPressed || !isDarkMode ? "accent-black bg-zinc-200" : "accent-white bg-zinc-800";

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex">
      <BackgroundVideo videoId="G1hKzCkywM8" />
      <div className="w-full h-screen grid relative z-10 transition-all duration-500"
        style={{ gridTemplateColumns: activeBookId !== null ? `1fr min(100%, ${columnWidth}px) 1fr` : `1fr 0px 1fr` }}>
        <div className="hidden md:block" />
        <div ref={scrollContainerRef} onScroll={handleScroll}
          className={`h-full overflow-y-auto py-16 shadow-2xl relative select-text transition-all duration-500 reader-scroll ${
            isDarkMode ? "bg-zinc-950 text-zinc-100 selection:bg-zinc-800" : "bg-white text-zinc-900 selection:bg-zinc-200"
          } ${activeBookId !== null ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{ paddingLeft: isEpubAvailable ? "0px" : `${textPadding}px`, paddingRight: isEpubAvailable ? "2rem" : `${textPadding}px` }}>
          {activeBookId !== null && <ReaderPanel activeBookId={activeBookId} activeBook={activeBook} isEpubAvailable={isEpubAvailable} fontSize={fontSize} lineHeight={lineHeight} fontFamily={fontFamily} isDarkMode={isDarkMode} textPadding={textPadding} paragraphs={paragraphs} loading={loading} closeBook={closeBook} />}
          {activeBookId !== null && <ReadingProgressBar scrollContainerRef={scrollContainerRef} isDarkMode={isDarkMode} />}
        </div>
        <div className="hidden md:block" />
      </div>

      <div className="absolute top-6 right-6 z-30 flex flex-col items-end space-y-3">
        <MenuBar showLibrary={showLibrary} setShowLibrary={setShowLibrary} showSettings={showSettings} setShowSettings={setShowSettings} activeBookId={activeBookId} isCtrlPressed={isCtrlPressed} onOpenLibrary={handleOpenLibrary} />
        {showLibrary && (
          <LibraryPanel books={books} recentBooks={recentBooks} activeBookId={activeBookId} selectBook={selectBook} bookStatuses={bookStatuses} onChangeStatus={handleChangeStatus} isCtrlPressed={isCtrlPressed} isDarkMode={isDarkMode} panelClass={panelClass} btnActive={btnActive} lblColor={lblColor} />
        )}
        {showSettings && activeBookId !== null && (
          <SettingsPanel fontSize={fontSize} setFontSize={setFontSize} lineHeight={lineHeight} setLineHeight={setLineHeight} fontFamily={fontFamily} setFontFamily={setFontFamily} columnWidth={columnWidth} setColumnWidth={setColumnWidth} textPadding={textPadding} setTextPadding={setTextPadding} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} updateVal={updateVal} panelClass={panelClass} btnActive={btnActive} btnInactive={btnInactive} lblColor={lblColor} accentCls={accentCls} />
        )}
      </div>
    </main>
  );
}
