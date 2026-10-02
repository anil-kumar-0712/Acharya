import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, PersonalizedRoadmap, TargetDomain } from '../types';
import { apiService } from '../services/api';
import { DOMAIN_CURRICULUM, LearningModule } from '../data/learningCurriculum';
import { DOMAIN_QUESTIONS } from '../data/mcqQuestions';
import { generatePersonalizedRoadmap } from '../utils/roadmapGenerator';

const INTERVIEW_QUESTIONS_BY_DOMAIN: Record<string, { id: number; question: string; hint: string }[]> = {
  'Cybersecurity & Ethical Hacking': [
    { id: 1, question: 'Explain the difference between Linux SUID permissions and standard file permissions, and how SUID binaries can be exploited for privilege escalation.', hint: 'Discuss octal 4000, root execution context, and find / -perm -4000.' },
    { id: 2, question: 'Describe how a TCP 3-Way Handshake works, and explain how an attacker launches a SYN Flood Denial of Service attack.', hint: 'Mention SYN, SYN-ACK, ACK packets, incomplete connection queues, and SYN cookies.' },
    { id: 3, question: 'What is SQL Injection (SQLi), what is the difference between In-band and Blind SQLi, and how do parameterized queries mitigate it?', hint: 'Discuss user input concatenation vs prepared statements.' },
    { id: 4, question: 'Explain the difference between Symmetric and Asymmetric Encryption and when HTTPS uses each.', hint: 'Mention AES vs RSA/ECC, key exchange vs bulk data encryption.' },
    { id: 5, question: 'What is Cross-Site Scripting (XSS)? Differentiate between Stored, Reflected, and DOM-based XSS.', hint: 'Discuss malicious script execution in victim browser and CSP headers.' },
  ],
  'Fullstack Web Development': [
    { id: 1, question: 'Explain the Node.js Event Loop architecture, call stack, microtask queue, and macrotask queue execution priority.', hint: 'Discuss Promises vs setTimeout and libuv thread pool.' },
    { id: 2, question: 'What is the React Virtual DOM, how does the reconciliation algorithm work, and why is the key prop critical in lists?', hint: 'Discuss diffing algorithm, O(n) complexity, and component identity.' },
    { id: 3, question: 'Compare REST APIs vs GraphQL APIs regarding endpoints, payload flexibility, over-fetching, and under-fetching.', hint: 'Discuss single endpoint schema vs multiple resource URLs.' },
    { id: 4, question: 'Explain database indexing mechanisms in MongoDB and PostgreSQL, and discuss trade-offs between read query speed and write performance.', hint: 'Discuss B-Trees, compound indexes, and write lock/overhead.' },
    { id: 5, question: 'What are JWT (JSON Web Tokens), how are they structured, where should they be stored on the client, and how do you handle token expiration?', hint: 'Discuss Header.Payload.Signature, HttpOnly cookies, and Refresh Tokens.' },
  ],
  'Cloud & DevOps Architecture': [
    { id: 1, question: 'Explain the difference between Docker Containers and Virtual Machines regarding kernel sharing, isolation, and resource overhead.', hint: 'Discuss OS kernel isolation vs hypervisor hardware virtualization.' },
    { id: 2, question: 'Describe Kubernetes Pods, Services, and Ingress Controllers and how traffic flows from the internet to a pod.', hint: 'Discuss ClusterIP, NodePort, and Layer 7 Ingress routing.' },
    { id: 3, question: 'What is Infrastructure as Code (IaC)? Explain how Terraform manages state and detects configuration drift.', hint: 'Discuss tfstate, plan execution graph, and declarative HCL.' },
    { id: 4, question: 'Explain how to design a zero-downtime Blue-Green vs Canary deployment strategy in production environments.', hint: 'Discuss router weight shifting, rollback speed, and traffic splitting.' },
    { id: 5, question: 'Describe Prometheus metrics collection architecture, pull model vs push gateway, and Grafana alert rule definitions.', hint: 'Discuss PromQL, scraping targets, time-series DB, and alertmanager.' },
  ],
  'Artificial Intelligence & Machine Learning': [
    { id: 1, question: 'Explain Overfitting in machine learning models, how to diagnose it from loss curves, and 3 techniques to prevent it.', hint: 'Discuss training vs validation loss, L1/L2 regularization, dropout, early stopping.' },
    { id: 2, question: 'How does the Attention Mechanism work in Transformer neural network architectures compared to recurrent RNNs?', hint: 'Discuss Query-Key-Value dot product attention and parallel sequence computation.' },
    { id: 3, question: 'Explain Gradient Descent optimization and compare Stochastic Gradient Descent (SGD) with Adam optimizer.', hint: 'Discuss learning rate, momentum, and adaptive learning rate parameters.' },
    { id: 4, question: 'What is Retrieval-Augmented Generation (RAG) in LLMs, and how do Vector Databases and Embeddings work together?', hint: 'Discuss chunking, vector similarity search (cosine/dot product), and augmented prompt context.' },
    { id: 5, question: 'Explain Autonomous AI Agent tool calling and how the LLM decides when to execute external APIs.', hint: 'Discuss system prompt specifications, JSON schemas, function routing, and execution loops.' },
  ],
  'Product Management & Strategy': [
    { id: 1, question: 'How do you define and measure the North Star Metric for a B2B SaaS product, and how does it drive product strategy?', hint: 'Discuss customer value alignment, retention correlation, and input metrics.' },
    { id: 2, question: 'Explain the RICE prioritization framework and walk through how you calculate reach, impact, confidence, and effort.', hint: 'Discuss RICE score formula and unbiased feature ranking.' },
    { id: 3, question: 'How do you conduct customer discovery user research interviews without introducing confirmation bias?', hint: 'Discuss open-ended questions, past behavior vs hypothetical intent.' },
    { id: 4, question: 'Compare Product-Led Growth (PLG) vs Sales-Led Growth and discuss metrics critical to freemium conversion.', hint: 'Discuss self-serve onboarding, time-to-value, virality coefficient, and CAC.' },
    { id: 5, question: 'How do you handle conflicting feature requests between enterprise sales deals and long-term core platform tech debt?', hint: 'Discuss strategic roadmap alignment, technical debt allocation, and customer impact vs contract value.' },
  ],
  'UI/UX & Interactive Design': [
    { id: 1, question: 'Explain Visual Hierarchy, Typography Scale, and the 60-30-10 Color Rule in digital product interface design.', hint: 'Discuss focal points, contrast ratios, and dominant/accent color balance.' },
    { id: 2, question: 'What is Information Architecture (IA) and how do user flows and decision trees guide wireframe layouts?', hint: 'Discuss sitemaps, navigation depth, cognitive load, and drop-off minimization.' },
    { id: 3, question: 'How do you structure Figma Component Variants and Design Tokens for efficient team collaboration and developer handoff?', hint: 'Discuss spacing tokens, color variables, component properties, and spec documentation.' },
    { id: 4, question: 'Explain Accessibility (a11y) in UI design and how to achieve WCAG AAA contrast compliance.', hint: 'Discuss 4.5:1 / 7:1 contrast ratios, screen reader semantics, and focus states.' },
    { id: 5, question: 'How do you measure product usability using the System Usability Scale (SUS) and run quantitative A/B testing?', hint: 'Discuss 10-item SUS survey scoring, sample size, conversion delta, and statistical significance.' },
  ]
};

interface AcharyaPortalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  roadmap: PersonalizedRoadmap | null;
  onRetakeTest?: () => void;
  onOpenAuth?: () => void;
  initialTab?: 'my-roadmap' | 'advisor' | 'learn' | 'test' | 'mock-interview' | 'settings';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'aria';
  text: string;
  timestamp: string;
}

export const AcharyaPortal: React.FC<AcharyaPortalProps> = ({
  isOpen,
  onClose,
  user,
  roadmap: initialRoadmap,
  onRetakeTest,
  onOpenAuth,
  initialTab = 'my-roadmap',
}) => {
  const [activeTab, setActiveTab] = useState<'my-roadmap' | 'advisor' | 'learn' | 'test' | 'mock-interview' | 'settings'>(
    initialRoadmap ? 'my-roadmap' : 'advisor'
  );

  const [currentRoadmap, setCurrentRoadmap] = useState<PersonalizedRoadmap | null>(initialRoadmap);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(user);

  useEffect(() => {
    setCurrentRoadmap(initialRoadmap);
  }, [initialRoadmap]);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lockedModalStep, setLockedModalStep] = useState<{ phase: string; title: string; prereqs: string } | null>(null);

  // Gated Sequential Module Completion State
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('acharya_completed_modules');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveCompletedModule = (modId: string) => {
    setCompletedModuleIds((prev) => {
      if (!prev.includes(modId)) {
        const updated = [...prev, modId];
        localStorage.setItem('acharya_completed_modules', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  // Slided Horizontal Carousel Ref & Handlers
  const treeScrollRef = useRef<HTMLDivElement>(null);

  const handleSlideLeft = () => {
    if (treeScrollRef.current) {
      treeScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleSlideRight = () => {
    if (treeScrollRef.current) {
      treeScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Dynamic AI Chat Greeting
  const getGreeting = () => {
    if (currentUser) {
      return `Welcome back ${currentUser.name}! Ready to continue your ${currentUser.targetDomain} learning journey? I'm A.R.I.A, Acharya's Adaptive Response Interface Agent. How can I assist your career progression today?`;
    }
    return "Hello! I am A.R.I.A, Acharya's Adaptive Response Interface Agent. I'm here to analyze your background, recommend tailored career paths, generate skill roadmaps, and guide your professional transition. Where shall we begin?";
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: '1',
          sender: 'aria',
          text: getGreeting(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      if (initialRoadmap) {
        setActiveTab('my-roadmap');
      } else if (initialTab) {
        setActiveTab(initialTab as any);
      }
    }
  }, [isOpen, currentUser, initialRoadmap, initialTab]);

  // Profile Edit State
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAge, setEditAge] = useState(currentUser?.age || 24);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Domain Curriculum Data
  const targetDomain: TargetDomain = currentUser?.targetDomain || 'Cybersecurity & Ethical Hacking';
  const domainCurriculum = DOMAIN_CURRICULUM[targetDomain] || DOMAIN_CURRICULUM['Cybersecurity & Ethical Hacking'];
  const allModules = domainCurriculum.modules;

  // Selected Active Module for Testing & Reading
  const [selectedTestModuleIndex, setSelectedTestModuleIndex] = useState<number>(0);
  const [activeReadingModuleIndex, setActiveReadingModuleIndex] = useState<number | null>(null);

  const startModuleTest = (modIdx: number) => {
    setSelectedTestModuleIndex(modIdx);
    resetTestState();
    setActiveTab('test');
  };

  // In-Portal Test Engine State
  const questionSet = DOMAIN_QUESTIONS[targetDomain] || DOMAIN_QUESTIONS['Cybersecurity & Ethical Hacking'];

  const [testCurrentIdx, setTestCurrentIdx] = useState(0);
  const [testAnswers, setTestAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState<number | null>(null);
  const [testPassed, setTestPassed] = useState(false);
  const [testSaving, setTestSaving] = useState(false);

  const handleTestOptionSelect = (optIdx: number) => {
    const updated = [...testAnswers];
    updated[testCurrentIdx] = optIdx;
    setTestAnswers(updated);
  };

  const handleTestSubmit = async () => {
    let finalScore = 0;
    questionSet.questions.forEach((q, idx) => {
      if (testAnswers[idx] === q.correctAnswer) {
        finalScore++;
      }
    });

    const passed = finalScore >= 3;
    setTestScore(finalScore);
    setTestPassed(passed);
    setTestSubmitted(true);
    setTestSaving(true);

    const activeMod = allModules[selectedTestModuleIndex] || allModules[0];

    if (passed) {
      saveCompletedModule(activeMod.id);
    }

    if (currentUser) {
      const generatedRoadmap = generatePersonalizedRoadmap(targetDomain, finalScore, currentUser.name);

      const updatedUser: UserProfile = {
        ...currentUser,
        isTestCompleted: true,
        score: Math.max(currentUser.score || 0, finalScore),
        level: generatedRoadmap.userLevel as any,
        completedAt: new Date().toLocaleDateString(),
      };

      setCurrentUser(updatedUser);
      setCurrentRoadmap(generatedRoadmap);

      try {
        await apiService.saveRoadmap({
          email: currentUser.email,
          score: finalScore,
          level: generatedRoadmap.userLevel,
          roadmap: generatedRoadmap,
        });
      } catch (err) {
        console.warn("Backend save roadmap warning:", err);
      }

      localStorage.setItem('acharya_user', JSON.stringify(updatedUser));
      localStorage.setItem('acharya_roadmap', JSON.stringify(generatedRoadmap));
    }

    setTestSaving(false);
  };

  const resetTestState = () => {
    setTestCurrentIdx(0);
    setTestAnswers([null, null, null, null, null]);
    setTestSubmitted(false);
    setTestScore(null);
    setTestPassed(false);
  };

  // =========================================================
  // AI VOICE TECHNICAL MOCK INTERVIEW ENGINE STATE & HANDLERS
  // =========================================================
  const [isInterviewStarted, setIsInterviewStarted] = useState<boolean>(false);
  const [interviewCurrentIdx, setInterviewCurrentIdx] = useState<number>(0);
  const [candidateVoiceTranscript, setCandidateVoiceTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [interviewEvaluation, setInterviewEvaluation] = useState<{
    isCorrect: boolean;
    verdict: string;
    whyWrong: string;
    correctAnswer: string;
    spokenFeedback: string;
  } | null>(null);
  const [interviewResults, setInterviewResults] = useState<{
    question: string;
    answer: string;
    isCorrect: boolean;
    whyWrong: string;
    correctAnswer: string;
  }[]>([]);
  const [interviewCompleted, setInterviewCompleted] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  // Voice engine available voices state
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        try {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            setAvailableVoices(voices);
          }
        } catch (e) {}
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Helper for Text-to-Speech (AI Speaking Voice)
  const speakAIText = (text: string, onEndCallback?: () => void) => {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech Synthesis API not supported in this browser.");
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.includes('en-US') || v.lang.includes('en-GB') || v.lang.includes('en')) &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('David') || v.name.includes('Samantha') || v.name.includes('English'))
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      let keepAliveInterval: any = null;

      utterance.onstart = () => {
        setIsSpeaking(true);
        keepAliveInterval = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } else {
            clearInterval(keepAliveInterval);
          }
        }, 5000);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = (err) => {
        console.warn("TTS Error:", err);
        setIsSpeaking(false);
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        if (onEndCallback) onEndCallback();
      };

      setTimeout(() => {
        try {
          window.speechSynthesis.resume();
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn("speechSynthesis.speak error:", err);
          setIsSpeaking(false);
          if (onEndCallback) onEndCallback();
        }
      }, 50);

    } catch (e) {
      console.warn("TTS execution failed:", e);
      setIsSpeaking(false);
      if (onEndCallback) onEndCallback();
    }
  };

  const stopAISpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Voice Question Audio Player (Microphone stays OFF until candidate clicks Start Recording)
  const playQuestionAudio = (qIndex: number) => {
    stopSpeechRecognition();
    stopAISpeech();
    const domainQuestions = INTERVIEW_QUESTIONS_BY_DOMAIN[targetDomain] || INTERVIEW_QUESTIONS_BY_DOMAIN['Cybersecurity & Ethical Hacking'];
    const qObj = domainQuestions[qIndex];
    if (!qObj) return;

    const textToSpeak = `Question ${qIndex + 1}: ${qObj.question}`;
    speakAIText(textToSpeak);
  };

  const startVoiceInterview = () => {
    setIsInterviewStarted(true);
    setInterviewCurrentIdx(0);
    setCandidateVoiceTranscript('');
    setInterviewEvaluation(null);
    setInterviewResults([]);
    setInterviewCompleted(false);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    setTimeout(() => {
      playQuestionAudio(0);
    }, 100);
  };

  // Helper for Speech Recognition (Candidate Voice Microphone Input)
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech Recognition is not active in this browser. You can type your answer into the transcript box!");
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setCandidateVoiceTranscript(transcript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition notice:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }
  };

  // Handle Candidate Spoken Answer Submission & AI Evaluation
  const handleInterviewSubmit = async () => {
    if (!candidateVoiceTranscript.trim()) return;

    if (isListening) {
      stopSpeechRecognition();
    }

    setIsEvaluating(true);
    const domainQuestions = INTERVIEW_QUESTIONS_BY_DOMAIN[targetDomain] || INTERVIEW_QUESTIONS_BY_DOMAIN['Cybersecurity & Ethical Hacking'];
    const currentQ = domainQuestions[interviewCurrentIdx] || domainQuestions[0];

    try {
      let evalData = await apiService.evaluateInterviewAnswer(targetDomain, currentQ.question, candidateVoiceTranscript);

      if (!evalData) {
        // Fallback evaluation if offline
        const isOk = candidateVoiceTranscript.trim().length > 15;
        evalData = {
          isCorrect: isOk,
          verdict: isOk ? 'Correct' : 'Wrong',
          whyWrong: isOk ? '' : 'The provided spoken answer lacked specific technical depth, command syntax, or architectural principles required for senior interviews.',
          correctAnswer: `For '${currentQ.question}', a comprehensive answer explains the underlying core mechanics, configuration commands, error handling, and production best practices.`,
          spokenFeedback: isOk
            ? "Correct! Excellent explanation of the technical principles."
            : `Wrong answer. The response lacked essential technical depth for ${targetDomain}. The correct answer requires explaining the exact mechanism and standard implementation.`
        };
      }

      setInterviewEvaluation(evalData);

      // AI Speaks Feedback Aloud (Explicitly saying "Wrong answer", why it is wrong, and the correct answer!)
      speakAIText(evalData.spokenFeedback);

      setInterviewResults((prev) => [
        ...prev,
        {
          question: currentQ.question,
          answer: candidateVoiceTranscript,
          isCorrect: evalData.isCorrect,
          whyWrong: evalData.whyWrong,
          correctAnswer: evalData.correctAnswer,
        },
      ]);
    } catch (err) {
      console.warn("Interview evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextInterviewQuestion = () => {
    stopAISpeech();
    stopSpeechRecognition();
    setInterviewEvaluation(null);
    setCandidateVoiceTranscript('');

    const domainQuestions = INTERVIEW_QUESTIONS_BY_DOMAIN[targetDomain] || INTERVIEW_QUESTIONS_BY_DOMAIN['Cybersecurity & Ethical Hacking'];
    if (interviewCurrentIdx + 1 < domainQuestions.length) {
      const nextIdx = interviewCurrentIdx + 1;
      setInterviewCurrentIdx(nextIdx);
      playQuestionAudio(nextIdx);
    } else {
      setInterviewCompleted(true);
      const module12 = allModules[11] || allModules[allModules.length - 1];
      if (module12) {
        saveCompletedModule(module12.id);
      }
      speakAIText("Voice mock technical interview completed! Review your final performance breakdown on screen.");
    }
  };

  const resetInterview = () => {
    stopAISpeech();
    stopSpeechRecognition();
    setIsInterviewStarted(false);
    setInterviewCurrentIdx(0);
    setCandidateVoiceTranscript('');
    setInterviewEvaluation(null);
    setInterviewResults([]);
    setInterviewCompleted(false);
  };

  if (!isOpen) return null;

  // AI Chat Handler (Powered by Gemini AI)
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const geminiReply = await apiService.sendAIChatMessage(text, currentUser);
      
      let replyText = geminiReply;
      if (!replyText) {
        const lower = text.toLowerCase();
        if (lower.includes('my roadmap') || lower.includes('diagnostic') || lower.includes('level')) {
          if (currentUser && currentRoadmap) {
            replyText = `Based on your diagnostic assessment, your score is ${currentUser.score}/5, classifying your level as ${currentUser.level}. Your personalized roadmap for ${currentUser.targetDomain} spans ${currentRoadmap.estimatedTimeline} with expected salary potential of ${currentRoadmap.expectedSalary}. You can inspect your complete milestone steps in 'My Roadmap'!`;
          } else {
            replyText = "You haven't completed your domain skills test yet. Click 'Take Test' on the sidebar to benchmark your skills!";
          }
        } else {
          replyText = `Thank you for sharing that question regarding "${text}". Acharya's Gemini career intelligence engine recommends focusing on practical portfolio milestones aligned with high-growth industry standards. Shall we detail specific project requirements?`;
        }
      }

      const ariaMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'aria',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, ariaMsg]);
    } catch (e) {
      console.warn("AI Chat Handler Warning:", e);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = currentUser
    ? [
        `Review my diagnostic score for ${currentUser.targetDomain}`,
        "What are the top 3 projects to build for my level?",
        "How do I prepare for technical interviews?",
        "What salary bracket should I negotiate for?",
      ]
    : [
        "Build me a 6-month roadmap to become an AI Engineer",
        "How do I transition into Senior Product Management?",
        "What skills match an analytical problem-solver?",
        "Salary expectations for Fullstack Developers in 2026",
      ];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updated = { ...currentUser, name: editName, age: editAge };
      setCurrentUser(updated);
      localStorage.setItem('acharya_user', JSON.stringify(updated));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  // Helper to determine if a module is unlocked
  const isModuleUnlocked = (modIdx: number) => {
    if (modIdx === 0) return true; // Module 1 is always unlocked initially
    const prevModId = allModules[modIdx - 1]?.id;
    return completedModuleIds.includes(prevModId);
  };

  // Track completion percentage
  const completedCount = completedModuleIds.filter((id) => allModules.some((m) => m.id === id)).length;
  const completionPercent = Math.min(100, Math.round((completedCount / allModules.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex bg-[#0c0205] text-white overflow-hidden animate-fade-in-up font-body selection:bg-rose-500 selection:text-white">
      
      {/* ========================================================= */}
      {/* LEFT MENU SIDEBAR (Deep Crimson Dark Theme) */}
      {/* ========================================================= */}
      <aside className={`w-64 lg:w-72 bg-[#120308] border-r border-[#24060e] flex flex-col justify-between flex-shrink-0 transition-all duration-300 ${
        sidebarCollapsed ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Top Branding & User Card */}
        <div className="p-5 border-b border-[#24060e] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onClose}>
              <span className="text-xl font-extrabold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Acharya®
              </span>
              <span className="text-lg text-[#f43f5e] select-none font-bold">✳︎</span>
            </div>
            <span className="text-[10px] bg-[#280812] border border-[#4a0f22] text-[#f43f5e] px-2.5 py-0.5 rounded-full uppercase tracking-widest font-extrabold">
              Portal
            </span>
          </div>

          {/* User Profile Card Snippet */}
          {currentUser ? (
            <div className="p-3 bg-[#1a040b] border border-[#330816] rounded-2xl flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-[#be123c] text-white font-extrabold flex items-center justify-center text-sm flex-shrink-0 shadow-md">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-sm font-bold text-white truncate">Welcome back {currentUser.name}!</div>
                <div className="text-[11px] text-emerald-400 font-semibold truncate">
                  {currentUser.level ? currentUser.level.split(' ')[0] : 'Member'} ({completedCount}/{allModules.length} Modules)
                </div>
                <div className="text-[10px] text-rose-300/70 truncate">{currentUser.targetDomain}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full py-2.5 bg-white text-black border border-black/10 font-bold text-xs rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer shadow-lg"
            >
              Register / Login
            </button>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto text-sm">
          <div className="text-[10px] uppercase font-extrabold text-rose-400/50 px-3 mb-2 tracking-widest">
            Main Navigation
          </div>

          <button
            onClick={() => setActiveTab('my-roadmap')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all cursor-pointer text-left ${
              activeTab === 'my-roadmap'
                ? 'bg-white text-black font-extrabold shadow-xl'
                : 'text-rose-200/80 hover:bg-[#260711] hover:text-white'
            }`}
          >
            <span className="text-base">🎓</span>
            <span className="flex-1">My Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('advisor')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all cursor-pointer text-left ${
              activeTab === 'advisor'
                ? 'bg-white text-black font-extrabold shadow-xl'
                : 'text-rose-200/80 hover:bg-[#260711] hover:text-white'
            }`}
          >
            <span className="text-base">💬</span>
            <span className="flex-1">AI Advisor (A.R.I.A)</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all cursor-pointer text-left ${
              activeTab === 'learn'
                ? 'bg-white text-black font-extrabold shadow-xl'
                : 'text-rose-200/80 hover:bg-[#260711] hover:text-white'
            }`}
          >
            <span className="text-base">📚</span>
            <span className="flex-1">Path-to-Path Learning</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all cursor-pointer text-left ${
              activeTab === 'test'
                ? 'bg-white text-black font-extrabold shadow-xl'
                : 'text-rose-200/80 hover:bg-[#260711] hover:text-white'
            }`}
          >
            <span className="text-base">📝</span>
            <span className="flex-1">Take Domain Test</span>
          </button>

          <button
            onClick={() => setActiveTab('mock-interview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all cursor-pointer text-left ${
              activeTab === 'mock-interview'
                ? 'bg-white text-black font-extrabold shadow-xl'
                : 'text-rose-200/80 hover:bg-[#260711] hover:text-white'
            }`}
          >
            <span className="text-base">🎙️</span>
            <span className="flex-1">AI Voice Mock Interview</span>
            <span className="text-[10px] bg-[#be123c] text-white px-2 py-0.5 rounded-full font-bold">Voice</span>
          </button>

          <div className="text-[10px] uppercase font-extrabold text-rose-400/50 px-3 mt-6 mb-2 tracking-widest">
            Account Management
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all cursor-pointer text-left ${
              activeTab === 'settings'
                ? 'bg-white text-black font-extrabold shadow-xl'
                : 'text-rose-200/80 hover:bg-[#260711] hover:text-white'
            }`}
          >
            <span className="text-base">⚙️</span>
            <span className="flex-1">Profile Settings</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#24060e] space-y-2">
          <button
            onClick={() => {
              resetTestState();
              setActiveTab('test');
            }}
            className="w-full py-2.5 bg-transparent hover:bg-[#260711] border border-[#380a18] text-rose-200 text-xs font-semibold rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📝 Take Module Test</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 bg-transparent text-rose-400/60 hover:text-rose-200 text-xs text-center transition-colors cursor-pointer"
          >
            Exit to Hero Landing →
          </button>
        </div>

      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0c0205]">
        
        {/* Top Navigation Bar */}
        <header className="h-16 px-6 border-b border-[#24060e] flex items-center justify-between bg-[#120308] flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white capitalize flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {activeTab === 'my-roadmap' && '🎓 My Sequential Career Roadmap'}
              {activeTab === 'advisor' && '💬 AI Career Advisor (A.R.I.A Workspace)'}
              {activeTab === 'learn' && '📚 Path-to-Path Learning Curriculum'}
              {activeTab === 'test' && '📝 Domain Skills Benchmark Test'}
              {activeTab === 'mock-interview' && '🎙️ AI Voice Technical Mock Interview'}
              {activeTab === 'settings' && '⚙️ Candidate Account Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="text-xs bg-[#280812] border border-[#4a0f22] text-rose-200 px-4 py-1.5 rounded-full hidden sm:inline-block">
                Welcome back, <strong className="text-white">{currentUser.name}</strong>
              </span>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#280812] hover:bg-rose-900 border border-[#4a0f22] flex items-center justify-center text-rose-200 transition-colors cursor-pointer text-xs"
              title="Close Portal"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: MY DIAGNOSTIC ROADMAP (SLIDED 11-MODULE ROADMAP) */}
          {activeTab === 'my-roadmap' && (
            <div className="space-y-6">
              {/* Summary Main Card */}
              <div className="bg-[#18040b] border border-[#360918] p-6 sm:p-8 rounded-[28px] space-y-6 shadow-2xl relative">
                
                {/* Top Badges & Timeline Flex Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-[#062016] border border-[#0d5c3a] text-emerald-400 text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                      TRACK PROGRESS: {completionPercent}% COMPLETED
                    </span>
                    <span className="bg-[#2b0813] border border-[#541126] text-rose-200 text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                      PASSED: {completedCount} / {allModules.length} MODULES
                    </span>
                  </div>

                  {/* Timeline Box */}
                  <div className="bg-[#240610] border border-[#470d21] p-4 rounded-2xl min-w-[220px] text-left space-y-1 shadow-inner self-stretch md:self-auto">
                    <div className="text-[10px] font-bold text-rose-400/80 tracking-widest uppercase">ESTIMATED TIMELINE</div>
                    <div className="text-white font-extrabold text-xl sm:text-2xl">{currentRoadmap?.estimatedTimeline || '6 - 8 Months'}</div>
                    <div className="text-emerald-400 font-semibold text-xs sm:text-sm">Potential: {currentRoadmap?.expectedSalary || '$75,000 - $110,000 / year'}</div>
                  </div>
                </div>

                {/* Main Title & Description */}
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    Welcome back {currentUser?.name}! Your {targetDomain} Roadmap
                  </h3>
                  <p className="text-rose-100/75 text-xs sm:text-sm leading-relaxed max-w-3xl">
                    Progress through the 11 sequential modules below. Learn each module in the Path-to-Path Learning curriculum, pass its module test, and unlock the next milestone!
                  </p>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SLIDED ROADMAP NODE DEPENDENCY TREE VIEW (11 MODULES) */}
              {/* ========================================================= */}
              <div className="bg-[#140308] border border-[#2b0813] p-6 sm:p-8 rounded-[28px] space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#f43f5e] font-bold text-lg">✳︎</span>
                      <h4 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        {targetDomain} Slided Node Dependency Tree
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-rose-300/70">
                      Use the slide controls (<span className="text-white font-bold">&lt; &gt;</span>) to navigate through all 11 modules. Complete learning & pass tests to unlock future nodes!
                    </p>
                  </div>

                  {/* Slide Controls Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={handleSlideLeft}
                      className="w-10 h-10 rounded-full bg-[#280812] hover:bg-white hover:text-black border border-[#4d1021] text-white flex items-center justify-center font-bold text-lg transition-all cursor-pointer shadow-lg"
                      title="Slide Left"
                    >
                      ‹
                    </button>
                    <button
                      onClick={handleSlideRight}
                      className="w-10 h-10 rounded-full bg-[#280812] hover:bg-white hover:text-black border border-[#4d1021] text-white flex items-center justify-center font-bold text-lg transition-all cursor-pointer shadow-lg"
                      title="Slide Right"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Horizontal Slided Container */}
                <div ref={treeScrollRef} className="overflow-x-auto pb-4 pt-2 scroll-smooth">
                  <div className="flex items-center gap-5 min-w-max">
                    {allModules.map((mod, idx) => {
                      const isCompleted = completedModuleIds.includes(mod.id);
                      const unlocked = isModuleUnlocked(idx);
                      const isActive = unlocked && !isCompleted;

                      return (
                        <React.Fragment key={mod.id}>
                          {/* Node Card */}
                          <div className={`w-80 rounded-[24px] p-6 space-y-4 transition-all relative flex flex-col justify-between ${
                            isCompleted
                              ? 'bg-[#0e0307] border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                              : isActive
                              ? 'bg-[#1a040b] border-2 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.35)]'
                              : 'bg-[#120308] border border-[#360918] opacity-75'
                          }`}>
                            <div className="space-y-3">
                              {/* Badges Header */}
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full uppercase ${
                                  isCompleted
                                    ? 'bg-[#062016] text-emerald-400 border border-[#0d5c3a]'
                                    : isActive
                                    ? 'bg-[#2b0813] text-rose-200 border border-[#541126]'
                                    : 'bg-[#240610] text-rose-300/70 border border-[#470d21]'
                                }`}>
                                  MODULE {mod.phaseNumber}
                                </span>

                                {isCompleted && (
                                  <span className="text-emerald-400 font-extrabold text-xs flex items-center gap-1">
                                    ✔ Passed (100%)
                                  </span>
                                )}

                                {isActive && (
                                  <span className="text-rose-500 font-extrabold text-xs flex items-center gap-1 animate-pulse">
                                    Active Path
                                  </span>
                                )}

                                {!unlocked && (
                                  <span className="bg-[#2b0813] text-rose-400 border border-[#541126] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                    🔒 Locked
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h5 className="text-base font-bold text-white leading-snug">
                                {mod.title}
                              </h5>

                              {/* Description Snippet */}
                              <p className="text-xs text-rose-100/75 line-clamp-2 leading-relaxed">
                                {mod.description}
                              </p>
                            </div>

                            {/* Action Footer */}
                            <div className="pt-2 space-y-2">
                              {isCompleted && (
                                <div className="bg-[#062016] border border-[#0d5c3a] p-2.5 rounded-xl flex justify-between items-center text-xs text-emerald-400 font-semibold">
                                  <span>Status: Completed</span>
                                  <span>100% Passed</span>
                                </div>
                              )}

                              {isActive && (
                                <div className="space-y-2">
                                  <button
                                    onClick={() => setActiveTab('learn')}
                                    className="w-full py-2 bg-white text-black font-bold text-xs rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer"
                                  >
                                    Study Module Lesson →
                                  </button>
                                  <button
                                    onClick={() => startModuleTest(idx)}
                                    className="w-full py-2 bg-rose-600 text-white font-bold text-xs rounded-full hover:bg-rose-500 transition-colors cursor-pointer shadow-md"
                                  >
                                    Take Module Test 📝
                                  </button>
                                </div>
                              )}

                              {!unlocked && (
                                <div 
                                  onClick={() => setLockedModalStep({
                                    phase: `Module ${mod.phaseNumber}`,
                                    title: mod.title,
                                    prereqs: `Complete Module ${mod.phaseNumber - 1} learning lesson and pass Module ${mod.phaseNumber - 1} test to unlock ${mod.title}.`
                                  })}
                                  className="bg-[#22050e] border border-[#420a1c] hover:border-rose-500/50 p-2.5 rounded-xl flex justify-between items-center text-xs cursor-pointer transition-colors"
                                >
                                  <span className="text-rose-400/80 font-medium">Why Locked?</span>
                                  <span className="text-white underline font-semibold flex items-center gap-1">
                                    Click to View 🔒
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Connecting Line */}
                          {idx < allModules.length - 1 && (
                            <div className="flex items-center justify-center w-8 flex-shrink-0">
                              <div className={`h-0.5 w-full ${
                                completedModuleIds.includes(mod.id)
                                  ? 'bg-emerald-500' 
                                  : 'border-t-2 border-dashed border-rose-500/50'
                              }`} />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actionable Milestone Steps Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    <span>📍 Actionable Milestone Steps</span>
                  </h4>
                  <span className="text-rose-400/60 text-xs font-semibold">{allModules.length} Total Modules</span>
                </div>

                <div className="space-y-4">
                  {allModules.map((step, idx) => {
                    const isCompleted = completedModuleIds.includes(step.id);
                    const unlocked = isModuleUnlocked(idx);

                    return (
                      <div key={step.id} className={`p-6 rounded-[24px] border space-y-4 transition-all shadow-xl ${
                        isCompleted
                          ? 'bg-[#0e0307] border-emerald-500/50'
                          : unlocked
                          ? 'bg-[#18040b] border-[#360918] hover:border-[#520f26]'
                          : 'bg-[#120308] border-[#24060e] opacity-75'
                      }`}>
                        <div className="flex items-start justify-between gap-4 border-b border-[#2d0714] pb-4">
                          <div className="flex items-start gap-4">
                            <span className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                              isCompleted
                                ? 'bg-[#062016] border-[#0d5c3a] text-emerald-400'
                                : unlocked
                                ? 'bg-[#280812] border-[#4d1021] text-rose-100'
                                : 'bg-[#1a040b] border-[#330816] text-rose-400/50'
                            }`}>
                              {idx + 1}
                            </span>
                            <div>
                              <div className="text-xs text-rose-400/70 font-bold uppercase tracking-wider">{step.subtitle} • {step.duration}</div>
                              <h5 className="text-lg font-bold text-white mt-0.5">{step.title}</h5>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <span className="text-emerald-400 font-bold text-xs bg-[#062016] border border-[#0d5c3a] px-3 py-1 rounded-full">
                                ✓ Passed
                              </span>
                            )}

                            {unlocked && (
                              <button
                                onClick={() => setActiveReadingModuleIndex(idx)}
                                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-full cursor-pointer transition-colors shadow-md flex items-center gap-1"
                              >
                                Start Learn 📖
                              </button>
                            )}

                            {!unlocked && (
                              <span className="text-rose-400/60 text-xs bg-[#240610] border border-[#470d21] px-3 py-1 rounded-full">
                                🔒 Locked
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-rose-100/80 text-xs sm:text-sm leading-relaxed">{step.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          <div className="bg-[#22050e] border border-[#420a1c] p-4 rounded-2xl space-y-2">
                            <span className="text-xs text-rose-400/70 font-bold block uppercase tracking-wider">Core Skills:</span>
                            <div className="flex flex-wrap gap-2">
                              {step.keyConcepts.map((sk, sIdx) => (
                                <span key={sIdx} className="bg-[#330816] border border-[#5c0f28] text-rose-100 text-xs px-3 py-1 rounded-full font-medium">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-[#22050e] border border-[#420a1c] p-4 rounded-2xl space-y-1">
                            <span className="text-xs text-rose-400/70 font-bold block uppercase tracking-wider">🎯 Milestone Project:</span>
                            <p className="text-xs text-rose-100/90 font-medium leading-relaxed">{step.practicalExercise}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI ADVISOR WORKSPACE */}
          {activeTab === 'advisor' && (
            <div className="h-full flex flex-col justify-between overflow-hidden bg-[#18040b] border border-[#360918] rounded-[24px] shadow-2xl">
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="text-[11px] text-rose-300/50 mb-1 px-1">
                      {msg.sender === 'user' ? (currentUser ? currentUser.name : 'You') : 'A.R.I.A Agent'} • {msg.timestamp}
                    </div>
                    <div className={`max-w-2xl px-5 py-3.5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-white text-black font-semibold rounded-tr-none shadow-md'
                        : 'bg-[#240610] border border-[#470d21] text-rose-100 rounded-tl-none shadow-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-rose-300/60 text-sm pl-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    <span>A.R.I.A is formulating career advice...</span>
                  </div>
                )}
              </div>

              <div className="px-6 py-3 border-t border-[#2d0714] bg-[#120308] flex flex-wrap gap-2">
                <span className="text-xs text-rose-300/50 self-center font-medium">Suggested queries:</span>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs bg-[#240610] hover:bg-[#380a1a] border border-[#470d21] text-rose-100 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-4 border-t border-[#2d0714] bg-[#120308] flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask A.R.I.A about skill gaps, portfolio projects, interview prep, or salaries..."
                  className="flex-1 bg-[#240610] border border-[#470d21] rounded-full px-5 py-3 text-sm text-white placeholder-rose-300/40 focus:outline-none focus:border-rose-500 transition-colors"
                />
                <button type="submit" className="bg-white text-black font-bold px-7 py-3 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer text-sm border border-white/20 shadow-lg">
                  Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PATH-TO-PATH LEARNING MODULE */}
          {activeTab === 'learn' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-[#18040b] border border-[#360918] p-6 sm:p-8 rounded-[28px] space-y-4 shadow-2xl relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2d0714] pb-4">
                  <div>
                    <span className="text-xs bg-[#280812] border border-[#4a0f22] text-[#f43f5e] px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                      Target Domain: {targetDomain}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      📚 Path-to-Path Learning Curriculum (11 Modules)
                    </h3>
                  </div>
                  
                  <div className="bg-[#240610] border border-[#470d21] px-4 py-2 rounded-2xl text-xs text-rose-200">
                    Track Progress: <strong className="text-emerald-400">{completedCount} / {allModules.length} Modules Passed</strong>
                  </div>
                </div>

                <p className="text-rose-100/75 text-xs sm:text-sm leading-relaxed max-w-3xl">
                  Study step-by-step topic modules tailored specifically to {targetDomain}. Pass each module test to unlock the next module in your roadmap!
                </p>
              </div>

              {/* Modules Curriculum List */}
              <div className="space-y-6">
                {allModules.map((mod, idx) => {
                  const isCompleted = completedModuleIds.includes(mod.id);
                  const unlocked = isModuleUnlocked(idx);

                  return (
                    <div key={mod.id} className={`p-6 sm:p-7 rounded-[28px] border space-y-5 transition-all shadow-xl ${
                      isCompleted
                        ? 'bg-[#0e0307] border-emerald-500/50'
                        : unlocked
                        ? 'bg-[#18040b] border-[#360918] hover:border-[#520f26]'
                        : 'bg-[#120308] border-[#24060e] opacity-75'
                    }`}>
                      {/* Module Title Row */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[#2d0714] pb-4">
                        <div className="flex items-start gap-4">
                          <span className={`w-10 h-10 rounded-full border flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${
                            isCompleted 
                              ? 'bg-[#062016] border-[#0d5c3a] text-emerald-400' 
                              : unlocked
                              ? 'bg-[#280812] border-[#4d1021] text-rose-100'
                              : 'bg-[#1a040b] border-[#330816] text-rose-400/50'
                          }`}>
                            {mod.phaseNumber}
                          </span>
                          <div>
                            <div className="text-xs text-rose-400/70 font-bold uppercase tracking-wider">{mod.subtitle} • {mod.duration}</div>
                            <h4 className="text-xl font-bold text-white mt-0.5">{mod.title}</h4>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                          {isCompleted && (
                            <span className="px-4 py-2 bg-[#062016] border border-[#0d5c3a] text-emerald-400 rounded-full text-xs font-bold">
                              ✓ Passed
                            </span>
                          )}

                          {unlocked && (
                            <button
                              onClick={() => setActiveReadingModuleIndex(idx)}
                              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-full text-xs transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                            >
                              <span>Start Learn 📖</span>
                            </button>
                          )}

                          {unlocked && mod.isMockInterviewModule ? (
                            <button
                              onClick={() => setActiveTab('mock-interview')}
                              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-full text-xs transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                            >
                              <span>Start Voice Mock Interview 🎙️</span>
                            </button>
                          ) : unlocked ? (
                            <button
                              onClick={() => startModuleTest(idx)}
                              className="px-4 py-2 bg-[#280812] hover:bg-[#3d0b1c] text-rose-200 border border-[#520f26] rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm"
                            >
                              {mod.isFinalCertification ? 'Take Certification Exam 🎓' : `Take Module ${mod.phaseNumber} Test 📝`}
                            </button>
                          ) : null}

                          {!unlocked && (
                            <span className="px-4 py-2 bg-[#240610] border border-[#470d21] text-rose-400/60 rounded-full text-xs font-semibold">
                              🔒 Complete Previous Module First
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-rose-100/85 text-xs sm:text-sm leading-relaxed">
                        {mod.description}
                      </p>

                      {/* Key Concepts Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#22050e] border border-[#420a1c] p-4 rounded-2xl space-y-2">
                          <span className="text-xs text-rose-400/80 font-bold block uppercase tracking-wider">🔑 Key Learning Concepts:</span>
                          <ul className="space-y-1.5 text-xs text-rose-100/90 list-disc list-inside">
                            {mod.keyConcepts.map((concept, cIdx) => (
                              <li key={cIdx}>{concept}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-[#22050e] border border-[#420a1c] p-4 rounded-2xl space-y-2">
                          <span className="text-xs text-rose-400/80 font-bold block uppercase tracking-wider">🛠️ Practical Exercise:</span>
                          <p className="text-xs text-rose-100/90 leading-relaxed font-medium">
                            {mod.practicalExercise}
                          </p>
                          <div className="text-[11px] text-emerald-400/90 pt-1">
                            🎯 Test Benchmark Focus: {mod.quizFocus}
                          </div>
                        </div>
                      </div>

                      {/* Code / Command Snippet */}
                      {mod.codeOrCommandSnippet && (
                        <div className="bg-[#0e0206] border border-[#300714] p-4 rounded-2xl space-y-1.5 font-mono">
                          <div className="text-[11px] text-rose-400/60 font-sans font-bold uppercase tracking-wider">Command / Code Reference Snippet:</div>
                          <pre className="text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {mod.codeOrCommandSnippet}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: TAKE DOMAIN SKILLS TEST MODULE */}
          {activeTab === 'test' && (
            <div className="space-y-6">
              {/* Test Header */}
              <div className="bg-[#18040b] border border-[#360918] p-6 sm:p-8 rounded-[28px] space-y-4 shadow-2xl relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2d0714] pb-4">
                  <div>
                    <span className="text-xs bg-[#280812] border border-[#4a0f22] text-[#f43f5e] px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                      Module {allModules[selectedTestModuleIndex]?.phaseNumber || 1}: {allModules[selectedTestModuleIndex]?.title || 'Module Test'}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      📝 {allModules[selectedTestModuleIndex]?.isFinalCertification ? '🎓 Full Course Master Certification Exam' : 'Module Skills Assessment Test'}
                    </h3>
                  </div>

                  {testSubmitted && testScore !== null && (
                    <div className={`px-4 py-2 rounded-2xl text-xs font-bold border ${
                      testPassed ? 'bg-[#062016] border-[#0d5c3a] text-emerald-400' : 'bg-[#2b0813] border-[#541126] text-rose-400'
                    }`}>
                      Result: {testScore} / 5 ({testPassed ? 'Passed' : 'Needs Review'})
                    </div>
                  )}
                </div>

                <p className="text-rose-100/75 text-xs sm:text-sm leading-relaxed max-w-3xl">
                  {allModules[selectedTestModuleIndex]?.isFinalCertification
                    ? 'Complete the master certification exam. Passing with a score of 60%+ unlocks your Acharya® Certified Professional Master Credentials!'
                    : `Score 60%+ (3/5) on this test to complete Module ${allModules[selectedTestModuleIndex]?.phaseNumber || 1} and unlock the next module in your roadmap!`}
                </p>
              </div>

              {/* TEST EXECUTION VIEW */}
              {!testSubmitted ? (
                <div className="bg-[#18040b] border border-[#360918] p-6 sm:p-8 rounded-[28px] space-y-6 shadow-2xl relative">
                  {/* Progress Header */}
                  <div className="flex justify-between items-center border-b border-[#2d0714] pb-4">
                    <span className="text-xs text-rose-300/80 font-bold uppercase tracking-wider">
                      Question {testCurrentIdx + 1} of {questionSet.questions.length}
                    </span>
                    <div className="w-36 bg-[#240610] h-2 rounded-full overflow-hidden border border-[#470d21]">
                      <div 
                        className="bg-rose-500 h-full transition-all duration-300"
                        style={{ width: `${((testCurrentIdx + 1) / questionSet.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="space-y-4">
                    <h4 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                      {questionSet.questions[testCurrentIdx].question}
                    </h4>

                    {/* Options List */}
                    <div className="space-y-3 pt-2">
                      {questionSet.questions[testCurrentIdx].options.map((opt, optIdx) => {
                        const isSelected = testAnswers[testCurrentIdx] === optIdx;

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleTestOptionSelect(optIdx)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                              isSelected
                                ? 'bg-[#2b0813] border-rose-500 text-white shadow-lg'
                                : 'bg-[#22050e] border-[#420a1c] text-rose-100/80 hover:bg-[#2d0714] hover:text-white'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isSelected ? 'bg-rose-500 border-rose-400 text-white' : 'border-rose-400/40 text-rose-300/60'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#2d0714]">
                    <button
                      onClick={() => setTestCurrentIdx(Math.max(0, testCurrentIdx - 1))}
                      disabled={testCurrentIdx === 0}
                      className="px-6 py-2.5 bg-[#240610] disabled:opacity-40 border border-[#470d21] text-rose-200 text-xs font-bold rounded-full transition-all cursor-pointer"
                    >
                      ← Previous Question
                    </button>

                    {testCurrentIdx < questionSet.questions.length - 1 ? (
                      <button
                        onClick={() => setTestCurrentIdx(testCurrentIdx + 1)}
                        className="px-8 py-2.5 bg-white text-black hover:bg-black hover:text-white border border-white/20 text-xs font-bold rounded-full transition-all cursor-pointer shadow-lg"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        onClick={handleTestSubmit}
                        disabled={testAnswers.some((a) => a === null)}
                        className="px-8 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-xl"
                      >
                        {testSaving ? 'Evaluating Results...' : 'Submit Test ✓'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* POST-TEST RESULTS REVIEW VIEW */
                <div className="space-y-6">
                  {/* Results Summary Card */}
                  <div className="bg-[#18040b] border border-[#360918] p-6 sm:p-8 rounded-[28px] space-y-6 shadow-2xl text-center">
                    <div className="text-4xl">{testPassed ? '🏆' : '📚'}</div>
                    <div className="space-y-2">
                      <div className="text-xs text-rose-400/80 uppercase font-bold tracking-widest">
                        {allModules[selectedTestModuleIndex]?.isFinalCertification ? 'Full Course Certification Evaluation' : `Module ${allModules[selectedTestModuleIndex]?.phaseNumber} Test Evaluation`}
                      </div>
                      <h3 className="text-3xl font-extrabold text-white">
                        Your Score: <span className={testPassed ? 'text-emerald-400' : 'text-rose-400'}>{testScore} / 5</span>
                      </h3>
                      
                      {testPassed ? (
                        <div className="space-y-1 pt-1">
                          <div className="inline-block bg-[#062016] border border-[#0d5c3a] text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                            ✓ PASSED & UNLOCKED NEXT MODULE
                          </div>
                          {allModules[selectedTestModuleIndex]?.isFinalCertification && (
                            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs rounded-2xl max-w-md mx-auto font-bold mt-2">
                              🎓 CONGRATULATIONS! You have completed all 11 modules and earned your Acharya® Certified Master Credentials!
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="inline-block bg-[#2b0813] border border-[#541126] text-rose-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                          Needs Review (Score 3/5 or higher to pass)
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                      <button
                        onClick={() => setActiveTab('my-roadmap')}
                        className="px-8 py-3 bg-white text-black border border-black/10 font-bold text-xs rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer shadow-xl"
                      >
                        View Slided Roadmap Tree →
                      </button>

                      <button
                        onClick={() => setActiveTab('learn')}
                        className="px-8 py-3 bg-[#240610] hover:bg-[#380a1a] border border-[#470d21] text-rose-100 font-bold text-xs rounded-full transition-colors cursor-pointer"
                      >
                        Study Next Module →
                      </button>

                      <button
                        onClick={resetTestState}
                        className="px-6 py-3 bg-transparent border border-[#380a18] text-rose-300 text-xs font-semibold rounded-full hover:bg-[#260711] transition-colors cursor-pointer"
                      >
                        Retake Test 🔄
                      </button>
                    </div>
                  </div>

                  {/* Question-by-Question Review List */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-white px-1" style={{ fontFamily: 'var(--font-heading)' }}>
                      🔍 Question Review & Detailed Explanations
                    </h4>

                    {questionSet.questions.map((q, idx) => {
                      const userAns = testAnswers[idx];
                      const isCorrect = userAns === q.correctAnswer;

                      return (
                        <div key={idx} className={`p-6 rounded-[24px] border space-y-3 ${
                          isCorrect
                            ? 'bg-[#062016]/40 border-[#0d5c3a]'
                            : 'bg-[#2b0813]/40 border-[#541126]'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-300/70 uppercase">Question {idx + 1}</span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                              isCorrect ? 'bg-[#062016] text-emerald-400 border border-[#0d5c3a]' : 'bg-[#2b0813] text-rose-400 border border-[#541126]'
                            }`}>
                              {isCorrect ? '✓ Correct (+1)' : '✗ Incorrect (0)'}
                            </span>
                          </div>

                          <h5 className="text-base font-bold text-white">{q.question}</h5>

                          <div className="space-y-1.5 text-xs pt-1">
                            <div className="text-rose-100/90">
                              Your Answer: <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                                {userAns !== null ? q.options[userAns] : 'Not answered'}
                              </strong>
                            </div>
                            {!isCorrect && (
                              <div className="text-emerald-400">
                                Correct Answer: <strong>{q.options[q.correctAnswer]}</strong>
                              </div>
                            )}
                          </div>

                          <div className="bg-[#18040b] p-3.5 rounded-2xl border border-[#360918] text-xs text-rose-100/80 leading-relaxed">
                            💡 <strong className="text-white">Explanation:</strong> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AI VOICE TECHNICAL MOCK INTERVIEW */}
          {activeTab === 'mock-interview' && (() => {
            const domainQuestions = INTERVIEW_QUESTIONS_BY_DOMAIN[targetDomain] || INTERVIEW_QUESTIONS_BY_DOMAIN['Cybersecurity & Ethical Hacking'];
            const currentQ = domainQuestions[interviewCurrentIdx] || domainQuestions[0];
            const isLastQ = interviewCurrentIdx === domainQuestions.length - 1;

            return (
              <div className="space-y-6">
                {/* Banner Header */}
                <div className="bg-[#18040b] border border-[#360918] p-6 sm:p-8 rounded-[28px] space-y-4 shadow-2xl relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2d0714] pb-4">
                    <div>
                      <span className="text-xs bg-[#280812] border border-[#4a0f22] text-[#f43f5e] px-3 py-1 rounded-full uppercase font-bold tracking-wider flex items-center gap-1.5 w-fit">
                        <span>🎙️ AI Voice Mock Interview</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        Module 12: AI Voice Technical Assessment ({targetDomain})
                      </h3>
                    </div>

                    {isInterviewStarted && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={resetInterview}
                          className="px-4 py-1.5 bg-[#280812] hover:bg-[#3d0b1c] text-rose-200 border border-[#520f26] rounded-full text-xs font-bold transition-all cursor-pointer"
                        >
                          🔄 Reset Interview
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-rose-100/75 text-xs sm:text-sm leading-relaxed max-w-3xl">
                    Live voice-conducted technical interview. The AI speaks questions out loud into your speakers, listens to your spoken answer via microphone, and if your answer is wrong, it verbally announces <strong className="text-rose-400">"Wrong answer"</strong>, explains <strong className="text-rose-400">why it is wrong</strong>, and displays the <strong className="text-emerald-400">full correct answer</strong>!
                  </p>
                </div>

                {!isInterviewStarted ? (
                  /* INTERVIEW LAUNCHER SCREEN */
                  <div className="bg-[#18040b] border border-[#360918] p-8 sm:p-12 rounded-[28px] text-center space-y-6 shadow-2xl">
                    <div className="w-20 h-20 mx-auto rounded-full bg-[#360918] border border-[#520f26] flex items-center justify-center text-4xl shadow-xl animate-pulse">
                      🎙️
                    </div>

                    <div className="space-y-2 max-w-xl mx-auto">
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                        Ready for Your Voice Mock Technical Interview?
                      </h4>
                      <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                        Clicking launch will activate the AI Voice Interviewer. The AI will speak each question out loud, auto-record your spoken voice answer, and evaluate your accuracy in real time.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2 text-left">
                      <div className="bg-[#240610] border border-[#470d21] p-4 rounded-2xl space-y-1">
                        <span className="text-base">🗣️</span>
                        <h5 className="text-xs font-bold text-white uppercase">Voice Questions</h5>
                        <p className="text-[11px] text-rose-300/70">AI speaks technical prompts out loud to you.</p>
                      </div>

                      <div className="bg-[#240610] border border-[#470d21] p-4 rounded-2xl space-y-1">
                        <span className="text-base">🎤</span>
                        <h5 className="text-xs font-bold text-white uppercase">Auto Microphone</h5>
                        <p className="text-[11px] text-rose-300/70">Microphone auto-activates when AI finishes asking.</p>
                      </div>

                      <div className="bg-[#240610] border border-[#470d21] p-4 rounded-2xl space-y-1">
                        <span className="text-base">🔊</span>
                        <h5 className="text-xs font-bold text-white uppercase">Wrong / Correct Voice</h5>
                        <p className="text-[11px] text-rose-300/70">Says 'Wrong answer', explains why & displays fix.</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={startVoiceInterview}
                        className="px-10 py-4 bg-white text-black hover:bg-black hover:text-white border border-white/20 font-extrabold text-sm sm:text-base rounded-full transition-all cursor-pointer shadow-2xl flex items-center gap-3 mx-auto"
                      >
                        <span>🎙️ Launch Live AI Voice Interview Chamber</span>
                      </button>
                    </div>
                  </div>
                ) : !interviewCompleted ? (
                  /* LIVE VOICE INTERVIEW CHAMBER */
                  <div className="bg-[#18040b] border border-[#360918] p-6 sm:p-8 rounded-[28px] space-y-6 shadow-2xl">
                    {/* Progress & Live Voice Status Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#2d0714] pb-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-rose-300/80 font-bold uppercase tracking-wider">
                          Question {interviewCurrentIdx + 1} of {domainQuestions.length}
                        </span>

                        {isSpeaking && (
                          <span className="text-xs bg-[#be123c] text-white px-3.5 py-1 rounded-full font-bold animate-pulse flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            <span>🔊 AI Interviewer Speaking Question...</span>
                          </span>
                        )}

                        {isListening && (
                          <span className="text-xs bg-emerald-600 text-white px-3.5 py-1 rounded-full font-bold animate-pulse flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            <span>🎤 Microphone Active — Speaking Your Answer...</span>
                          </span>
                        )}

                        {!isSpeaking && !isListening && !interviewEvaluation && !isEvaluating && (
                          <span className="text-xs bg-[#240610] text-rose-300 border border-[#470d21] px-3.5 py-1 rounded-full font-semibold">
                            Ready for Answer
                          </span>
                        )}
                      </div>

                      <div className="w-36 bg-[#240610] h-2 rounded-full overflow-hidden border border-[#470d21]">
                        <div
                          className="bg-rose-500 h-full transition-all duration-300"
                          style={{ width: `${((interviewCurrentIdx + 1) / domainQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Prompt Card */}
                    <div className="bg-[#240610] border border-[#470d21] p-6 rounded-2xl space-y-3 relative shadow-inner">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <span className="text-xs text-rose-400/80 uppercase font-extrabold tracking-wider">
                          Technical Question Prompt:
                        </span>

                        <button
                          onClick={() => playQuestionAudio(interviewCurrentIdx)}
                          className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer shadow-lg flex items-center gap-2 ${
                            isSpeaking
                              ? 'bg-[#be123c] text-white animate-pulse border border-rose-400'
                              : 'bg-[#360918] hover:bg-[#520f26] text-rose-100 border border-[#520f26]'
                          }`}
                        >
                          <span className="text-sm">🔊</span>
                          <span>{isSpeaking ? 'AI Currently Speaking Question... (Click to Re-play)' : 'Click to Listen / Speak Question Aloud 🔊'}</span>
                        </button>
                      </div>

                      <h4 className="text-lg sm:text-xl font-extrabold text-white leading-relaxed">
                        {currentQ.question}
                      </h4>

                      <div className="text-xs text-rose-300/60 font-medium">
                        💡 Key Focus: {currentQ.hint}
                      </div>
                    </div>

                    {/* Candidate Spoken Answer Transcript Card */}
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <label className="text-xs font-bold text-rose-200 uppercase tracking-wider flex items-center gap-2">
                          <span>🎙️ Candidate Spoken Voice Answer:</span>
                        </label>

                        <div className="flex items-center gap-2">
                          {!isListening ? (
                            <button
                              onClick={startSpeechRecognition}
                              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-full transition-all cursor-pointer shadow-xl flex items-center gap-2"
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                              <span>🎙️ Start Recording Answer</span>
                            </button>
                          ) : (
                            <button
                              onClick={stopSpeechRecognition}
                              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm rounded-full transition-all cursor-pointer shadow-xl flex items-center gap-2 animate-pulse"
                            >
                              <span>⏹️ Stop Recording</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <textarea
                        rows={4}
                        value={candidateVoiceTranscript}
                        onChange={(e) => setCandidateVoiceTranscript(e.target.value)}
                        placeholder="Click 'Start Recording Answer' to record your spoken response via microphone, or type your answer here..."
                        className="w-full bg-[#140309] border border-[#38091b] rounded-2xl p-4 text-sm text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 transition-colors leading-relaxed font-mono"
                      />
                    </div>

                    {/* Evaluation Action Button */}
                    {!interviewEvaluation && (
                      <div className="flex justify-end">
                        <button
                          onClick={handleInterviewSubmit}
                          disabled={!candidateVoiceTranscript.trim() || isEvaluating}
                          className="px-8 py-3 bg-white text-black hover:bg-black hover:text-white disabled:opacity-40 border border-white/20 font-extrabold text-xs sm:text-sm rounded-full transition-all cursor-pointer shadow-xl flex items-center gap-2"
                        >
                          {isEvaluating ? (
                            <>
                              <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
                              <span>AI Evaluating Spoken Answer...</span>
                            </>
                          ) : (
                            <span>Submit Answer for Voice Evaluation 🚀</span>
                          )}
                        </button>
                      </div>
                    )}

                    {/* AI VOICE EVALUATION & CORRECTION DISPLAY CARD */}
                    {interviewEvaluation && (
                      <div className={`p-6 sm:p-7 rounded-2xl border space-y-5 animate-fade-in-up shadow-2xl ${
                        interviewEvaluation.isCorrect
                          ? 'bg-[#062016] border-[#0d5c3a]'
                          : 'bg-[#2b0813] border-[#541126]'
                      }`}>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{interviewEvaluation.isCorrect ? '✅' : '❌'}</span>
                            <div>
                              <div className={`text-base font-extrabold uppercase tracking-wider ${
                                interviewEvaluation.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                              }`}>
                                {interviewEvaluation.isCorrect ? '✅ VERDICT: CORRECT ANSWER' : '❌ VERDICT: WRONG ANSWER'}
                              </div>
                              <div className="text-xs text-rose-200/80 font-medium mt-0.5">
                                AI Voice Spoken Assessment Active
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => speakAIText(interviewEvaluation.spokenFeedback)}
                            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>🔊 Re-play AI Voice Feedback</span>
                          </button>
                        </div>

                        {/* EXPLICIT WHY WRONG EXPLANATION CARD */}
                        {!interviewEvaluation.isCorrect && (
                          <div className="bg-[#18040b] border border-[#4a0f22] p-5 rounded-2xl space-y-2 shadow-inner">
                            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
                              <span>⚠️</span>
                              <span>Why your answer is wrong:</span>
                            </div>
                            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-medium">
                              {interviewEvaluation.whyWrong || 'Your answer was incomplete or lacked required command syntax, protocol details, or technical principles.'}
                            </p>
                          </div>
                        )}

                        {/* AUTHORITATIVE CORRECT ANSWER DISPLAY CARD */}
                        <div className="bg-[#120308] border border-white/10 p-5 rounded-2xl space-y-2 shadow-inner">
                          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                            <span>✅</span>
                            <span>Authoritative Correct Answer:</span>
                          </div>
                          <p className="text-xs sm:text-sm text-rose-100/95 leading-relaxed font-medium">
                            {interviewEvaluation.correctAnswer}
                          </p>
                        </div>

                        {/* Next Technical Question Button */}
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={handleNextInterviewQuestion}
                            className="px-8 py-3.5 bg-white text-black hover:bg-black hover:text-white border border-white/20 font-extrabold text-xs sm:text-sm rounded-full transition-all cursor-pointer shadow-2xl flex items-center gap-2"
                          >
                            <span>{isLastQ ? 'Complete Mock Interview 🎓' : 'Next Technical Question ➡️'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* INTERVIEW COMPLETED SUMMARY VIEW */
                  <div className="bg-[#18040b] border border-[#360918] p-6 sm:p-8 rounded-[28px] space-y-6 shadow-2xl text-center">
                    <div className="text-5xl">🎓</div>
                    <div className="space-y-2">
                      <span className="text-xs bg-[#062016] border border-[#0d5c3a] text-emerald-400 px-4 py-1.5 rounded-full font-extrabold uppercase tracking-wider">
                        ✓ Module 12: AI Voice Mock Technical Interview Passed
                      </span>
                      <h3 className="text-3xl font-extrabold text-white pt-2">
                        Mock Interview Results: <span className="text-emerald-400">{interviewResults.filter((r) => r.isCorrect).length} / {domainQuestions.length} Correct</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-rose-100/80 max-w-xl mx-auto">
                        Great job completing your AI Voice Technical Assessment! Your responses have been evaluated for domain depth, syntax precision, and spoken defense.
                      </p>
                    </div>

                    {/* Results Breakdown */}
                    <div className="space-y-4 text-left max-w-2xl mx-auto pt-2">
                      <h4 className="text-xs text-rose-400 font-bold uppercase tracking-wider">Detailed Performance Breakdown:</h4>
                      {interviewResults.map((res, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border space-y-2 ${
                          res.isCorrect ? 'bg-[#062016]/40 border-emerald-500/30' : 'bg-[#2b0813]/40 border-rose-500/30'
                        }`}>
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-bold text-white">Q{idx + 1}: {res.question}</span>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                              res.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}>
                              {res.isCorrect ? 'Correct' : 'Wrong'}
                            </span>
                          </div>
                          {!res.isCorrect && (
                            <div className="text-xs text-rose-300/80 pt-1 space-y-1">
                              <div><strong>Why wrong:</strong> {res.whyWrong}</div>
                              <div className="text-emerald-400 font-medium"><strong>Correct Answer:</strong> {res.correctAnswer}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                      <button
                        onClick={startVoiceInterview}
                        className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm rounded-full transition-all cursor-pointer shadow-xl"
                      >
                        Retake Voice Interview 🎙️
                      </button>

                      <button
                        onClick={() => setActiveTab('learn')}
                        className="px-8 py-3 bg-white text-black hover:bg-black hover:text-white font-extrabold text-xs sm:text-sm rounded-full transition-all cursor-pointer shadow-xl"
                      >
                        Back to Path-to-Path Learning 📚
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 6: PROFILE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto bg-[#18040b] border border-[#360918] p-6 sm:p-8 rounded-[28px] space-y-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Account Profile Settings</h3>
              
              {saveSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs rounded-full text-center">
                  ✓ Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs text-rose-300/80 mb-1 pl-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#240610] border border-[#470d21] rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-rose-300/80 mb-1 pl-1 font-semibold">Age</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(Number(e.target.value))}
                    className="w-full bg-[#240610] border border-[#470d21] rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-rose-300/80 mb-1 pl-1 font-semibold">Email</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full bg-[#1a040b] border border-[#330816] rounded-full px-5 py-3 text-sm text-rose-300/50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs text-rose-300/80 mb-1 pl-1 font-semibold">Target Domain</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.targetDomain || ''}
                    className="w-full bg-[#1a040b] border border-[#330816] rounded-full px-5 py-3 text-sm text-rose-300/50 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-black border border-black/10 font-bold rounded-full hover:bg-black hover:text-white transition-colors text-sm cursor-pointer shadow-xl"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* ========================================================= */}
      {/* INTERACTIVE POINT-TO-POINT CONCEPT STUDY READER MODAL */}
      {/* ========================================================= */}
      {activeReadingModuleIndex !== null && allModules[activeReadingModuleIndex] && (() => {
        const readingMod = allModules[activeReadingModuleIndex];
        const isModPassed = completedModuleIds.includes(readingMod.id);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#140309] border border-[#4a0f22] p-6 sm:p-8 rounded-[32px] max-w-3xl w-full shadow-2xl relative text-white my-auto max-h-[90vh] flex flex-col animate-fade-in-up">
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-[#2d0714]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#280812] border border-[#4a0f22] text-[#f43f5e] px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                      Module {readingMod.phaseNumber} • {readingMod.duration}
                    </span>
                    {isModPassed && (
                      <span className="text-xs bg-[#062016] border border-[#0d5c3a] text-emerald-400 px-3 py-1 rounded-full font-bold">
                        ✓ Passed
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    📖 {readingMod.title}
                  </h3>
                  <p className="text-xs text-rose-400/80 font-medium mt-1">{readingMod.subtitle}</p>
                </div>
                <button
                  onClick={() => setActiveReadingModuleIndex(null)}
                  className="text-rose-300/60 hover:text-white w-9 h-9 rounded-full bg-[#280812] border border-[#4a0f22] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1 custom-scrollbar">
                {/* Module Overview */}
                <div className="bg-[#1e040e] border border-[#38091a] p-4 sm:p-5 rounded-2xl space-y-2">
                  <h5 className="text-xs text-rose-400 font-bold uppercase tracking-wider">Module Overview</h5>
                  <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">{readingMod.description}</p>
                </div>

                {/* Point-to-Point Detailed Concepts */}
                {readingMod.detailedPointToPoint && readingMod.detailedPointToPoint.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-[#2d0714] pb-2">
                      <span className="text-base">📌</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Point-to-Point Concept Reader</h4>
                    </div>
                    {readingMod.detailedPointToPoint.map((sec, sIdx) => (
                      <div key={sIdx} className="bg-[#1a040c] border border-[#38091b] p-5 rounded-2xl space-y-3 shadow-md">
                        <h5 className="text-sm font-extrabold text-rose-300 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#360918] border border-[#520f26] text-rose-200 text-xs flex items-center justify-center font-bold">
                            {sIdx + 1}
                          </span>
                          {sec.heading}
                        </h5>
                        <ul className="space-y-2 text-xs sm:text-sm text-rose-100/90 pl-2">
                          {sec.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                              <span className="text-rose-500 font-bold mt-0.5">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                        {sec.codeSnippet && (
                          <div className="bg-[#0b0105] border border-[#2e0614] p-3.5 rounded-xl font-mono mt-3">
                            <div className="text-[10px] text-rose-400/60 font-sans font-bold uppercase tracking-wider mb-1">Code / Command Reference:</div>
                            <pre className="text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                              {sec.codeSnippet}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-[#1a040c] border border-[#38091b] p-5 rounded-2xl space-y-3">
                      <h5 className="text-sm font-extrabold text-rose-300">🔑 Key Learning Concepts</h5>
                      <ul className="space-y-2 text-xs sm:text-sm text-rose-100/90">
                        {readingMod.keyConcepts.map((kc, kIdx) => (
                          <li key={kIdx} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{kc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {readingMod.codeOrCommandSnippet && (
                      <div className="bg-[#0b0105] border border-[#2e0614] p-4 rounded-2xl font-mono">
                        <div className="text-[10px] text-rose-400/60 font-sans font-bold uppercase tracking-wider mb-1">Command / Snippet Reference:</div>
                        <pre className="text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {readingMod.codeOrCommandSnippet}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Practical Benchmark */}
                <div className="bg-[#1c040d] border border-[#420a1c] p-4 sm:p-5 rounded-2xl space-y-2">
                  <h5 className="text-xs text-rose-400 font-bold uppercase tracking-wider">🎯 Practical Exercise & Assessment Focus</h5>
                  <p className="text-xs sm:text-sm text-rose-100/90 font-medium leading-relaxed">{readingMod.practicalExercise}</p>
                  <div className="text-xs text-emerald-400 font-semibold pt-1">
                    Benchmark Focus: {readingMod.quizFocus}
                  </div>
                </div>
              </div>

              {/* Modal Footer Action */}
              <div className="pt-4 border-t border-[#2d0714] flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  onClick={() => setActiveReadingModuleIndex(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#240610] hover:bg-[#380a1a] border border-[#470d21] text-rose-200 text-xs font-bold rounded-full transition-colors cursor-pointer"
                >
                  Close Reader
                </button>

                <button
                  onClick={() => {
                    const currentIdx = activeReadingModuleIndex;
                    setActiveReadingModuleIndex(null);
                    startModuleTest(currentIdx);
                  }}
                  className="w-full sm:w-auto px-7 py-3 bg-white text-black hover:bg-black hover:text-white border border-white/20 text-xs sm:text-sm font-extrabold rounded-full transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
                >
                  <span>{readingMod.isFinalCertification ? "I'm Ready — Take Final Certification Exam 🎓" : `I'm Ready — Take Module ${readingMod.phaseNumber} Test Now 📝`}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* LOCKED NODE REASON MODAL POPUP */}
      {/* ========================================================= */}
      {lockedModalStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in-up">
          <div className="bg-[#18040b] border border-[#4a0f22] p-6 rounded-[28px] max-w-md w-full space-y-4 shadow-2xl relative text-white">
            <button
              onClick={() => setLockedModalStep(null)}
              className="absolute top-4 right-4 text-rose-300/60 hover:text-white w-8 h-8 rounded-full bg-[#280812] flex items-center justify-center text-xs"
            >
              ✕
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔒</span>
              <h4 className="text-lg font-bold text-white">{lockedModalStep.phase}: {lockedModalStep.title}</h4>
            </div>
            <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed bg-[#22050e] border border-[#420a1c] p-4 rounded-2xl">
              {lockedModalStep.prereqs}
            </p>
            <button
              onClick={() => setLockedModalStep(null)}
              className="w-full py-2.5 bg-white text-black font-bold text-xs rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
