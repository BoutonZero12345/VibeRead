"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface ReadingProgressBarProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isDarkMode: boolean;
}

export default function ReadingProgressBar({ scrollContainerRef, isDarkMode }: ReadingProgressBarProps) {
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(10);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  const updateThumb = useCallback(() => {
    const el = scrollContainerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    const trackH = track.clientHeight;
    const ratio = el.clientHeight / el.scrollHeight;
    const h = Math.max(30, Math.round(ratio * trackH));
    const top = scrollable > 0 ? Math.round((el.scrollTop / scrollable) * (trackH - h)) : 0;
    setThumbHeight(h);
    setThumbTop(top);
  }, [scrollContainerRef]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateThumb, { passive: true });
    window.addEventListener("resize", updateThumb);
    updateThumb();
    return () => {
      el.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, [scrollContainerRef, updateThumb]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current) return;
    const el = scrollContainerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const rect = track.getBoundingClientRect();
    const clickPct = (e.clientY - rect.top - thumbHeight / 2) / (rect.height - thumbHeight);
    el.scrollTop = Math.max(0, clickPct) * (el.scrollHeight - el.clientHeight);
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = scrollContainerRef.current?.scrollTop ?? 0;

    const onMouseMove = (ev: MouseEvent) => {
      const el = scrollContainerRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const delta = ev.clientY - dragStartY.current;
      const trackH = track.clientHeight - thumbHeight;
      const scrollRatio = delta / trackH;
      el.scrollTop = dragStartScrollTop.current + scrollRatio * (el.scrollHeight - el.clientHeight);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const trackBg = isDarkMode ? "bg-zinc-800/60" : "bg-zinc-200/80";
  const thumbBg = isDarkMode ? "bg-zinc-500 hover:bg-zinc-300" : "bg-zinc-400 hover:bg-zinc-600";

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      className={`absolute right-0 top-0 h-full w-2.5 cursor-pointer z-20 ${trackBg} select-none`}
    >
      <div
        onMouseDown={handleThumbMouseDown}
        className={`absolute left-0.5 right-0.5 rounded-full cursor-grab active:cursor-grabbing transition-colors ${thumbBg}`}
        style={{ top: thumbTop, height: thumbHeight }}
      />
    </div>
  );
}
