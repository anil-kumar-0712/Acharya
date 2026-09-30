import { PersonalizedRoadmap, TargetDomain } from '../types';

export function generatePersonalizedRoadmap(
  domain: TargetDomain,
  score: number,
  userName: string
): PersonalizedRoadmap {
  let level: 'Beginner (Foundational)' | 'Intermediate (Practitioner)' | 'Advanced (Architect)';
  let timeline: string;
  let salary: string;
  let summary: string;

  if (score <= 1) {
    level = 'Beginner (Foundational)';
    timeline = '6 - 8 Months';
    salary = '$75,000 - $110,000 / year';
    summary = `Welcome ${userName}! Based on your diagnostic score (${score}/5), Acharya has crafted a foundational, step-by-step learning track to build solid core competencies in ${domain}.`;
  } else if (score <= 3) {
    level = 'Intermediate (Practitioner)';
    timeline = '4 - 6 Months';
    salary = '$110,000 - $160,000 / year';
    summary = `Great job ${userName}! Your diagnostic score (${score}/5) demonstrates solid foundational knowledge in ${domain}. Acharya's intermediate track focuses on real-world projects, production architectures, and specialization.`;
  } else {
    level = 'Advanced (Architect)';
    timeline = '2 - 4 Months Fast-Track';
    salary = '$160,000 - $240,000+ / year';
    summary = `Outstanding ${userName}! Scoring ${score}/5 places you in the top tier for ${domain}. Acharya's fast-track focuses on high-level system design, leadership execution, and senior/lead positioning.`;
  }

  // Domain specific steps generator
  const steps = getStepsForDomain(domain, level);

  return {
    userLevel: level,
    domain,
    estimatedTimeline: timeline,
    expectedSalary: salary,
    summary,
    steps,
  };
}

function getStepsForDomain(domain: TargetDomain, level: string) {
  switch (domain) {
    case 'Artificial Intelligence & Machine Learning':
      return [
        {
          phase: 'Phase 1',
          title: 'Mathematics, Vector Linear Algebra & Python AI Libraries',
          duration: 'Weeks 1 - 4',
          description: 'Master Python 3.12, NumPy, Pandas matrix operations, and vector calculus essentials required for neural modeling.',
          keySkills: ['NumPy', 'Pandas', 'Vector Algebra', 'Scikit-Learn'],
          recommendedResources: ['DeepLearning.AI Math for ML', 'Python Data Science Handbook', 'Fast.ai Foundations'],
          projectMilestone: 'Build an end-to-end Predictive Housing Analytics Model with automated feature scaling.'
        },
        {
          phase: 'Phase 2',
          title: 'Deep Learning Architectures & PyTorch Fine-Tuning',
          duration: 'Weeks 5 - 10',
          description: 'Train Convolutional & Recurrent Neural Networks, implement attention mechanisms, and fine-tune open-weight models.',
          keySkills: ['PyTorch', 'Transformer Architecture', 'Hyperparameter Tuning', 'HuggingFace'],
          recommendedResources: ['PyTorch Official Tutorials', 'Andrej Karpathy Neural Networks From Scratch', 'HuggingFace NLP Course'],
          projectMilestone: 'Train a custom BERT Transformer model for domain-specific sentiment analysis.'
        },
        {
          phase: 'Phase 3',
          title: 'LLM Agents, RAG Pipelines & Vector Database Orchestration',
          duration: 'Weeks 11 - 16',
          description: 'Architect Enterprise RAG systems using LangChain/LlamaIndex, Pinecone vector stores, and custom autonomous agents.',
          keySkills: ['LangChain', 'Pinecone / Qdrant', 'RAG Optimization', 'Function Calling'],
          recommendedResources: ['LangChain Architecture Docs', 'Pinecone Vector Academy', 'DeepLearning.AI Building LLM Agents'],
          projectMilestone: 'Deploy an Autonomous AI Career Research Assistant with multi-document vector retrieval.'
        },
        {
          phase: 'Phase 4',
          title: 'MLOps, Model Quantization & Cloud Production Deployment',
          duration: 'Weeks 17 - 24',
          description: 'Containerize AI inference workloads using vLLM/Ollama, setup CI/CD pipelines, and monitor model drift in AWS.',
          keySkills: ['vLLM', 'Docker', 'MLflow', 'Triton Inference Server'],
          recommendedResources: ['Full Stack LLM Bootcamps', 'AWS SageMaker Guides', 'Made With ML MLOps'],
          projectMilestone: 'Deploy a scalable API endpoint serving quantized LLM models with sub-100ms latency.'
        }
      ];

    case 'Fullstack Web Development':
      return [
        {
          phase: 'Phase 1',
          title: 'Modern TypeScript, React 18+ & State Architecture',
          duration: 'Weeks 1 - 4',
          description: 'Master strong TypeScript typing, component lifecycle hooks, performance optimization, and global state management.',
          keySkills: ['TypeScript', 'React 18', 'Tailwind CSS', 'Zustand / Redux'],
          recommendedResources: ['TypeScript Handbook', 'React Official Docs', 'Execute Program TS Track'],
          projectMilestone: 'Build a high-performance interactive Dashboard with dynamic themes and drag-and-drop widgets.'
        },
        {
          phase: 'Phase 2',
          title: 'Backend Systems, REST/GraphQL APIs & PostgreSQL',
          duration: 'Weeks 5 - 10',
          description: 'Construct secure Node.js microservices, design relational schemas with Prisma ORM, and write optimized SQL joins.',
          keySkills: ['Node.js', 'Express / NestJS', 'PostgreSQL', 'Prisma ORM'],
          recommendedResources: ['Node.js Design Patterns', 'PostgreSQL Tutorial', 'Prisma Docs'],
          projectMilestone: 'Develop a multi-tenant SaaS authentication & billing engine with JWT security.'
        },
        {
          phase: 'Phase 3',
          title: 'Server-Side Rendering, Next.js & App Router',
          duration: 'Weeks 11 - 16',
          description: 'Harness Next.js server components, streaming SSR, edge functions, and SEO performance optimization.',
          keySkills: ['Next.js 14', 'Server Actions', 'Vercel Edge', 'Web Vitals'],
          recommendedResources: ['Next.js Learn Course', 'Lee Robinson Web Vitals Guide'],
          projectMilestone: 'Build a full-fledged E-commerce marketplace with real-time inventory updates.'
        },
        {
          phase: 'Phase 4',
          title: 'DevOps Deployment, Testing & System Architecture',
          duration: 'Weeks 17 - 24',
          description: 'Write comprehensive integration tests, configure Docker containers, and set up automated GitHub Actions deployment.',
          keySkills: ['Docker', 'Vitest / Cypress', 'CI/CD Pipelines', 'AWS S3 & CloudFront'],
          recommendedResources: ['Testing JavaScript by Kent C Dodds', 'Docker for Web Developers'],
          projectMilestone: 'Publish a production Web Application with 99.9% uptime CI/CD automated pipeline.'
        }
      ];

    default:
      return [
        {
          phase: 'Phase 1',
          title: 'Core Fundamentals & Essential Skillset',
          duration: 'Weeks 1 - 4',
          description: `Build a solid, unshakeable foundation in key principles and industry practices for ${domain}.`,
          keySkills: ['Core Theory', 'Standard Tooling', 'Basic Workflows'],
          recommendedResources: ['Official Documentation', 'Interactive Workshops'],
          projectMilestone: 'Complete foundational diagnostic projects and portfolio setup.'
        },
        {
          phase: 'Phase 2',
          title: 'Advanced Applied Skills & Frameworks',
          duration: 'Weeks 5 - 10',
          description: 'Deep dive into real-world applications, industry workflows, and framework execution.',
          keySkills: ['Framework Mastery', 'Problem Solving', 'Best Practices'],
          recommendedResources: ['Industry Case Studies', 'Masterclass Guides'],
          projectMilestone: 'Deliver an intermediate end-to-end domain project.'
        },
        {
          phase: 'Phase 3',
          title: 'Production System Architecture & Specialization',
          duration: 'Weeks 11 - 16',
          description: 'Architect complex solutions, optimize performance metrics, and handle edge cases.',
          keySkills: ['System Design', 'Performance Optimization', 'Security & Compliance'],
          recommendedResources: ['Architecture Reference Patterns', 'Advanced Courses'],
          projectMilestone: 'Architect and execute a capstone domain system.'
        }
      ];
  }
}
