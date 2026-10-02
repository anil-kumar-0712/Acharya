import React, { useState } from 'react';
import { UserProfile, TargetDomain, PersonalizedRoadmap } from '../types';
import { DOMAIN_QUESTIONS } from '../data/mcqQuestions';
import { generatePersonalizedRoadmap } from '../utils/roadmapGenerator';
import { apiService } from '../services/api';

interface DiagnosticTestModalProps {
  isOpen: boolean;
  user: UserProfile;
  onComplete: (updatedUser: UserProfile, roadmap: PersonalizedRoadmap) => void;
  onSkip?: () => void;
}

export const DiagnosticTestModal: React.FC<DiagnosticTestModalProps> = ({
  isOpen,
  user,
  onComplete,
  onSkip,
}) => {
  const domain: TargetDomain = user.targetDomain || 'Artificial Intelligence & Machine Learning';
  const questionSet = DOMAIN_QUESTIONS[domain] || DOMAIN_QUESTIONS['Fullstack Web Development'];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [testFinished, setTestFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = questionSet.questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    const updated = [...userAnswers];
    updated[currentIdx] = idx;
    setUserAnswers(updated);
  };

  const handleNext = async () => {
    if (currentIdx < questionSet.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(userAnswers[currentIdx + 1]);
    } else {
      let finalScore = 0;
      questionSet.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctAnswer) {
          finalScore++;
        }
      });

      setTestFinished(true);

      const roadmap = generatePersonalizedRoadmap(domain, finalScore, user.name);

      const updatedUser: UserProfile = {
        ...user,
        isTestCompleted: true,
        score: finalScore,
        level: roadmap.userLevel as any,
        completedAt: new Date().toLocaleDateString(),
      };

      try {
        await apiService.saveRoadmap({
          email: user.email,
          score: finalScore,
          level: roadmap.userLevel,
          roadmap: roadmap,
        });
      } catch (err) {
        console.warn("Backend save roadmap warning:", err);
      }

      localStorage.setItem('acharya_user', JSON.stringify(updatedUser));
      localStorage.setItem('acharya_roadmap', JSON.stringify(roadmap));

      setTimeout(() => {
        onComplete(updatedUser, roadmap);
      }, 1500);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setSelectedOption(userAnswers[currentIdx - 1]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl p-4 overflow-y-auto animate-fade-in-up">
      <div className="relative w-full max-w-2xl bg-white/[0.08] border border-white/20 p-6 sm:p-8 rounded-[28px] shadow-2xl text-white backdrop-blur-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/15 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-medium tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Acharya® Diagnostic
              </span>
              <span className="text-lg text-white select-none">✳︎</span>
              <span className="text-xs bg-white/10 text-white/90 px-3 py-1 rounded-full border border-white/20 font-medium">
                5 MCQ Test
              </span>
            </div>
            <div className="text-xs text-white/60 mt-1">
              Target Focus: <span className="text-white font-medium">{domain}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-white/50 uppercase tracking-wider block">Candidate</span>
            <span className="text-sm font-semibold text-white">{user.name} ({user.age} yrs)</span>
          </div>
        </div>

        {!testFinished ? (
          <div>
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs text-white/70 mb-2 font-medium">
              <span>Question {currentIdx + 1} of 5</span>
              <span>{Math.round(((currentIdx + 1) / 5) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden mb-6 border border-white/15">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / 5) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-normal leading-relaxed mb-6 text-white/95">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;

                  let btnStyle = "border-white/15 bg-black/50 hover:bg-white/10 hover:border-white/50";
                  
                  if (isSelected) {
                    btnStyle = "border-white bg-white/25 text-white font-semibold shadow-md ring-1 ring-white/50";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                        isSelected ? 'border-white bg-white text-black font-bold' : 'border-white/30 text-white'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-white/15">
              <div>
                {currentIdx > 0 ? (
                  <button
                    onClick={handlePrevious}
                    className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium border border-white/60 bg-transparent hover:bg-white hover:text-black text-white transition-colors cursor-pointer"
                  >
                    ← Previous
                  </button>
                ) : onSkip ? (
                  <button
                    onClick={onSkip}
                    className="text-xs text-white/50 hover:text-white underline cursor-pointer"
                  >
                    Skip test for now
                  </button>
                ) : <div />}
              </div>

              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`px-7 py-3 rounded-full font-medium text-sm transition-all cursor-pointer flex items-center gap-2 border ${
                  selectedOption !== null
                    ? 'bg-white text-black hover:bg-black hover:text-white border-white shadow-xl'
                    : 'bg-white/10 text-white/40 border-white/10 cursor-not-allowed'
                }`}
              >
                <span>{currentIdx < 4 ? 'Next Question' : 'Complete Assessment'}</span>
                <span>→</span>
              </button>
            </div>

          </div>
        ) : (
          /* Analyzing & Saving View */
          <div className="py-12 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-white/20 border-t-white animate-spin" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                Analyzing Assessment Responses...
              </h3>
              <p className="text-sm text-white/70">
                A.R.I.A is evaluating your responses and generating your customized career roadmap for <span className="text-white font-medium">{domain}</span>.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
