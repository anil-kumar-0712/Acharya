import React from 'react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  onOpenPortal: () => void;
  onOpenAuth: () => void;
  onNavigate: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenPortal, onNavigate }) => {
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

      {/* If logged in, optional subtle logged-in status pill on far right if desired, or keep top clean */}
      {user && (
        <button
          onClick={onOpenPortal}
          className="flex items-center gap-2 bg-zinc-900/90 border border-white/20 hover:border-white/50 text-white text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow backdrop-blur-md"
          title="Open Career Portal Dashboard"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold">{user.name}</span>
          <span className="text-white/40">({user.level ? user.level.split(' ')[0] : 'Member'})</span>
        </button>
      )}
    </header>
  );
};
