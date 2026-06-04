import { Request, Response } from 'express';
import * as dashboardService from './dashboard.service';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const data = await dashboardService.getDashboardData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};