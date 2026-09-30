import React, { useState, useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import { UserProfile } from '../types';

interface HeroSectionProps {
  user: UserProfile | null;
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ user, onGetStarted }) => {
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Typewriter sentence customized for Acharya
  const typewriterText = user
    ? `Welcome back ${user.name}! Ready to continue your ${user.targetDomain} learning journey?`
    : "Welcome to Acharya. Your AI-powered personalized career advisor. Ready to shape your path?";

  const { displayed, done } = useTypewriter(typewriterText, 38, 600);

  useEffect(() => {
    // Buttons become visible 400ms after page load, independent of typewriter
    const timer = setTimeout(() => {
      setButtonsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("contact@acharya.ai");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative z-1 h-screen w-full flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
      <div className="max-w-xl md:max-w-2xl relative z-10">
        
        {/* 1. Blurred Intro Label */}
        <div 
          className="pointer-events-none select-none mb-5 sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.3,
            fontWeight: 400,
            color: '#fff',
            filter: 'blur(4px)',
          }}
        >
          Hey there, meet A.R.I.A,
          <br />
          Acharya's Adaptive Response Interface Agent
        </div>

        {/* 2. Typewriter Text */}
        <p
          className="text-white mb-5 sm:mb-6 font-normal min-h-[54px]"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.35,
          }}
        >
          <span>{displayed}</span>
          {!done && (
            <span 
              className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-blink"
            />
          )}
        </p>

        {/* 3. Action Pill Buttons */}
        <div
          className={`flex flex-wrap items-center gap-3 sm:gap-4 transition-all duration-400 ease-out ${
            buttonsVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-[8px] pointer-events-none'
          }`}
        >
          {/* Main "Get Started" Pill Button */}
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[15px] sm:text-[17px] px-6 sm:px-8 py-3 font-medium whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer shadow-xl group"
          >
            <span>Get Started</span>
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </button>

          {/* Contact / Email Outline Pill Button */}
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center justify-center bg-transparent text-white border border-white/80 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.6em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 gap-2 sm:gap-3 cursor-pointer"
            title="Click to copy contact email"
          >
            <span>
              Reach us: <span className="underline underline-offset-1">contact@acharya.ai</span>
              {copied ? " (Copied!)" : ""}
            </span>
            <svg
              className="w-[12px] h-[12px] flex-shrink-0 fill-current"
              viewBox="0 0 16 16"
            >
              <path d="M4 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
              <path d="M2 0a2 2 0 0 0-2 2v10h1V2a1 1 0 0 1 1-1h10V0H2z"/>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};
