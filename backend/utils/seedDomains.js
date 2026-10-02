import { Domain } from '../models/Domain.js';

export const seedInitialDomains = async () => {
  try {
    const count = await Domain.countDocuments();
    if (count === 0) {
      const initialDomains = [
        {
          name: 'Artificial Intelligence & Machine Learning',
          category: 'AI / Data Science',
          description: 'Master Deep Learning, Neural Networks, PyTorch, LLMs, Vector Databases, and MLOps.',
          demandIndex: 'Extremely High',
          averageSalary: '$140,000 - $220,000',
          coreSkills: ['Python', 'PyTorch', 'Transformers', 'Vector DBs', 'LangChain', 'MLOps'],
          popularRoles: ['AI Systems Engineer', 'Machine Learning Engineer', 'LLM Architect'],
        },
        {
          name: 'Fullstack Web Development',
          category: 'Software Engineering',
          description: 'Build modern responsive web applications using React, Next.js, Node.js, and PostgreSQL.',
          demandIndex: 'High Demand',
          averageSalary: '$95,000 - $160,000',
          coreSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST / GraphQL'],
          popularRoles: ['Fullstack Engineer', 'Frontend Architect', 'Backend Developer'],
        },
        {
          name: 'Cloud & DevOps Architecture',
          category: 'Infrastructure',
          description: 'Design resilient cloud infrastructures using AWS, Docker, Kubernetes, and Terraform.',
          demandIndex: 'High Demand',
          averageSalary: '$150,000 - $230,000',
          coreSkills: ['AWS / GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
          popularRoles: ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer'],
        },
        {
          name: 'Product Management & Strategy',
          category: 'Management',
          description: 'Lead product strategy, user discovery, RICE prioritization, agile sprints, and growth funnels.',
          demandIndex: 'High Demand',
          averageSalary: '$130,000 - $190,000',
          coreSkills: ['RICE Prioritization', 'Product Discovery', 'User Analytics', 'Agile / Scrum', 'A/B Testing'],
          popularRoles: ['Product Manager', 'Technical PM', 'Group Product Lead'],
        },
        {
          name: 'UI/UX & Interactive Design',
          category: 'Design & Creative',
          description: 'Craft intuitive user experiences, design systems, WCAG accessible interfaces, and interactive prototypes.',
          demandIndex: 'High Demand',
          averageSalary: '$85,000 - $150,000',
          coreSkills: ['Figma', 'User Research', 'Design Systems', 'WCAG Accessibility', 'Prototyping'],
          popularRoles: ['Product Designer', 'UI/UX Designer', 'Design Systems Specialist'],
        },
        {
          name: 'Cybersecurity & Ethical Hacking',
          category: 'Security',
          description: 'Protect organizational assets via vulnerability auditing, penetration testing, XSS/SQLi defense, and Cryptography.',
          demandIndex: 'Extremely High',
          averageSalary: '$120,000 - $200,000',
          coreSkills: ['Ethical Hacking', 'Penetration Testing', 'OWASP Top 10', 'Cryptography', 'SIEM / SOC'],
          popularRoles: ['Security Engineer', 'Penetration Tester', 'Cybersecurity Analyst'],
        },
      ];

      await Domain.insertMany(initialDomains);
      console.log('  ➜  Seeded 6 default domains into MongoDB "domains" collection!');
    }
  } catch (err) {
    console.warn('  ➜  Domain seeding warning:', err.message);
  }
};
