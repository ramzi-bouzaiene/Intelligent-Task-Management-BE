import { Request, Response } from 'express';
import * as aiService from './ai.service';

type GenerateProjectDescriptionBody = {
  projectName?: string;
};

export const generateProjectDescription = async (
  req: Request<{}, {}, GenerateProjectDescriptionBody>,
  res: Response,
) => {
  try {
    const { projectName } = req.body;

    if (!projectName?.trim()) {
      return res.status(400).json({
        error: 'projectName is required',
      });
    }

    const description = await aiService.generateProjectDescription(projectName.trim());

    res.json({ description });
  } catch (err) {
    console.error('AI description error:', err);
    res.status(500).json({ error: 'Failed to generate project description' });
  }
};