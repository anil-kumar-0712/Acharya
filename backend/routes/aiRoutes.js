import express from 'express';
import { generateAIChatResponse, generateDynamicRoadmap, generateMCQTest, evaluateMockInterviewAnswer } from '../utils/geminiAI.js';

const router = express.Router();

// 1. AI Bot Chat Endpoint (A.R.I.A)
router.post('/chat', async (req, res) => {
  try {
    const { message, userContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const reply = await generateAIChatResponse(message, userContext || {});
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Chat Route Error:", error);
    return res.status(500).json({ error: 'Failed to process AI chat message' });
  }
});

// 2. Generate Dynamic Roadmap via Gemini AI
router.post('/generate-roadmap', async (req, res) => {
  try {
    const { domain, score, name } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Target domain is required' });
    }

    const roadmap = await generateDynamicRoadmap(domain, score || 0, name || 'Candidate');
    return res.status(200).json({ roadmap });
  } catch (error) {
    console.error("AI Generate Roadmap Error:", error);
    return res.status(500).json({ error: 'Failed to generate AI roadmap' });
  }
});

// 3. Generate Domain MCQ Test via Gemini AI
router.post('/generate-mcq', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const testSet = await generateMCQTest(domain);
    return res.status(200).json({ testSet });
  } catch (error) {
    console.error("AI Generate MCQ Error:", error);
    return res.status(500).json({ error: 'Failed to generate MCQ test' });
  }
});

// 4. Evaluate Spoken Mock Interview Answer via Gemini AI
router.post('/evaluate-interview', async (req, res) => {
  try {
    const { domain, question, candidateAnswer } = req.body;
    if (!domain || !question || !candidateAnswer) {
      return res.status(400).json({ error: 'Domain, question, and candidateAnswer are required' });
    }

    const evaluation = await evaluateMockInterviewAnswer(domain, question, candidateAnswer);
    return res.status(200).json({ evaluation });
  } catch (error) {
    console.error("AI Interview Evaluation Error:", error);
    return res.status(500).json({ error: 'Failed to evaluate interview answer' });
  }
});

export default router;
