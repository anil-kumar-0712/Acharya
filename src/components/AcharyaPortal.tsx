import React, { useState } from 'react';
import { UserProfile, PersonalizedRoadmap } from '../types';

interface AcharyaPortalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  roadmap: PersonalizedRoadmap | null;
  onRetakeTest?: () => void;
  onOpenAuth?: () => void;
  initialTab?: 'my-roadmap' | 'advisor' | 'analytics' | 'roadmaps' | 'settings';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'aria';
  text: string;
  timestamp: string;
  roadmapData?: any;
}

export const AcharyaPortal: React.FC<AcharyaPortalProps> = ({
  isOpen,
  onClose,
  user,
  roadmap,
  onRetakeTest,
  onOpenAuth,
  initialTab = 'my-roadmap',
}) => {
  const [activeTab, setActiveTab] = useState<'my-roadmap' | 'advisor' | 'analytics' | 'roadmaps' | 'settings'>(
    roadmap ? 'my-roadmap' : 'advisor'
  );

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // AI Chat State
  const initialGreeting = user
    ? `Hello ${user.name}! I am A.R.I.A, Acharya's Adaptive Response Interface Agent. I have logged your profile target (${user.targetDomain}) ${user.level ? `with diagnostic level ${user.level}` : ''}. How can I assist your career progression today?`
    : "Hello! I am A.R.I.A, Acharya's Adaptive Response Interface Agent. I'm here to analyze your background, recommend tailored career paths, generate skill roadmaps, and guide your professional transition. Where shall we begin?";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'aria',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // General Category filter state for browsing roadmaps
  const [selectedDomainCategory, setSelectedDomainCategory] = useState<string>('ai');

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || '');
  const [editAge, setEditAge] = useState(user?.age || 24);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // AI Chat Handler
  const handleSendMessage = (textToSend?: string) => {
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

    setTimeout(() => {
      let replyText = "";
      const lower = text.toLowerCase();
      if (lower.includes('my roadmap') || lower.includes('diagnostic') || lower.includes('level')) {
        if (user && roadmap) {
          replyText = `Based on your placement diagnostic, your score is ${user.score}/5, classifying your level as ${user.level}. Your personalized roadmap for ${user.targetDomain} spans ${roadmap.estimatedTimeline} with expected salary potential of ${roadmap.expectedSalary}. You can inspect your complete milestone steps in the 'My Roadmap' section on the left sidebar!`;
        } else {
          replyText = "You haven't completed your 5-MCQ placement diagnostic test yet. Click 'Retake Test' on the sidebar to generate your custom roadmap!";
        }
      } else if (lower.includes('ai engineer') || lower.includes('ai')) {
        replyText = "Transitioning to AI Engineering requires mastering Python, matrix algebra, PyTorch, LLM agents, and vector databases. Check out the 'Explore Roadmaps' section on the left sidebar for full tracks!";
      } else {
        replyText = `Thank you for sharing that question regarding "${text}". Acharya's career intelligence engine recommends focusing on practical portfolio milestones aligned with high-growth industry standards. Shall we detail specific project requirements?`;
      }

      const ariaMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'aria',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, ariaMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const quickPrompts = user
    ? [
        `Review my diagnostic score for ${user.targetDomain}`,
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
    if (user) {
      const updated = { ...user, name: editName, age: editAge };
      localStorage.setItem('acharya_user', JSON.stringify(updated));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/95 backdrop-blur-2xl text-white overflow-hidden animate-fade-in-up">
      
      {/* ========================================================= */}
      {/* LEFT MENU SIDEBAR */}
      {/* ========================================================= */}
      <aside className={`w-64 lg:w-72 bg-zinc-950 border-r border-white/10 flex flex-col justify-between flex-shrink-0 transition-all duration-300 ${
        sidebarCollapsed ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Top Branding & User Card */}
        <div className="p-5 border-b border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onClose}>
              <span className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Acharya®
              </span>
              <span className="text-lg text-white select-none">✳︎</span>
            </div>
            <span className="text-[10px] bg-white/10 border border-white/20 text-white/80 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Portal
            </span>
          </div>

          {/* User Profile Card Snippet */}
          {user ? (
            <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-black font-bold flex items-center justify-center text-sm flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-sm font-semibold text-white truncate">{user.name}</div>
                <div className="text-[11px] text-emerald-400 font-medium truncate">
                  {user.level ? user.level.split(' ')[0] : 'Member'} ({user.score ?? 0}/5)
                </div>
                <div className="text-[10px] text-white/50 truncate">{user.targetDomain}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-white/90 transition-colors cursor-pointer"
            >
              Register / Login
            </button>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto text-sm">
          <div className="text-[10px] uppercase font-semibold text-white/40 px-3 mb-2 tracking-wider">
            Main Navigation
          </div>

          {roadmap && (
            <button
              onClick={() => setActiveTab('my-roadmap')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer text-left ${
                activeTab === 'my-roadmap'
                  ? 'bg-white text-black font-semibold shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">🎓</span>
              <span className="flex-1">My Roadmap</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('advisor')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer text-left ${
              activeTab === 'advisor'
                ? 'bg-white text-black font-semibold shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-base">💬</span>
            <span className="flex-1">AI Advisor (A.R.I.A)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer text-left ${
              activeTab === 'analytics'
                ? 'bg-white text-black font-semibold shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-base">📊</span>
            <span className="flex-1">Diagnostic Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer text-left ${
              activeTab === 'roadmaps'
                ? 'bg-white text-black font-semibold shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-base">🗺️</span>
            <span className="flex-1">Explore Roadmaps</span>
          </button>

          <div className="text-[10px] uppercase font-semibold text-white/40 px-3 mt-6 mb-2 tracking-wider">
            Account Management
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer text-left ${
              activeTab === 'settings'
                ? 'bg-white text-black font-semibold shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-base">⚙️</span>
            <span className="flex-1">Profile Settings</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {onRetakeTest && (
            <button
              onClick={onRetakeTest}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white/90 text-xs font-medium rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🔄 Retake 5-MCQ Test</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 bg-transparent text-white/50 hover:text-white text-xs text-center transition-colors cursor-pointer"
          >
            Exit to Hero Landing →
          </button>
        </div>

      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA (RIGHT SIDE) */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-black/60">
        
        {/* Top Navigation Bar */}
        <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white capitalize flex items-center gap-2">
              {activeTab === 'my-roadmap' && '🎓 My Personalized Career Roadmap'}
              {activeTab === 'advisor' && '💬 AI Career Advisor (A.R.I.A Workspace)'}
              {activeTab === 'analytics' && '📊 Skill Assessment & Diagnostic Analytics'}
              {activeTab === 'roadmaps' && '🗺️ Explore All Domain Skill Roadmaps'}
              {activeTab === 'settings' && '⚙️ Candidate Account Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="text-xs bg-white/10 border border-white/15 px-3 py-1.5 rounded-full text-white/80 hidden sm:inline-block">
                Domain: <strong className="text-white">{user.targetDomain}</strong>
              </span>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer text-sm"
              title="Close Portal"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: MY DIAGNOSTIC ROADMAP */}
          {activeTab === 'my-roadmap' && (
            <div>
              {roadmap && user ? (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-zinc-900/90 border border-white/15 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 rounded-full font-semibold uppercase">
                          Tier: {user.level}
                        </span>
                        <span className="text-xs text-white/50">Score: {user.score}/5</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {user.targetDomain} Track
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                        {roadmap.summary}
                      </p>
                    </div>

                    <div className="bg-black/60 border border-white/10 p-4 rounded-xl text-right space-y-1 self-stretch md:self-auto flex flex-col justify-center">
                      <div className="text-xs text-white/50">Timeline</div>
                      <div className="text-lg font-bold text-white">{roadmap.estimatedTimeline}</div>
                      <div className="text-xs text-emerald-400 font-medium">Potential: {roadmap.expectedSalary}</div>
                    </div>
                  </div>

                  {/* Milestone Steps */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">📍 Actionable Milestone Steps</h4>
                    <div className="space-y-4">
                      {roadmap.steps.map((step, idx) => (
                        <div key={idx} className="bg-zinc-900/90 border border-white/10 hover:border-white/30 rounded-xl p-5 transition-all space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/10 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="text-xs text-white/50 font-semibold">{step.phase} • {step.duration}</span>
                                <h5 className="text-base font-semibold text-white">{step.title}</h5>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">{step.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-1">
                              <span className="text-xs text-white/50 font-medium">Core Skills:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {step.keySkills.map((sk, sIdx) => (
                                  <span key={sIdx} className="text-xs bg-white/10 border border-white/15 px-2 py-0.5 rounded text-white/90">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-1">
                              <span className="text-xs text-white/50 font-medium">🎯 Milestone Project:</span>
                              <p className="text-xs text-white/90">{step.projectMilestone}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="text-4xl">🎯</div>
                  <h3 className="text-xl font-bold">No Diagnostic Test Taken Yet</h3>
                  <p className="text-sm text-white/60 max-w-md mx-auto">
                    Take your 5-MCQ placement test to calculate your skill level and generate a personalized career roadmap!
                  </p>
                  {onRetakeTest && (
                    <button
                      onClick={onRetakeTest}
                      className="px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-white/90 transition-colors cursor-pointer shadow-lg"
                    >
                      Take 5-MCQ Placement Test Now →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI ADVISOR WORKSPACE */}
          {activeTab === 'advisor' && (
            <div className="h-full flex flex-col justify-between overflow-hidden bg-black/40 rounded-xl border border-white/10">
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="text-[11px] text-white/40 mb-1 px-1">
                      {msg.sender === 'user' ? (user ? user.name : 'You') : 'A.R.I.A Agent'} • {msg.timestamp}
                    </div>
                    <div className={`max-w-2xl px-5 py-3.5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-white text-black font-normal rounded-tr-none'
                        : 'bg-zinc-900 border border-white/10 text-white rounded-tl-none shadow-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-white/50 text-sm pl-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>A.R.I.A is formulating career advice...</span>
                  </div>
                )}
              </div>

              <div className="px-6 py-2 border-t border-white/5 bg-zinc-950 flex flex-wrap gap-2">
                <span className="text-xs text-white/40 self-center">Suggested queries:</span>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-4 border-t border-white/10 bg-zinc-950 flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask A.R.I.A about skill gaps, portfolio projects, interview prep, or salaries..."
                  className="flex-1 bg-zinc-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                />
                <button type="submit" className="bg-white text-black font-medium px-6 py-3 rounded-xl hover:bg-white/90 transition-colors cursor-pointer text-sm">
                  Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: DIAGNOSTIC ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {user ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl space-y-3">
                    <div className="text-xs text-white/50">Diagnostic Score</div>
                    <div className="text-4xl font-extrabold text-white">{user.score ?? 0} / 5</div>
                    <div className="text-xs text-emerald-400 font-medium">Placement Verified</div>
                  </div>

                  <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl space-y-3">
                    <div className="text-xs text-white/50">Assigned Skill Tier</div>
                    <div className="text-xl font-bold text-white">{user.level || 'Unassigned'}</div>
                    <div className="text-xs text-white/60">Based on 5-MCQ test benchmark</div>
                  </div>

                  <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl space-y-3">
                    <div className="text-xs text-white/50">Target Focus Domain</div>
                    <div className="text-base font-bold text-white">{user.targetDomain}</div>
                    <div className="text-xs text-white/60">Age: {user.age} yrs</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-white/60">
                  Please log in or register to view diagnostic analytics.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EXPLORE ROADMAPS */}
          {activeTab === 'roadmaps' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-semibold">Verified Career Tracks</h3>
                  <p className="text-xs text-white/60">Explore skill blueprints for top tech domains.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RoadmapCard
                  title="AI & Machine Learning Engineer"
                  duration="6 Months"
                  salary="$140,000 - $220,000"
                  skills={["PyTorch", "Transformers", "Vector DBs", "MLOps"]}
                  onSelect={() => handleSendMessage("Tell me more about becoming an AI Engineer")}
                />
                <RoadmapCard
                  title="Fullstack Web Developer"
                  duration="5-6 Months"
                  salary="$95,000 - $160,000"
                  skills={["TypeScript", "React / Next.js", "Node.js", "PostgreSQL"]}
                  onSelect={() => handleSendMessage("How do I become a Fullstack Web Developer?")}
                />
                <RoadmapCard
                  title="Cloud & DevOps Architect"
                  duration="6-8 Months"
                  salary="$150,000 - $230,000"
                  skills={["Docker & Kubernetes", "Terraform IaC", "AWS / GCP", "CI/CD Pipelines"]}
                  onSelect={() => handleSendMessage("How do I become a Cloud & DevOps Architect?")}
                />
                <RoadmapCard
                  title="Product Manager & Strategy Lead"
                  duration="4-6 Months"
                  salary="$130,000 - $190,000"
                  skills={["RICE Prioritization", "Customer Analytics", "Agile / Scrum", "Product Discovery"]}
                  onSelect={() => handleSendMessage("How do I become a Product Manager?")}
                />
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto bg-zinc-900 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-6">
              <h3 className="text-xl font-bold">Account Profile Settings</h3>
              
              {saveSuccess && (
                <div className="p-3 bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs rounded-xl">
                  ✓ Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/70 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1">Age</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1">Target Domain</label>
                  <input
                    type="text"
                    disabled
                    value={user?.targetDomain || ''}
                    className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/50 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors text-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

    </div>
  );
};

interface RoadmapCardProps {
  title: string;
  duration: string;
  salary: string;
  skills: string[];
  onSelect: () => void;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ title, duration, salary, skills, onSelect }) => (
  <div className="bg-zinc-900 border border-white/10 hover:border-white/30 rounded-xl p-5 transition-all flex flex-col justify-between space-y-4">
    <div>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-lg text-white">{title}</h4>
        <span className="text-[11px] bg-white/10 text-white/80 px-2 py-0.5 rounded border border-white/15">
          {duration}
        </span>
      </div>
      <div className="text-xs text-emerald-400 font-medium mb-3">Est. Salary: {salary}</div>
      <div className="space-y-1.5">
        <div className="text-xs text-white/50">Core Skills:</div>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill, i) => (
            <span key={i} className="text-xs bg-black/60 border border-white/10 text-white/80 px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>

    <button
      onClick={onSelect}
      className="w-full py-2.5 bg-white/10 hover:bg-white hover:text-black text-white text-xs font-medium rounded-lg transition-colors cursor-pointer border border-white/20"
    >
      Discuss with A.R.I.A →
    </button>
  </div>
);
