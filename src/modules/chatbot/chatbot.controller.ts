import { Request, Response } from 'express';
import { generateAIResponse } from './chatbot.service';
import { GenerateAIRequestDTO } from './chatbot.dto';

export const handleGenerateAI = async (
  req: Request<{}, {}, GenerateAIRequestDTO>,
  res: Response,
) => {
  try {
    console.log('[AUTH] decoded user:', (req as any).user);

    const prompt = req.body.prompt;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await generateAIResponse(prompt, userId);
    res.json({ response: result });
  } catch (err) {
    console.error('Controller Error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
};
