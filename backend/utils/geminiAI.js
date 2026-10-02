import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Preferred working models in priority order
const MODELS = [
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-2.5-flash'
];

/**
 * Helper to invoke Gemini REST API with fallback models
 */
async function callGeminiAPI(userQuery, systemPrompt = '') {
  const contents = [
    {
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUser Question: "${userQuery}"\nProvide a direct, intelligent response to the user question above.` }]
    }
  ];

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (!response.ok) {
        console.warn(`Gemini API model ${model} status:`, response.status);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log(`  ➜  Gemini AI (${model}): Generated direct response.`);
        return text;
      }
    } catch (err) {
      console.warn(`Gemini API call failed for model ${model}:`, err.message);
    }
  }

  return null;
}

/**
 * 1. A.R.I.A AI Advisor Chat Bot Response
 */
export async function generateAIChatResponse(message, userContext = {}) {
  const name = userContext.name || 'Candidate';
  const domain = userContext.targetDomain || 'Technology';
  const score = userContext.score !== undefined ? userContext.score : 'Not taken';
  const level = userContext.level || 'Beginner';

  const systemPrompt = `You are A.R.I.A (Adaptive Response Interface Agent), the AI Career Assistant for Acharya®. 
Candidate Profile: ${name}, Target Domain: ${domain}, Score: ${score}/5, Level: ${level}.
Instructions: Answer the user's specific input question directly, naturally, and accurately. If they engage in casual conversation (e.g., greetings, 'have you eaten food', personality questions), answer directly as a friendly AI agent before offering career guidance. Be concise and conversational.`;

  const aiText = await callGeminiAPI(message, systemPrompt);

  if (aiText) {
    return aiText.trim();
  }

  // Fallback if offline
  return `Hello ${name}! As your A.R.I.A AI Agent, I'm here to answer questions regarding "${message}", guide your ${domain} preparation, analyze skill gaps, and help you land top tech roles!`;
}

/**
 * 2. Generate Dynamic Skill Roadmap
 */
export async function generateDynamicRoadmap(domain, score, userName = 'Candidate') {
  const prompt = `Generate a structured 4-phase career roadmap JSON for "${userName}" targeting "${domain}" with score ${score}/5.
Return ONLY valid raw JSON with NO markdown formatting matching:
{
  "userLevel": "Beginner (Foundational)",
  "estimatedTimeline": "6 - 8 Months",
  "expectedSalary": "$75,000 - $110,000 / year",
  "summary": "Custom roadmap summary...",
  "steps": [
    {
      "phase": "Phase 1 - Weeks 1-4",
      "title": "Core Fundamentals",
      "description": "Foundational skills explanation",
      "keySkills": ["Skill1", "Skill2", "Skill3"],
      "projectMilestone": "Project description",
      "duration": "4 Weeks"
    }
  ]
}`;

  const jsonText = await callGeminiAPI(prompt, 'You are an expert technical career curriculum designer.');
  if (jsonText) {
    try {
      const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Failed to parse Gemini Roadmap JSON:", e.message);
    }
  }

  return null;
}

/**
 * 3. Generate Domain MCQ Diagnostic Questions
 */
export async function generateMCQTest(domain) {
  const prompt = `Generate 5 high-quality diagnostic placement MCQ questions for "${domain}".
Return ONLY valid raw JSON with NO markdown formatting matching:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
      "correctAnswer": 0,
      "explanation": "Explanation"
    }
  ]
}`;

  const jsonText = await callGeminiAPI(prompt, 'You are a senior technical interviewer.');
  if (jsonText) {
    try {
      const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Failed to parse Gemini MCQ JSON:", e.message);
    }
  }

  return null;
}

/**
 * 4. Evaluate AI Voice Technical Mock Interview Spoken Answer
 */
export async function evaluateMockInterviewAnswer(domain, question, candidateAnswer) {
  const prompt = `You are a strict technical interviewer evaluating a candidate's spoken answer for a position in "${domain}".
Question: "${question}"
Candidate Spoken Answer: "${candidateAnswer}"

Analyze if the candidate's answer is correct or wrong/incomplete.
Return ONLY valid raw JSON with NO markdown formatting matching:
{
  "isCorrect": boolean,
  "verdict": "Correct" or "Wrong",
  "whyWrong": "Clear explanation of why the answer is wrong, inaccurate, or missing essential concepts (empty string if correct)",
  "correctAnswer": "The full, authoritative correct answer explaining key concepts, commands, or principles",
  "spokenFeedback": "Short 2-3 sentence string for AI Speech Synthesis. IF WRONG: start explicitly with 'Wrong answer.' followed by why it is wrong and the correct answer. IF CORRECT: start with 'Correct! Excellent explanation.'"
}`;

  const jsonText = await callGeminiAPI(prompt, 'You are an authoritative senior technical interview evaluator for top tech firms.');
  if (jsonText) {
    try {
      const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Failed to parse Gemini Interview Evaluation JSON:", e.message);
    }
  }

  // Fallback evaluation if offline
  const isOk = candidateAnswer.trim().length > 12;
  return {
    isCorrect: isOk,
    verdict: isOk ? 'Correct' : 'Wrong',
    whyWrong: isOk ? '' : 'The provided spoken answer lacked specific technical depth, syntax commands, or architectural principles.',
    correctAnswer: `For ${question}, a comprehensive answer explains the underlying core mechanics, configuration details, error handling, and production best practices.`,
    spokenFeedback: isOk
      ? "Correct! Excellent explanation of the core principles."
      : `Wrong answer. The response lacked essential technical depth for ${domain}. The correct answer requires explaining the exact mechanism and standard implementation.`
  };
}

