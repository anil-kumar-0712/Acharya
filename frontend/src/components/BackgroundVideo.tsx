import React, { useEffect, useRef } from 'react';

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4";
const SENSITIVITY = 0.8;

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video || isNaN(video.duration) || video.duration === 0) return;

      const currentX = e.clientX;
      if (prevXRef.current !== null) {
        const delta = currentX - prevXRef.current;
        const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
        
        let newTarget = targetTimeRef.current + timeOffset;
        // Clamp targetTime between 0 and video.duration
        newTarget = Math.max(0, Math.min(newTarget, video.duration));
        targetTimeRef.current = newTarget;

        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = newTarget;
        }
      }
      prevXRef.current = currentX;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video || isNaN(video.duration)) {
      isSeekingRef.current = false;
      return;
    }

    // Check if targetTime has moved while we were seeking
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      // Initialize target time to current time
      targetTimeRef.current = videoRef.current.currentTime || 0;
    }
  };

  return (
    <video
      ref={videoRef}
      src={VIDEO_URL}
      className="fixed inset-0 z-0 w-full h-full object-cover object-[70%_center] pointer-events-none select-none"
      muted
      playsInline
      preload="auto"
      onSeeked={handleSeeked}
      onLoadedMetadata={handleLoadedMetadata}
    />
  );
};
