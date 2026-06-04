import { Request, Response } from 'express';
import * as dashboardService from './dashboard.service';

export const getTasksThisMonth = async (req: Request, res: Response) => {
    try {
        const tasks = await dashboardService.getTasksThisMonth();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

export const getTasksLastTenDays = async (req: Request, res: Response) => {
    try {
        const tasks = await dashboardService.getTasksLastTenDays();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

export const getProjectMemberEnrolledThisMonth = async (req: Request, res: Response) => {
    try {
        const members = await dashboardService.getProjectMemberEnrolledThisMonth();
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project members' });
    }
};

export const getDevelopersEnrolledThisMonth = async (req: Request, res: Response) => {
    try {
        const developers = await dashboardService.getDevelopersEnrolledThisMonth();
        res.json(developers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch developers' });
    }
};

export const getProjectThisMonth = async (req: Request, res: Response) => {
    try {
        const projects = await dashboardService.getProjectThisMonth();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
