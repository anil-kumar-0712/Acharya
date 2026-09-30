import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  speed?: number;
  startDelay?: number;
}

interface UseTypewriterReturn {
  displayed: string;
  done: boolean;
}

export function useTypewriter(
  text: string,
  speed: number = 38,
  startDelay: number = 600
): UseTypewriterReturn {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    let charIndex = 0;
    let intervalId: number | null = null;

    const delayTimeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (charIndex < text.length) {
          setDisplayed((prev) => text.slice(0, charIndex + 1));
          charIndex++;
        } else {
          setDone(true);
          if (intervalId !== null) clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(delayTimeoutId);
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
