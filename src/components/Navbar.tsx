import React from 'react';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-5 sm:py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
      {/* Logo (left) */}
      <div 
        onClick={() => onNavigate('home')}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <span 
          className="text-[22px] sm:text-[28px] tracking-tight text-white font-medium"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Acharya®
        </span>
        <span className="text-[26px] sm:text-[32px] text-white select-none tracking-[-0.02em] leading-none group-hover:rotate-45 transition-transform duration-300">
          ✳︎
        </span>
      </div>
    </header>
  );
};
