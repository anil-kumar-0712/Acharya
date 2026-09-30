export type TargetDomain = 
  | 'Artificial Intelligence & Machine Learning'
  | 'Fullstack Web Development'
  | 'Cloud & DevOps Architecture'
  | 'Product Management & Strategy'
  | 'UI/UX & Interactive Design'
  | 'Cybersecurity & Ethical Hacking';

export interface UserProfile {
  name: string;
  age: number;
  email: string;
  targetDomain: TargetDomain;
  isTestCompleted?: boolean;
  score?: number; // 0 to 5
  level?: 'Beginner (Foundational)' | 'Intermediate (Practitioner)' | 'Advanced (Architect)';
  completedAt?: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
}

export interface DomainQuestionSet {
  domain: TargetDomain;
  questions: MCQQuestion[];
}

export interface GeneratedRoadmapStep {
  phase: string;
  title: string;
  duration: string;
  description: string;
  keySkills: string[];
  recommendedResources: string[];
  projectMilestone: string;
}

export interface PersonalizedRoadmap {
  userLevel: string;
  domain: TargetDomain;
  estimatedTimeline: string;
  expectedSalary: string;
  summary: string;
  steps: GeneratedRoadmapStep[];
}
