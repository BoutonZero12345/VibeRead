"use client";
import { useEffect, useRef, useState } from "react";
import ePub from "epubjs";

interface EpubReaderProps {
  bookUrl: string;
  bookId: number;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  isDarkMode: boolean;
  textPadding: number;
}

function getFontName(fontFamily: string): string {
  if (fontFamily === "font-dyslexic") return "OpenDyslexic";
  if (fontFamily === "font-serif") return "Georgia";
  return "system-ui";
}

function injectStylesIntoView(view: any, fontName: string, fontSize: number, lineHeight: number, isDarkMode: boolean, textPadding: number, origin: string) {
  const doc = view?.document;
  if (!doc) return;
  const existing = doc.getElementById("viberead-override");
  if (existing) existing.remove();
  const style = doc.createElement("style");
  style.id = "viberead-override";
  style.innerHTML = `
    @font-face { font-family:'OpenDyslexic'; src:url('${origin}/api/fonts/OpenDyslexic-Regular.otf') format('opentype'); font-weight:normal; }
    @font-face { font-family:'OpenDyslexic'; src:url('${origin}/api/fonts/OpenDyslexic-Bold.otf') format('opentype'); font-weight:bold; }
    *, p, span, div, h1, h2, h3, h4, h5, h6, li, td, th {
      font-family: ${fontName}, sans-serif !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    html, body {
      background-color: ${isDarkMode ? "#09090b" : "#ffffff"} !important;
      color: ${isDarkMode ? "#f4f4f5" : "#18181b"} !important;
      padding-left: ${textPadding}px !important;
      padding-right: ${textPadding}px !important;
    }
    p { text-align: justify !important; margin-bottom: 1.5em !important; }
  `;
  doc.head.appendChild(style);
}

export default function EpubReader({ bookUrl, bookId, fontSize, lineHeight, fontFamily, isDarkMode, textPadding }: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);
  const viewsRef = useRef<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!viewerRef.current) return;
    setError(false);
    viewsRef.current = [];
    const book = ePub(bookUrl);
    bookRef.current = book;
    const rendition = book.renderTo(viewerRef.current, { flow: "scrolled", manager: "continuous", width: "100%", height: "100%" });
    renditionRef.current = rendition;

    const savedCfi = localStorage.getItem(`viberead_epubcfi_${bookId}`);
    rendition.display(savedCfi || undefined);

    rendition.on("relocated", (location: any) => {
      if (location?.start?.cfi) localStorage.setItem(`viberead_epubcfi_${bookId}`, location.start.cfi);
    });

    rendition.on("rendered", (_: any, view: any) => {
      viewsRef.current.push(view);
      const origin = window.location.origin;
      injectStylesIntoView(view, getFontName(fontFamily), fontSize, lineHeight, isDarkMode, textPadding, origin);
    });

    book.ready.catch(() => setError(true));
    return () => { renditionRef.current?.destroy(); bookRef.current?.destroy(); viewsRef.current = []; };
  }, [bookUrl, bookId]);

  useEffect(() => {
    const origin = window.location.origin;
    for (const view of viewsRef.current) {
      injectStylesIntoView(view, getFontName(fontFamily), fontSize, lineHeight, isDarkMode, textPadding, origin);
    }
  }, [fontFamily, fontSize, lineHeight, isDarkMode, textPadding]);

  if (error) throw new Error("Failed to load epub");
  return <div ref={viewerRef} className="w-full h-full" />;
}
