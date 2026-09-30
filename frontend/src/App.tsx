import React, { useState, useEffect } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AcharyaPortal } from './components/AcharyaPortal';
import { AuthModal } from './components/AuthModal';
import { DiagnosticTestModal } from './components/DiagnosticTestModal';
import { UserProfile, PersonalizedRoadmap } from './types';

export function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [diagnosticTestOpen, setDiagnosticTestOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<'my-roadmap' | 'advisor' | 'analytics' | 'roadmaps' | 'settings'>('advisor');

  // Load persistent user profile & roadmap from localStorage if needed
  useEffect(() => {
    const savedUser = localStorage.getItem('acharya_user');
    const savedRoadmap = localStorage.getItem('acharya_roadmap');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }

    if (savedRoadmap) {
      try {
        setRoadmap(JSON.parse(savedRoadmap));
      } catch (e) {
        console.error("Failed to parse saved roadmap", e);
      }
    }
  }, []);

  const handleAuthSuccess = (registeredUser: UserProfile) => {
    setUser(registeredUser);
    localStorage.setItem('acharya_user', JSON.stringify(registeredUser));
    setAuthModalOpen(false);

    // If user has already completed the 5-MCQ test previously, open portal directly
    if (registeredUser.isTestCompleted && localStorage.getItem('acharya_roadmap')) {
      setPortalTab('my-roadmap');
      setPortalOpen(true);
    } else {
      // Prompt 5-MCQ Placement Test for new registrations
      setDiagnosticTestOpen(true);
    }
  };

  const handleDiagnosticComplete = (updatedUser: UserProfile, generatedRoadmap: PersonalizedRoadmap) => {
    setUser(updatedUser);
    setRoadmap(generatedRoadmap);
    setDiagnosticTestOpen(false);

    // Automatically launch portal showing their new diagnostic roadmap!
    setPortalTab('my-roadmap');
    setPortalOpen(true);
  };

  const handleGetStarted = () => {
    // Clicking Get Started ALWAYS opens the Login and Register page
    setAuthModalOpen(true);
  };

  const handleNavigateSection = (section: string) => {
    if (section === 'assessment') {
      if (!user) {
        setAuthModalOpen(true);
      } else {
        setDiagnosticTestOpen(true);
      }
    } else if (section === 'roadmaps') {
      setPortalTab('roadmaps');
      setPortalOpen(true);
    } else if (section === 'ai-advisor') {
      setPortalTab('advisor');
      setPortalOpen(true);
    } else {
      setPortalOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-body selection:bg-white selection:text-black">
      {/* Fixed Mouse-Scrub Controlled Background Video */}
      <BackgroundVideo />

      {/* Fixed Clean Navbar (z-index: 10) */}
      <Navbar
        onNavigate={handleNavigateSection}
      />

      {/* Hero Landing Section (z-index: 1) */}
      <main>
        <HeroSection
          onGetStarted={handleGetStarted}
        />
      </main>

      {/* Auth Modal (Register / Login Page) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* 5-MCQ Placement Diagnostic Test Modal */}
      {user && (
        <DiagnosticTestModal
          isOpen={diagnosticTestOpen}
          user={user}
          onComplete={handleDiagnosticComplete}
          onSkip={() => {
            setDiagnosticTestOpen(false);
            setPortalTab('advisor');
            setPortalOpen(true);
          }}
        />
      )}

      {/* Acharya Left-Sidebar Dashboard Portal Modal */}
      <AcharyaPortal
        isOpen={portalOpen}
        onClose={() => setPortalOpen(false)}
        user={user}
        roadmap={roadmap}
        onRetakeTest={() => {
          setPortalOpen(false);
          setDiagnosticTestOpen(true);
        }}
        onOpenAuth={() => {
          setPortalOpen(false);
          setAuthModalOpen(true);
        }}
        initialTab={portalTab}
      />
    </div>
  );
}

export default App;
