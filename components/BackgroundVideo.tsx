"use client";

import { useEffect, useRef } from "react";

interface BackgroundVideoProps {
  videoId: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function BackgroundVideo({ videoId }: BackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    // Load current progress from localStorage, default to 8 seconds
    const savedTime = localStorage.getItem("viberead_video_time");
    const startTime = savedTime ? parseInt(savedTime, 10) : 8;

    const initPlayer = () => {
      if (!window.YT || !containerRef.current) return;

      // Create a div placeholder that YT API will replace with the iframe
      const playerDiv = document.createElement("div");
      playerDiv.id = "yt-player";
      playerDiv.className = "absolute top-1/2 left-1/2 w-[115vw] h-[64.7vw] min-h-[115vh] min-w-[204.5vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0";
      
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(playerDiv);

      playerRef.current = new window.YT.Player("yt-player", {
        width: "100%",
        height: "100%",
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: videoId,
          controls: 0,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          vq: "hd1080",
          start: startTime,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();

            // Check and save play position every 2 seconds
            intervalId = setInterval(() => {
              if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
                const currentTime = Math.floor(playerRef.current.getCurrentTime());
                // Avoid saving zero values or end positions prematurely
                if (currentTime > 0) {
                  localStorage.setItem("viberead_video_time", currentTime.toString());
                }
              }
            }, 2000);
          },
          onStateChange: (event: any) => {
            // Loop back to 8s if video finishes
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.seekTo(8);
              event.target.playVideo();
            }
          },
        },
      });
    };

    // Load YouTube API script if it's not present
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      
      // Catch and handle script loading errors (e.g. adblocker blocks YouTube iframe API)
      tag.onerror = (err) => {
        console.warn("YouTube API script failed to load (likely blocked by an adblocker). Background video features may not function.", err);
      };

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-black">
      {/* Blocker overlay */}
      <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto" />
      
      {/* Player container */}
      <div ref={containerRef} className="w-full h-full relative" />
    </div>
  );
}
